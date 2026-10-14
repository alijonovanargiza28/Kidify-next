import { getAccessToken, sessionManager, expireAuthentication, isInvalidSession } from '../auth/session';
import { REACT_APP_API_WS } from '../config';
type Listener = (event: string, data: any, requestId?: string) => void;
/** One authenticated connection for the whole app; reconnect never creates new message IDs. */
export class ChatTransport {
	private ws?: WebSocket;
	private stopped = false;
	private ready = false;
	private reconnect?: ReturnType<typeof setTimeout>;
	private refreshTimer?: ReturnType<typeof setInterval>;
	private retry = 0;
	private refreshRetry?: ReturnType<typeof setTimeout>;
	private refreshing?: Promise<void>;
	private pending = new Map<
		string,
		{
			payload: any;
			sentSocket?: WebSocket;
			resolve: (value: any) => void;
			reject: (error: Error) => void;
			timer: ReturnType<typeof setTimeout>;
		}
	>();
	constructor(private listener: Listener) {}
	start() {
		this.stopped = false;
		this.connect();
		this.refreshTimer = setInterval(() => void this.refresh(), 14 * 60000);
	}
	private async refresh() {
		if (this.refreshing) return this.refreshing;
		this.refreshing = sessionManager
			.refresh()
			.then(() => {
				if (!this.stopped && this.ws?.readyState === WebSocket.OPEN) this.authenticate();
			})
			.catch((error) => {
				if (isInvalidSession(error)) { expireAuthentication(); this.stop(); }
				else if (!this.stopped && error.message !== 'AUTH_SESSION_CHANGED') {
					this.listener('connection', 'offline');
					clearTimeout(this.refreshRetry);
					this.refreshRetry = setTimeout(() => void this.refresh(), 15000);
				}
			})
			.finally(() => {
				this.refreshing = undefined;
			});
		return this.refreshing;
	}
	private authenticate() {
		this.ws?.send(JSON.stringify({ event: 'authenticate', data: { token: getAccessToken() } }));
	}
	private connect() {
		if (this.stopped) return;
		this.listener('connection', 'connecting');
		const ws = new WebSocket(REACT_APP_API_WS);
		this.ws = ws;
		ws.onopen = async () => {
			if (this.refreshing) await this.refreshing;
			if (!this.stopped && ws.readyState === WebSocket.OPEN) this.authenticate();
		};
		ws.onmessage = (event) => {
			let message: any;
			try {
				message = JSON.parse(event.data);
			} catch {
				return;
			}
			if (message.event === 'authRequired') {
				this.ready = false;
				void this.refresh();
				return;
			}
			if (message.event === 'authenticated') {
				this.ready = true;
				this.retry = 0;
				this.listener('connection', 'connected');
				for (const request of Array.from(this.pending.values()))
					if (request.sentSocket !== ws) {
						request.sentSocket = ws;
						ws.send(JSON.stringify({ event: 'chat', data: request.payload }));
					}
			}
			const request = this.pending.get(message.requestId);
			if (request && ['result', 'chatError'].includes(message.event)) {
				clearTimeout(request.timer);
				this.pending.delete(message.requestId);
				if (message.event === 'chatError') request.reject(new Error(message.data?.code || 'MESSAGE_REJECTED'));
				else request.resolve(message.data);
			}
			this.listener(message.event, message.data, message.requestId);
		};
		ws.onclose = () => {
			this.ready = false;
			this.listener('connection', 'offline');
			for (const [id, request] of Array.from(this.pending))
				if (['ai', 'moderate'].includes(request.payload.action)) {
					clearTimeout(request.timer);
					request.reject(new Error('CONNECTION_LOST'));
					this.pending.delete(id);
				}
			if (!this.stopped) this.reconnect = setTimeout(() => this.connect(), Math.min(1000 * 2 ** this.retry++, 15000));
		};
		ws.onerror = () => this.listener('connection', 'offline');
	}
	request(action: string, data: Record<string, any> = {}, requestId = crypto.randomUUID()): Promise<any> {
		if (this.stopped) return Promise.reject(new Error('CONNECTION_LOST'));
		return new Promise((resolve, reject) => {
			const payload = { ...data, action, requestId };
			const timer = setTimeout(
				() => {
					this.pending.delete(requestId);
					reject(new Error('CONNECTION_LOST'));
				},
				action === 'ai' ? 50000 : 30000,
			);
			this.pending.set(requestId, { payload, resolve, reject, timer, sentSocket: this.ready ? this.ws : undefined });
			if (this.ready) this.ws?.send(JSON.stringify({ event: 'chat', data: payload }));
		});
	}
	stop() {
		this.stopped = true;
		this.ready = false;
		clearTimeout(this.reconnect);
		clearTimeout(this.refreshRetry);
		clearInterval(this.refreshTimer);
		if (this.ws) {
			this.ws.onmessage = null;
			this.ws.onclose = null;
			this.ws.onerror = null;
			this.ws.onopen = null;
			this.ws.close();
		}
		for (const request of Array.from(this.pending.values())) {
			clearTimeout(request.timer);
			request.reject(new Error('CONNECTION_LOST'));
		}
		this.pending.clear();
	}
}
export function mergeMessages(existing: any[], incoming: any[]) {
	const records = new Map(existing.map((message) => [String(message._id), message]));
	for (const message of incoming) records.set(String(message._id), { ...records.get(String(message._id)), ...message });
	return Array.from(records.values()).sort((a, b) => String(a._id).localeCompare(String(b._id)));
}

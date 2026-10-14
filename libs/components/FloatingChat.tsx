import { createPortal } from 'react-dom';
import { Money } from './common/Currency';
import React, { useEffect, useRef, useState } from 'react';
import { useReactiveVar, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { userVar } from '../../apollo/store';
import { ChatTransport, mergeMessages } from '../chat/transport';
import { chatText } from '../chat/translations';
import { imageUrl } from './common/Marketplace';
import styles from './FloatingChat.module.scss';

type Person = { _id: string; memberNick: string; memberImage?: string; memberType?: string };
type Message = {
	_id: string;
	senderId: string;
	receiverId?: string;
	scope?: string;
	text: string;
	createdAt: string;
	isRead?: boolean;
	sender?: Person;
};
const Bubble = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
		<path d="M5 4h14a1 1 0 0 1 1 1v12H9l-5 4V5a1 1 0 0 1 1-1Z" />
	</svg>
);
const Robot = () => (
	<span className={styles.robot} aria-hidden="true">
		<svg viewBox="0 0 48 48">
			<path d="M24 7v7" stroke="#93485e" strokeWidth="3" />
			<circle cx="24" cy="6" r="3" fill="#e699b2" />
			<rect x="8" y="14" width="32" height="26" rx="12" fill="#f5c3d4" stroke="#ba6883" strokeWidth="2" />
			<circle cx="18" cy="26" r="3" fill="#803f54" />
			<circle cx="30" cy="26" r="3" fill="#803f54" />
			<path d="M19 33q5 4 10 0" fill="none" stroke="#803f54" strokeWidth="2" />
			<circle cx="12" cy="31" r="3" fill="#eb9bb9" />
			<circle cx="36" cy="31" r="3" fill="#eb9bb9" />
		</svg>
	</span>
);
function Avatar({ person }: { person?: Person }) {
	return person?.memberImage ? (
		<img
			className={styles.avatar}
			src={imageUrl(person.memberImage)}
			alt=""
			onError={(e) => {
				e.currentTarget.style.visibility = 'hidden';
			}}
		/>
	) : (
		<span className={styles.avatar}>{person?.memberNick?.slice(0, 1) || '♡'}</span>
	);
}
export default function FloatingChat() {
	const user = useReactiveVar(userVar),
		router = useRouter(),
		apollo = useApolloClient();
	const t = chatText(router.locale),
		locale = ['en', 'ko', 'uz'].includes(router.locale || '') ? router.locale! : 'en';
 const embedded=router.pathname==='/mypage' && router.query.category==='messages' && user.memberType==='SELLER';
 const [host,setHost]=useState<HTMLElement|null>(null);
 useEffect(()=>{if(!embedded){setHost(null);return;}setOpen(true);setTab('messages');const find=()=>{const node=document.getElementById('seller-chat-host');if(node)setHost(node);};find();const observer=new MutationObserver(find);observer.observe(document.body,{childList:true,subtree:true});return()=>observer.disconnect();},[embedded,router.asPath]);

	const [open, setOpen] = useState(false),
		[tab, setTab] = useState<'ai' | 'global' | 'messages'>('ai');
	const [peer, setPeer] = useState<Person | null>(null),
		[rows, setRows] = useState<Message[]>([]),
		[hasMore, setHasMore] = useState(false);
	const [conversations, setConversations] = useState<any[]>([]),
		[moreConversations, setMoreConversations] = useState(false);
	const [counts, setCounts] = useState({ private: 0, global: 0 }),
		[online, setOnline] = useState<string[]>([]);
	const [connection, setConnection] = useState('connecting'),
		[draft, setDraft] = useState(''),
		[search, setSearch] = useState(''),
		[contacts, setContacts] = useState<Person[]>([]);
	const [loading, setLoading] = useState(false),
		[sending, setSending] = useState(false),
		[error, setError] = useState(''),
		[typing, setTyping] = useState<Record<string, { name: string; until: number }>>({});
	const [ai, setAi] = useState<{ id: string; role: 'user' | 'assistant'; text: string; products?: any[] }[]>([]);
	const transport = useRef<ChatTransport>(),
		state = useRef<any>(),
		tail = useRef<HTMLDivElement>(null),
		sequence = useRef(0),
		pendingSend = useRef<{ text: string; room: string; id: string }>();
	const loadingOlder = useRef(false);
	const lastRead = useRef(''),
		lastTyping = useRef(0),
		eventHandler = useRef<(event: string, data: any, id?: string) => void>(() => {});
	state.current = { open, tab, peer, user, locale };
	const errorText = (code: string) =>
		code === 'AI_NOT_CONFIGURED'
			? t.configured
			: code === 'AI_PROVIDER_ERROR'
				? t.provider
				: code === 'AI_SEARCH_FAILED'
					? t.database
					: code === 'AI_PROVIDER_LIMIT'
						? t.rate
						: code === 'AI_UNAVAILABLE'
							? t.unavailable
							: code === 'RATE_LIMITED'
								? t.rate
								: code === 'CHAT_RESTRICTED'
									? t.restricted
									: code === 'CONNECTION_LOST'
										? t.disconnected
										: t.error;
	const request = (action: string, data: any = {}, id?: string) =>
		transport.current?.request(action, data, id) ?? Promise.reject(new Error('CONNECTION_LOST'));
	const fail = (e: Error) => setError(errorText(e.message));
	const loadConversations = async (before?: string) => {
		const owner = state.current.user._id;
		const result = await request('conversations', before ? { before } : {});
		if (owner !== state.current.user._id) return;
		setConversations((previous) =>
			before
				? [...previous, ...result.slice(0, 30).filter((item: any) => !previous.some((x) => x._id === item._id))]
				: result.slice(0, 30),
		);
		setMoreConversations(result.length > 30);
	};
	const history = async (older = false) => {
		const current = state.current;
		if (current.tab === 'ai' || (current.tab === 'messages' && !current.peer)) return;
		const generation = ++sequence.current;
		loadingOlder.current = older;
		setLoading(true);
		setError('');
		try {
			const result = await request('history', {
				...(current.tab === 'messages' ? { peerId: current.peer._id } : {}),
				...(older && rows[0] ? { before: rows[0]._id } : {}),
			});
			if (generation !== sequence.current) return;
			setRows((previous) => mergeMessages(older ? previous : [], result.messages));
			setHasMore(result.hasMore);
		} catch (e) {
			if (generation === sequence.current) fail(e as Error);
		} finally {
			if (generation === sequence.current) setLoading(false);
		}
	};
	eventHandler.current = (event, data, id) => {
		const current = state.current;
		if (event === 'connection') setConnection(data);
		if (event === 'authenticated') {
			setOnline(data.online);
			setCounts(data.counts);
			void loadConversations().catch(fail);
			void history();
		}
		if (event === 'counts') {
			setCounts(data);
		}
		if (event === 'presence')
			setOnline((list) =>
				data.online ? Array.from(new Set([...list, data.memberId])) : list.filter((x) => x !== data.memberId),
			);
		if (event === 'newMessage') {
			const isGlobal = data.scope === 'GLOBAL';
			const matches = isGlobal
				? current.tab === 'global'
				: current.tab === 'messages' && current.peer && [data.senderId, data.receiverId].includes(current.peer._id);
			if (matches) {
				loadingOlder.current = false;
				setRows((previous) => mergeMessages(previous, [data]));
			}
			if (!isGlobal) {
				void loadConversations().catch(fail);
				void apollo.refetchQueries({ include: ['getMyNotifications', 'getUnreadNotificationCount'] }).catch(() => {});
			}
		}
		if (event === 'readReceipt' && data.senderId === current.user._id && data.receiverId === current.peer?._id)
			setRows((previous) =>
				previous.map((row) =>
					row.senderId === current.user._id &&
					(data.ids ? data.ids.includes(row._id) : !data.through || row._id <= data.through)
						? { ...row, isRead: true }
						: row,
				),
			);
		if (
			event === 'typing' &&
			data.memberId !== current.user._id &&
			(data.peerId ? current.tab === 'messages' && data.memberId === current.peer?._id : current.tab === 'global')
		)
			setTyping((previous) => ({
				...previous,
				[data.memberId]: { name: data.nickname, until: data.active ? Date.now() + 4500 : 0 },
			}));
		if (event === 'moderation') {
			if (data.operation === 'delete') setRows((previous) => previous.filter((row) => row._id !== data.target));
			if (data.target === current.user._id && current.tab === 'global') {
				setRows([]);
				void history();
			}
		}
		if (event === 'aiDelta')
			setAi((previous) => previous.map((item) => (item.id === id ? { ...item, text: item.text + data } : item)));
		if (event === 'aiProducts')
			setAi((previous) => previous.map((item) => (item.id === id ? { ...item, products: data } : item)));
	};
	useEffect(() => {
		setRows([]);
		setConversations([]);
		setCounts({ private: 0, global: 0 });
		setAi([]);
		setPeer(null);
		setDraft('');
		setError('');
		lastRead.current = '';
		sequence.current++;
		if (!user._id) return;
		const client = new ChatTransport((...args) => eventHandler.current(...args));
		transport.current = client;
		client.start();
		return () => {
			client.stop();
			transport.current = undefined;
		};
	}, [user._id]);
	useEffect(() => {
		const openChat = (event: Event) => {
			const detail = (event as CustomEvent).detail;
			setOpen(true);
			setTab('messages');
			if (detail?.peerId) setPeer({ _id: detail.peerId, memberNick: detail.nickname || '' });
		};
		window.addEventListener('kidify:open-chat', openChat);
		return () => window.removeEventListener('kidify:open-chat', openChat);
	}, []);
	useEffect(() => {
		if (router.pathname !== '/messages' || !router.isReady) return;
		setOpen(true);
		setTab('messages');
		const peerId = typeof router.query.peerId === 'string' ? router.query.peerId : '';
		if (/^[a-f\d]{24}$/i.test(peerId)) setPeer({ _id: peerId, memberNick: '' });
	}, [router.pathname, router.query.peerId, router.isReady, user._id]);
	useEffect(() => {
		sequence.current++;
		setRows([]);
		setTyping({});
		lastRead.current = '';
		setDraft('');
		setError('');
		if (connection === 'connected') void history();
	}, [tab, peer?._id]);
	useEffect(() => {
		if (!open || tab === 'ai' || (tab === 'messages' && !peer) || !rows.length || connection !== 'connected') return;
		const last = rows[rows.length - 1]._id,
			key = `${tab}:${peer?._id}:${last}`;
		if (lastRead.current === key) return;
		lastRead.current = key;
		void request('read', { ...(tab === 'messages' ? { peerId: peer!._id } : {}), through: last })
			.then(() => request('counts'))
			.then(setCounts)
			.catch((e) => {
				lastRead.current = '';
				fail(e);
			});
	}, [open, tab, peer?._id, rows, connection]);
	useEffect(() => {
		if (open && !loading && !loadingOlder.current) tail.current?.scrollIntoView({ block: 'nearest' });
	}, [rows.length, ai[ai.length - 1]?.text, open]);
	useEffect(() => {
		const timer = setInterval(
			() =>
				setTyping((previous) =>
					Object.fromEntries(Object.entries(previous).filter(([, value]) => value.until > Date.now())),
				),
			1500,
		);
		return () => clearInterval(timer);
	}, []);
	useEffect(() => {
		if (tab !== 'messages' || peer || !user._id || connection !== 'connected') return;
		let active = true;
		const timer = setTimeout(() => {
			void request('contacts', { search })
				.then((result) => {
					if (active) setContacts(result.filter((p: Person) => p._id !== user._id));
				})
				.catch(fail);
		}, 300);
		return () => {
			active = false;
			clearTimeout(timer);
		};
	}, [search, tab, peer?._id, user._id, connection]);
	async function send(text = draft, quickAction?: string) {
		if (!text.trim() || sending || connection !== 'connected') return;
		setSending(true);
		setError('');
		const room = tab === 'global' ? 'global' : peer?._id || 'ai';
		try {
			if (tab === 'ai') {
				const id = crypto.randomUUID();
				setAi((previous) => [
					...previous,
					{ id: id + '-user', role: 'user', text },
					{ id, role: 'assistant', text: '' },
				]);
				setDraft('');
				await request('ai', { text, locale, quickAction }, id);
			} else {
				if (tab === 'messages' && !peer) return;
				if (!pendingSend.current || pendingSend.current.text !== text || pendingSend.current.room !== room)
					pendingSend.current = { text, room, id: crypto.randomUUID() };
				const result = await request('send', {
					text,
					clientMessageId: pendingSend.current.id,
					...(tab === 'messages' ? { peerId: peer!._id } : {}),
				});
				if ((state.current.tab === 'global' ? 'global' : state.current.peer?._id) === room) {
					setRows((previous) => mergeMessages(previous, [result]));
					setDraft('');
				}
				pendingSend.current = undefined;
				void request('typing', { ...(peer ? { peerId: peer._id } : {}), active: false }).catch(() => {});
			}
		} catch (e) {
			fail(e as Error);
		} finally {
			setSending(false);
		}
	}
	async function contactCS() {
		setError('');
		try {
			const list = await request('contacts', { search: '', csOnly: true });
			const person = list.find((p: Person) => p._id !== user._id);
			if (!person) {
				setError(t.noCS);
				return;
			}
			setPeer(person);
			setTab('messages');
		} catch (e) {
			fail(e as Error);
		}
	}
	async function moderate(operation: string, target: string) {
		if (!window.confirm(t.confirm)) return;
		try {
			await request('moderate', { operation, target });
		} catch (e) {
			fail(e as Error);
		}
	}
	const badge = counts.private + counts.global;
	const activePeer =
		peer &&
		(conversations.find((x) => x._id === peer._id)?.peer ||
			contacts.find((x) => x._id === peer._id) ||
			rows.find((x) => x.senderId === peer._id)?.sender ||
			peer);
	const widget = (
		<div className={styles.root} style={embedded ? {position:"relative",inset:"auto",width:"100%",zIndex:"auto"} : undefined}>
			{(open || embedded) && (
				<section
					className={styles.panel}
                    style={embedded ? {position:"relative",inset:"auto",width:"100%",height:600,maxHeight:"none"} : undefined}
					role="dialog"
					aria-label={t.title}
					onKeyDown={(e) => {
						if (e.key === 'Escape') setOpen(false);
					}}
				>
					<header>
						<div>
							<strong>{t.title}</strong>
							<small>
								{user._id
									? connection === 'connected'
										? t.connected
										: connection === 'connecting'
											? t.connecting
											: t.offline
									: t.signIn}
							</small>
						</div>
						<button style={embedded ? {display:"none"} : undefined} aria-label={t.close} onClick={() => setOpen(false)}>
							×
						</button>
					</header>
					<nav aria-label={t.title}>
						{(['ai', 'global', 'messages'] as const).map((item) => (
							<button key={item} aria-pressed={tab === item} onClick={() => setTab(item)}>
								{item === 'ai' ? <Robot /> : <Bubble />}
								{t[item]}
								{item !== 'ai' && (item === 'global' ? counts.global : counts.private) > 0 && (
									<b>{item === 'global' ? counts.global : counts.private}</b>
								)}
							</button>
						))}
					</nav>
					{!user._id ? (
						<div className={styles.guest}>
							{tab === 'ai' && <Robot />}
							<p>{tab === 'ai' ? t.welcome : t.signIn}</p>
							<Link href={{ pathname: '/account/join', query: { returnTo: router.asPath } }}>{t.signIn}</Link>
						</div>
					) : (
						<>
							{tab === 'messages' && peer && (
								<div className={styles.peer}>
									<button onClick={() => setPeer(null)} aria-label={t.back}>
										←
									</button>
									<Avatar person={activePeer} />
									<strong>{activePeer?.memberNick || t.messages}</strong>
									<small>{online.includes(peer._id) ? t.online : t.away}</small>
								</div>
							)}
							<div className={styles.body} aria-busy={loading}>
								{tab === 'ai' ? (
									<>
										<div className={styles.welcome}>
											<Robot />
											<p>{t.welcome}</p>
										</div>
										<div className={styles.quick}>
											{(['products', 'orders', 'shipping', 'recommendations'] as const).map((action) => (
												<button
													key={action}
													disabled={sending || connection !== 'connected'}
													onClick={() => void send(t[action], action)}
												>
													{t[action]}
												</button>
											))}
											<button onClick={() => void contactCS()}>{t.cs}</button>
										</div>
										{ai.map((item) => (
											<div key={item.id} className={`${styles.aiMessage} ${item.role === 'user' ? styles.own : ''}`}>
												{item.role === 'assistant' && <Robot />}
												<p>{item.text || (sending ? t.loading : t.unavailable)}</p>
												{item.products && (
													<div className={styles.products}>
														{item.products.map((product) => (
															<Link
																href={{ pathname: '/products/detail', query: { id: product._id } }}
																key={product._id}
															>
																<img src={imageUrl(product.productImages?.[0])} alt="" />
																<span>
																	{product.productName}
																	<b>{<Money amount={Number(product.finalPrice)} />}</b>
																	<small>{product.available ? t.available : ''}</small>
																</span>
															</Link>
														))}
													</div>
												)}
											</div>
										))}
									</>
								) : tab === 'messages' && !peer ? (
									<>
										<label className={styles.search}>
											{t.search}
											<input
												value={search}
												maxLength={80}
												onChange={(e) => setSearch(e.target.value)}
												placeholder={t.search}
											/>
										</label>
										{search ? (
											contacts.map((person) => (
												<button className={styles.conversation} key={person._id} onClick={() => setPeer(person)}>
													<Avatar person={person} />
													<span>
														{person.memberNick}
														<small>{person.memberType}</small>
													</span>
												</button>
											))
										) : (
											<>
												{conversations.map((conversation) => (
													<button
														key={conversation._id}
														className={styles.conversation}
														onClick={() => setPeer(conversation.peer)}
													>
														<Avatar person={conversation.peer} />
														<span>
															<strong>{conversation.peer.memberNick}</strong>
															<small>{conversation.last.text}</small>
															<time>{new Date(conversation.last.createdAt).toLocaleString(locale)}</time>
														</span>
														{conversation.unread > 0 && <b>{conversation.unread}</b>}
													</button>
												))}
												{moreConversations && (
													<button
														onClick={() =>
															void loadConversations(conversations[conversations.length - 1]?.last._id).catch(fail)
														}
													>
														{t.more}
													</button>
												)}
												<p>{t.newChat}</p>
												{contacts.map((person) => (
													<button className={styles.conversation} key={person._id} onClick={() => setPeer(person)}>
														<Avatar person={person} />
														<span>
															{person.memberNick}
															<small>
																{person.memberType} · {online.includes(person._id) ? t.online : t.away}
															</small>
														</span>
													</button>
												))}
											</>
										)}
									</>
								) : (
									<>
										{hasMore && (
											<button disabled={loading} onClick={() => void history(true)}>
												{t.older}
											</button>
										)}
										{loading && <p role="status">{t.loading}</p>}
										{!loading && !rows.length && <p>{t.empty}</p>}
										{rows.map((message) => (
											<article
												className={`${styles.message} ${message.senderId === user._id ? styles.own : ''}`}
												key={message._id}
											>
												<Avatar person={message.sender} />
												<div>
													<strong>
														{message.sender?.memberNick ||
															(message.senderId === user._id ? user.memberNick : activePeer?.memberNick)}{' '}
														<small>{message.sender?.memberType}</small>
													</strong>
													<p>{message.text}</p>
													<time>
														{new Date(message.createdAt).toLocaleString(locale)}{' '}
														{message.senderId === user._id &&
															tab === 'messages' &&
															(message.isRead ? `✓✓ ${t.read}` : `✓ ${t.sent}`)}
													</time>
													{tab === 'global' && user.memberType === 'ADMIN' && (
														<details>
															<summary>•••</summary>
															<button onClick={() => void moderate('delete', message._id)}>{t.delete}</button>
															{message.senderId !== user._id && (
																<>
																	<button onClick={() => void moderate('mute', message.senderId)}>{t.mute}</button>
																	<button onClick={() => void moderate('block', message.senderId)}>{t.block}</button>
																	<button onClick={() => void moderate('unblock', message.senderId)}>
																		{t.unblock}
																	</button>
																</>
															)}
														</details>
													)}
												</div>
											</article>
										))}
										{Object.entries(typing)
											.filter(([, value]) => value.until > Date.now())
											.map(([id, value]) => (
												<small key={id}>
													{value.name} {t.typing}
												</small>
											))}
									</>
								)}
								<div ref={tail} />
							</div>
							{error && (
								<p className={styles.error} role="alert">
									{error}
								</p>
							)}
							{(tab !== 'messages' || peer) && (
								<form
									className={styles.composer}
									onSubmit={(e) => {
										e.preventDefault();
										void send();
									}}
								>
									<textarea
										aria-label={t.input}
										placeholder={t.input}
										rows={2}
										maxLength={tab === 'ai' ? 1000 : 3000}
										value={draft}
										onChange={(e) => {
											setDraft(e.target.value);
											if (tab !== 'ai' && Date.now() - lastTyping.current > 2500) {
												lastTyping.current = Date.now();
												void request('typing', { ...(peer ? { peerId: peer._id } : {}), active: true }).catch(() => {});
											}
										}}
									/>
									<button type="submit" disabled={sending || !draft.trim() || connection !== 'connected'}>
										{sending ? '…' : t.send}
									</button>
								</form>
							)}
						</>
					)}
				</section>
			)}
			<button
                style={embedded ? {display:"none"} : undefined}
				className={styles.launcher}
				aria-label={open ? t.close : t.open}
				aria-expanded={open}
				onClick={() => setOpen((value) => !value)}
			>
				<Bubble />
				{badge > 0 && <b>{badge > 99 ? '99+' : badge}</b>}
			</button>
		</div>
	);
 return embedded && host ? createPortal(widget,host) : widget;
}

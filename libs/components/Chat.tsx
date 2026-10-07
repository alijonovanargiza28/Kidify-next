import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Button, TextField, Alert } from '@mui/material';
import { userVar, socketVar } from '../../apollo/store';
import { getJwtToken } from '../auth';
import { REACT_APP_API_WS } from '../config';
import { useMarketplace, useAction } from '../hooks/useMarketplace';
import { State, Pager } from './common/Marketplace';
export default function Chat() {
	const router = useRouter(),
		user = useReactiveVar(userVar),
		peerId = String(router.query.peerId || ''),
		productId = String(router.query.productId || ''),
		[text, setText] = useState(''),
		[page, setPage] = useState(1),
		[connected, setConnected] = useState(false),
		[sending, setSending] = useState(false),
		[error, setError] = useState('');
	const q = useMarketplace('getMyMessages', { input: { page, limit: 30 }, ...(peerId ? { peerId } : {}) }, !user._id),
		peer = useMarketplace('getMember', { memberId: peerId }, !peerId),
		action = useAction(),
		refetch = useRef(q.refetch);
	refetch.current = q.refetch;
	useEffect(() => {
		if (!user._id) return;
		let stopped = false,
			retry: ReturnType<typeof setTimeout>,
			socket: WebSocket;
		const connect = () => {
			socket = new WebSocket(REACT_APP_API_WS);
			socketVar(socket);
			socket.onopen = () => socket.send(JSON.stringify({ event: 'authenticate', data: { token: getJwtToken() } }));
			socket.onmessage = (e) => {
				try {
					const m = JSON.parse(e.data);
					if (m.event === 'authenticated') {
						setConnected(true);
						setError('');
					}
					if (m.event === 'newMessage' || m.event === 'messageSent') {
						void refetch.current();
					}
					if (m.error) setError('Chat authentication failed. Please sign in again.');
				} catch {
					setError('Unable to read chat update.');
				}
			};
			socket.onclose = () => {
				setConnected(false);
				if (!stopped) retry = setTimeout(connect, 5000);
			};
			socket.onerror = () => setConnected(false);
		};
		connect();
		return () => {
			stopped = true;
			clearTimeout(retry);
			socket?.close();
			socketVar(null);
		};
	}, [user._id]);
	useEffect(() => {
		if (!peerId) return;
		for (const m of q.value?.list || [])
			if (m.receiverId === user._id && !m.isRead) void action('markMessageRead', { messageId: m._id }).catch(() => {});
	}, [peerId, q.value?.list?.map((m: any) => m._id + String(m.isRead)).join(','), user._id]);
	const peers = Array.from(
		new Set((q.value?.list || []).map((m: any) => (m.senderId === user._id ? m.receiverId : m.senderId))),
	) as string[];
	return (
		<>
			<h2>Messages</h2>
			<p>{connected ? 'Live updates connected' : 'Live updates reconnecting; you can still send messages.'}</p>
			{error && <Alert severity="warning">{error}</Alert>}
			<div className="chat-layout">
				<aside className="account-sidebar">
					{peerId && <Button onClick={() => router.push('/messages')}>All conversations</Button>}
					{peers.map((id) => (
						<Button
							key={id}
							onClick={() => {
								setPage(1);
								router.push({ pathname: '/messages', query: { peerId: id } });
							}}
						>
							Conversation {id.slice(-6)}
						</Button>
					))}
				</aside>
				<section>
					{peerId ? (
						<>
							<h3>{peer.value?.memberNick || 'Conversation'}</h3>
							{productId && (
								<p>
									About product <a href={'/products/detail?id=' + productId}>{productId.slice(-8)}</a>
								</p>
							)}
							<State query={q}>
								<div className="message-list">
									{[...(q.value?.list || [])].reverse().map((m: any) => (
										<div key={m._id} className={'message-bubble ' + (m.senderId === user._id ? 'mine' : '')}>
											<p>{m.text}</p>
											<small>
												{new Date(m.createdAt).toLocaleString()}{' '}
												{m.senderId === user._id && (m.isRead ? '· Read' : '· Sent')}
											</small>
										</div>
									))}
								</div>
							</State>
							<Pager value={q.value} page={page} limit={30} onChange={setPage} />
							<form
								className="chat-compose"
								onSubmit={async (e) => {
									e.preventDefault();
									setSending(true);
									try {
										await action('sendMessage', {
											input: { receiverId: peerId, text, ...(productId ? { productId } : {}) },
										});
										setText('');
									} catch {
									} finally {
										setSending(false);
									}
								}}
							>
								<TextField
									label="Message"
									multiline
									value={text}
									onChange={(e) => setText(e.target.value)}
									inputProps={{ maxLength: 3000 }}
								/>
								<Button variant="contained" type="submit" disabled={sending || !text.trim()}>
									Send
								</Button>
							</form>
						</>
					) : (
						<State query={q} empty={!q.value?.list?.length}>
							<p>Select a conversation, or choose Ask Seller on a product.</p>
							<Pager value={q.value} page={page} limit={30} onChange={setPage} />
						</State>
					)}
				</section>
			</div>
		</>
	);
}

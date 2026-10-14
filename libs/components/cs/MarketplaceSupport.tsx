import { CalendarMonthOutlined, ConfirmationNumberOutlined, ChevronRight, HeadsetMicOutlined } from '@mui/icons-material';
import useUiText from '../../hooks/useUiText';
import React, { useState } from 'react';
import { Button, TextField, MenuItem, Alert } from '@mui/material';
import { useMarketplace, useAction } from '../../hooks/useMarketplace';
import { State, Pager } from '../common/Marketplace';
import { backendEnums } from '../../types/marketplace';
function Ticket({ id, user, onBack }: any) {
 const uiText = useUiText();

	const q = useMarketplace('getSupportTicket', { ticketId: id }),
		staff = ['ADMIN', 'CS'].includes(user.memberType),
		order = useMarketplace('getSupportOrder', { ticketId: id }, !staff),
		agents = useMarketplace(
			'getAllMemberByAdmin',
			{ input: { page: 1, limit: 100, search: { memberType: 'CS' } } },
			user.memberType !== 'ADMIN',
		),
		action = useAction(),
		[text, setText] = useState('');
	return (
		<>
			<Button onClick={onBack}>{uiText("← Back to My Tickets")}</Button>
			<State query={q}>
				{q.value && (
					<section className="panel">
						<h2>{q.value.subject}</h2>
						<small>
							{uiText("Ticket #")}{q.value._id} · {q.value.category} · {new Date(q.value.createdAt).toLocaleString()}
						</small>
						{q.value.relatedOrderId && <p>{uiText("Related order:")}{q.value.relatedOrderId}</p>}
						<p className="support-message">{q.value.message}</p>
						<small>{q.value.status.replace(/_/g, ' ')}</small>
						{order.value && (
							<p>
								{uiText("Related order:")}{order.value._id} · {order.value.status}
							</p>
						)}
						{q.value.replies?.map((r: any, i: number) => (
							<div className={`support-message ${r.authorId === q.value.creatorId ? '' : 'staff'}`} key={i}>
								<small>
									{r.authorId === user._id ? 'You' : r.authorId === q.value.creatorId ? 'Customer' : 'Customer Support'}{' '}
									· {new Date(r.createdAt).toLocaleString()}
								</small>
								<p>{r.text}</p>
							</div>
						))}
						{q.value.status !== 'CLOSED' && (
							<form
								className="chat-compose"
								onSubmit={async (e) => {
									e.preventDefault();
									try {
										await action('replySupportTicket', { ticketId: id, text });
										setText('');
									} catch {}
								}}
							>
								<label className="field-above">
									{uiText("Reply")}<textarea value={text} onChange={(e) => setText(e.target.value)} required maxLength={5000} />
								</label>
								<Button type="submit" disabled={!text.trim()}>
									{uiText("Send")}</Button>
							</form>
						)}
						{staff && (
							<div className="form-actions">
								<TextField
									InputLabelProps={{ htmlFor: undefined }}
									select
									label={uiText("Ticket status")}
									value={q.value.status}
									onChange={(e) =>
										void action('updateSupportTicketStatus', { ticketId: id, status: e.target.value }).catch(() => {})
									}
								>
									{[
										q.value.status,
										...(
											{
												OPEN: ['IN_PROGRESS', 'CLOSED'],
												IN_PROGRESS: ['RESOLVED', 'CLOSED'],
												RESOLVED: ['IN_PROGRESS', 'CLOSED'],
												CLOSED: [],
											} as any
										)[q.value.status],
									].map((v: string) => (
										<MenuItem key={v} value={v}>
											{v}
										</MenuItem>
									))}
								</TextField>
								{user.memberType === 'ADMIN' && (
									<TextField
										InputLabelProps={{ htmlFor: undefined }}
										select
										label={uiText("Assign CS")}
										value={q.value.assignedCS || ''}
										onChange={(e) =>
											void action('assignSupportTicket', { ticketId: id, csId: e.target.value }).catch(() => {})
										}
									>
										<MenuItem value="">{uiText("Select agent")}</MenuItem>
										{agents.value?.list?.map((m: any) => (
											<MenuItem key={m._id} value={m._id}>
												{m.memberNick}
											</MenuItem>
										))}
									</TextField>
								)}
							</div>
						)}
					</section>
				)}
			</State>
		</>
	);
}
export default function Support({ user }: any) {
 const uiText = useUiText();

	const [page, setPage] = useState(1),
		[id, setId] = useState(''),
		[creating, setCreating] = useState(false);
	const [subject, setSubject] = useState(''),
		[category, setCategory] = useState(''),
		[message, setMessage] = useState(''),
		[orderId, setOrderId] = useState(''),
		[notice, setNotice] = useState(''),
		[busy, setBusy] = useState(false),
		[orderPage, setOrderPage] = useState(1);
	const orders = useMarketplace('getMyOrders', { input: { page: orderPage, limit: 100 } }, !creating);
	const staff = ['ADMIN', 'CS'].includes(user.memberType),
		q = useMarketplace('getMySupportTickets', { input: { page, limit: 10 } }),
		queue = useMarketplace('getSupportQueue', { input: { page: 1, limit: 20 } }, !staff),
		action = useAction();
	if (id) return <Ticket id={id} user={user} onBack={() => setId('')} />;
	return (
		<>
			<div className="section-heading">
				<div><h2>{staff ? uiText('Support Tickets') : uiText('My Tickets')}</h2><p>{uiText('Here are your inquiries and support requests.')}</p></div>
				<Button onClick={() => setCreating(!creating)}>{uiText("+ New Inquiry")}</Button>
			</div>
			{notice && <Alert severity="success">{notice}</Alert>}
			{creating && (
				<form
					className="panel form-grid inquiry-reference"
					onSubmit={async (e) => {
						e.preventDefault();
						if (busy) return;
						setBusy(true);
						try {
							await action('createSupportTicket', {
								input: {
									subject: subject.trim(),
									category,
									message: message.trim(),
									...(orderId ? { relatedOrderId: orderId } : {}),
								},
							});
							setCreating(false);
							setSubject('');
							setCategory('');
							setMessage('');
							setOrderId('');
							setPage(1);
							await q.refetch({ input: { page: 1, limit: 10 } });
							setNotice('Your inquiry was sent.');
						} catch {
						} finally {
							setBusy(false);
						}
					}}
				>
					<div className="full"><h2>{uiText('New Inquiry')}</h2><p>{uiText('Let us know how we can help. We will get back to you as soon as possible.')}</p></div>
                    <label className="field-above">
						{uiText("Subject *")}<input required maxLength={150} value={subject} onChange={(e) => setSubject(e.target.value)} />
					</label>
					<label className="field-above">
						{uiText("Category *")}<select required value={category} onChange={(e) => setCategory(e.target.value)}>
							<option value="">{uiText("Choose a category")}</option>
							{backendEnums.FAQCategory.map((c) => (
								<option key={c} value={c}>
									{c.replace(/_/g, ' ')}
								</option>
							))}
						</select>
					</label>
					<label className="field-above full">
						{uiText("Related Order (optional)")}<select value={orderId} onChange={(e) => setOrderId(e.target.value)}>
							<option value="">{uiText("No related order")}</option>
							{orders.value?.list?.map((o: any) => (
								<option key={o._id} value={o._id}>
									#{o._id} · {new Date(o.createdAt).toLocaleDateString()} · {o.status}
								</option>
							))}
						</select>
					</label>
					<div className="full">
						<State query={orders} />
						<Pager
							value={orders.value}
							page={orderPage}
							limit={100}
							onChange={(p: number) => {
								setOrderPage(p);
								setOrderId('');
							}}
						/>
					</div>
					<label className="field-above full">
						{uiText("Message *")}<textarea required rows={6} maxLength={5000} value={message} onChange={(e) => setMessage(e.target.value)} />
					</label>
					<Button type="submit" disabled={busy || !subject.trim() || !category || !message.trim()} variant="contained">
						{busy ? 'Sending…' : 'Send Inquiry'}
					</Button>
					<Button onClick={() => setCreating(false)}>{uiText("Cancel")}</Button>
				</form>
			)}

			{staff && (
				<section className="panel">
					<h3>{uiText("Waiting for support")}</h3>
					<State query={queue} empty={queue.value?.list?.length === 0}>
						{queue.value?.list?.map((t: any) => (
							<div className="notification" key={t._id}>
								<span>{t.subject}</span>
								<Button
									onClick={async () => {
										try {
											if (user.memberType === 'CS') await action('claimSupportTicket', { ticketId: t._id });
											setId(t._id);
										} catch {}
									}}
								>
									{user.memberType === 'CS' ? 'Claim ticket' : 'Open ticket'}
								</Button>
							</div>
						))}
					</State>
				</section>
			)}
			{!creating && <State query={q} empty={q.value?.list?.length === 0}>
				{q.value?.list?.map((t: any) => (
					<button type="button" className="ticket-row" key={t._id} onClick={() => setId(t._id)}>
						<span className="ticket-icon"><HeadsetMicOutlined/></span><span className="ticket-copy">
							<strong>{t.subject}</strong>
							<small>
								#{t._id} · {t.category} · {new Date(t.createdAt).toLocaleDateString()}
							</small>
						</span>
						<span className="ticket-date"><CalendarMonthOutlined/>{new Date(t.createdAt).toLocaleDateString()}</span><span className={`ticket-status ${t.status.toLowerCase()}`}>{t.status.replace(/_/g, ' ')}</span><ChevronRight/>
					</button>
				))}
				<Pager value={q.value} page={page} limit={10} onChange={setPage} />
			</State>}
		</>
	);
}

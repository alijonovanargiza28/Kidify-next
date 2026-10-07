import React, { useState } from 'react';
import { Button, TextField, MenuItem } from '@mui/material';
import { useMarketplace, useAction } from '../../hooks/useMarketplace';
import { State, Pager } from '../common/Marketplace';
import MarketplaceForm from '../common/MarketplaceForm';
function Ticket({ id, user, onBack }: any) {
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
			<Button onClick={onBack}>← All tickets</Button>
			<State query={q}>
				{q.value && (
					<section className="panel">
						<h2>{q.value.subject}</h2>
						<p>{q.value.message}</p>
						<small>{q.value.status.replace(/_/g, ' ')}</small>
						{order.value && (
							<p>
								Related order: {order.value._id} · {order.value.status}
							</p>
						)}
						{q.value.replies?.map((r: any, i: number) => (
							<div className="comment" key={i}>
								<small>
									{r.authorId === user._id ? 'You' : 'Support participant'} · {new Date(r.createdAt).toLocaleString()}
								</small>
								<p>{r.text}</p>
							</div>
						))}
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
							<TextField label="Reply" value={text} onChange={(e) => setText(e.target.value)} required multiline />
							<Button type="submit" disabled={!text.trim()}>
								Send
							</Button>
						</form>
						{staff && (
							<div className="form-actions">
								<TextField InputLabelProps={{htmlFor:undefined}}
									select
									label="Ticket status"
									value={q.value.status}
									onChange={(e) =>
										void action('updateSupportTicketStatus', { ticketId: id, status: e.target.value }).catch(() => {})
									}
								>
									{['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((v) => (
										<MenuItem key={v} value={v}>
											{v}
										</MenuItem>
									))}
								</TextField>
								{user.memberType === 'ADMIN' && (
									<TextField InputLabelProps={{htmlFor:undefined}}
										select
										label="Assign CS"
										value={q.value.assignedCS || ''}
										onChange={(e) =>
											void action('assignSupportTicket', { ticketId: id, csId: e.target.value }).catch(() => {})
										}
									>
										<MenuItem value="">Select agent</MenuItem>
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
	const [page, setPage] = useState(1),
		[id, setId] = useState(''),
		[creating, setCreating] = useState(false);
	const staff = ['ADMIN', 'CS'].includes(user.memberType),
		q = useMarketplace('getMySupportTickets', { input: { page, limit: 10 } }),
		queue = useMarketplace('getSupportQueue', { input: { page: 1, limit: 20 } }, !staff),
		action = useAction();
	if (id) return <Ticket id={id} user={user} onBack={() => setId('')} />;
	return (
		<>
			<div className="section-heading">
				<h2>Support Tickets</h2>
				<Button onClick={() => setCreating(!creating)}>New inquiry</Button>
			</div>
			{creating && (
				<MarketplaceForm
					type="SupportInput"
					onSubmit={async (input: any) => {
						const t = await action('createSupportTicket', { input });
						setCreating(false);
						setId(t._id);
					}}
				/>
			)}
			{staff && (
				<section className="panel">
					<h3>Waiting for support</h3>
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
			<State query={q} empty={q.value?.list?.length === 0}>
				{q.value?.list?.map((t: any) => (
					<div className="notification" key={t._id}>
						<div>
							<h3>{t.subject}</h3>
							<small>{t.status}</small>
						</div>
						<Button onClick={() => setId(t._id)}>Open</Button>
					</div>
				))}
				<Pager value={q.value} page={page} limit={10} onChange={setPage} />
			</State>
		</>
	);
}

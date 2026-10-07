import React, { useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Button, TextField } from '@mui/material';
import { userVar } from '../../../apollo/store';
import { useMarketplace, useAction } from '../../hooks/useMarketplace';
import { State, Pager } from './Marketplace';
export default function Comments({ id, group }: any) {
	const user = useReactiveVar(userVar),
		[page, setPage] = useState(1),
		[text, setText] = useState(''),
		[busy, setBusy] = useState(false);
	const q = useMarketplace('getComments', { input: { page, limit: 10, search: { commentRefId: id } } }, !id),
		action = useAction();
	return (
		<section className="home-section">
			<h2>Comments</h2>
			<State query={q} empty={false}>
				{q.value?.list?.map((c: any) => (
					<div className="comment" key={c._id}>
						<strong>{c.memberData?.memberNick || 'Member'}</strong>
						<p>{c.commentContent}</p>
						<small>{new Date(c.createdAt).toLocaleDateString()}</small>
					</div>
				))}
				<Pager value={q.value} page={page} limit={10} onChange={setPage} />
			</State>
			{user._id ? (
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setBusy(true);
						try {
							await action('createComment', { input: { commentGroup: group, commentRefId: id, commentContent: text } });
							setText('');
						} catch {
						} finally {
							setBusy(false);
						}
					}}
				>
					<TextField
						fullWidth
						multiline
						label="Your comment"
						required
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<Button type="submit" disabled={busy || !text.trim()} variant="contained">
						Post comment
					</Button>
				</form>
			) : (
				<p>Sign in to leave a comment.</p>
			)}
		</section>
	);
}

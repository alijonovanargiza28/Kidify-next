import useUiText from '../../hooks/useUiText';
import React, { useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Button, TextField } from '@mui/material';
import { userVar } from '../../../apollo/store';
import { useMarketplace, useAction } from '../../hooks/useMarketplace';
import { State, Pager, Photo } from './Marketplace';
export default function Comments({ id, group, sellerId }: any) {
 const uiText = useUiText();

	const user = useReactiveVar(userVar),
		[page, setPage] = useState(1),
		[text, setText] = useState(''),
		[busy, setBusy] = useState(false),
        [replyId, setReplyId] = useState(''), [replyText, setReplyText] = useState('');
	const q = useMarketplace('getComments', { input: { page, limit: 10, search: { commentRefId: id } } }, !id),
		action = useAction();
	return (
		<section className="home-section">
			<h2>{uiText("Comments")}</h2>
			<State query={q} empty={false}>
				{q.value?.list?.map((c: any) => (
					<div className="comment" key={c._id}>
						<div className="review-author"><Photo src={c.memberData?.memberImage} alt={c.memberData?.memberNick || ''} /><strong>{c.memberData?.memberNick || 'Member'}</strong>{c.memberData?.memberType === 'ADMIN' ? <small>{uiText("Admin")}</small> : c.memberData?._id === sellerId ? <small>{uiText("Seller")}</small> : null}</div>
						<p>{c.commentContent}</p>
                        {c.verifiedPurchase && <small>{uiText("Verified Purchase ·")}</small>}
                        {user._id && <Button disabled={busy} onClick={async () => { if (busy) return; setBusy(true); try { await action('likeComment', { commentId: c._id }); } catch {} finally { setBusy(false); } }}>{uiText("Like / Unlike ·")}{c.likeCount || 0}</Button>}
                        {c.replyText && <div className="admin-reply"><strong>{uiText("Reply")}</strong><p>{c.replyText}</p></div>}
                        {(user.memberType === 'ADMIN' || (user.memberType === 'SELLER' && user._id === sellerId)) && <Button onClick={() => { setReplyId(c._id); setReplyText(c.replyText || ''); }}>{uiText("Reply")}</Button>}
                        {replyId === c._id && <form onSubmit={async e => { e.preventDefault(); setBusy(true); try { await action('replyComment', {commentId: c._id, text: replyText}); setReplyId(''); } catch {} finally { setBusy(false); } }}><TextField fullWidth multiline label={uiText("Reply")} value={replyText} onChange={e => setReplyText(e.target.value)} inputProps={{maxLength:3000}} /><Button type="submit" disabled={busy || !replyText.trim()}>{uiText("Save reply")}</Button></form>}
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
						label={uiText("Your comment")}
						required
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<Button type="submit" disabled={busy || !text.trim()} variant="contained">
						{uiText("Post comment")}</Button>
				</form>
			) : (
				<p>{uiText("Sign in to leave a comment.")}</p>
			)}
		</section>
	);
}

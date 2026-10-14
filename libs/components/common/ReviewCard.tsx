import useUiText from '../../hooks/useUiText';
import { sweetConfirmAlert } from '../../sweetAlert';
import React, { useRef, useState } from 'react';
import { Button } from '@mui/material';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Photo } from './Marketplace';
import { useAction } from '../../hooks/useMarketplace';
export default function ReviewCard({ review: r, sellerId }: any) {
 const uiText = useUiText();

	const user = useReactiveVar(userVar),
		action = useAction(),
		[reply, setReply] = useState(r.adminReply || ''),
		[open, setOpen] = useState(false),
		[busy, setBusy] = useState(false);
	const locked = useRef(false);
	async function run(name: 'likeReview' | 'replyReview' | 'removeReviewByAdmin') {
		if (locked.current) return;
		locked.current = true;
		setBusy(true);
		try {
			await action(name, { reviewId: r._id, ...(name === 'replyReview' ? { text: reply } : {}) });
			setOpen(false);
		} catch {
		} finally {
			locked.current = false;
			setBusy(false);
		}
	}
	return (
		<article className="comment">
			<div className="review-author"><Photo src={r.authorImage} alt={r.authorNick || ""} /><strong>{r.authorNick || "Member"}</strong></div><strong>★ {r.rating} / 5</strong>
			<small>
				{' '}
				{r.verifiedPurchase === true && 'Verified Purchase · '}{new Date(r.createdAt).toLocaleDateString()} · {r.likeCount || 0} {uiText("likes")}</small>
			<p>{r.text}</p>
            <div className="review-photos">{r.images?.map((src: string) => <a key={src} href={src.startsWith('http') ? src : undefined}><Photo src={src} alt="Buyer review photo" /></a>)}</div>
            {user._id && <Button disabled={busy} onClick={() => run('likeReview')}>{uiText("Like / Unlike ·")}{r.likeCount || 0}</Button>}
            {user.memberType === 'ADMIN' && <Button disabled={busy} onClick={async () => {
                if (await sweetConfirmAlert(uiText('Delete this review?'))) await run('removeReviewByAdmin');
            }}>{uiText('Delete')}</Button>}
			{r.adminReply && (
				<div className="admin-reply">
					<strong>{r.replyRole === 'SELLER' ? 'Seller Reply' : 'Admin Reply'}</strong>
					<p>{r.adminReply}</p>
				</div>
			)}
			{(user.memberType === 'ADMIN' || (user.memberType === 'SELLER' && user._id === sellerId)) && (
				<>

					<Button onClick={() => setOpen(!open)}>{uiText("Reply")}</Button>
					{open && (
						<form
							onSubmit={(e) => {
								e.preventDefault();
								run('replyReview');
							}}
						>
							<label className="field-above">
								{uiText("Reply")}<textarea required maxLength={3000} value={reply} onChange={(e) => setReply(e.target.value)} />
							</label>
							<Button type="submit" disabled={busy || !reply.trim()}>
								{uiText("Save Reply")}</Button>
						</form>
					)}
				</>
			)}
		</article>
	);
}

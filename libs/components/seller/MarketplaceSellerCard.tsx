import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { IconButton } from '@mui/material';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { userVar } from '../../../apollo/store';
import { Photo } from '../common/Marketplace';
import { useAction } from '../../hooks/useMarketplace';
export default function SellerCard({ seller: s, compact = false }: any) {
	const user = useReactiveVar(userVar),
		router = useRouter(),
		action = useAction(),
		[busy, setBusy] = useState(false);
	const target = { pathname: '/sellers/detail', query: { id: s._id } };
	return (
		<article className={`seller-card ${compact ? 'compact' : ''}`}>
			<Link href={target} className="seller-portrait">
				<Photo src={s.memberImage} alt={s.memberNick} />
				<span>{s.memberProducts} products</span>
			</Link>
			<div className="seller-card-copy">
				<Link href={target}>
					<h3>{s.memberNick}</h3>
				</Link>
				{!compact && <p>{s.memberDesc}</p>}
				<div className="seller-counters">
					<span title="Views">
						<VisibilityOutlined fontSize="small" />
						{s.memberViews}
					</span>
					<span>
						<IconButton
							size="small"
							aria-label={`Like ${s.memberNick}`}
							aria-pressed={Boolean(s.meLiked?.length)}
							disabled={busy}
							onClick={async () => {
								if (!user._id) {
									router.push({ pathname: '/account/join', query: { returnTo: router.asPath } });
									return;
								}
								setBusy(true);
								try {
									await action('likeTargetMember', { memberId: s._id });
								} catch {
								} finally {
									setBusy(false);
								}
							}}
						>
							{s.meLiked?.length ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
						</IconButton>
						{s.memberLikes}
					</span>
				</div>
			</div>
		</article>
	);
}

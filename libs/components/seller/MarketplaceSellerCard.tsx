import useUiText from '../../hooks/useUiText';
import FollowButton from './FollowButton';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { IconButton } from '@mui/material';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { userVar } from '../../../apollo/store';
import { Photo } from '../common/Marketplace';
import { useMemberFavorite } from '../../hooks/useMemberFavorite';
export default function SellerCard({ seller: s, compact = false }: any) {
 const uiText = useUiText();

 const user = useReactiveVar(userVar), router = useRouter();
 const favorite = useMemberFavorite(s, user._id);
 const likeSeller = async (e:any) => {
  e.preventDefault(); e.stopPropagation();
  if (!user._id) { void router.push({pathname:'/account/join',query:{returnTo:router.asPath}}); return; }
  await favorite.toggle();
 };

	const target = { pathname: '/sellers/detail', query: { id: s._id } };
	return (
		<article className={`seller-card ${compact ? 'compact' : ''}`}>
            <IconButton className="seller-top-heart" aria-label={`Like ${s.memberNick}`} aria-pressed={favorite.liked} disabled={favorite.busy} onClick={likeSeller}>{favorite.liked ? <Favorite/> : <FavoriteBorder/>}</IconButton>
			<Link href={target} className="seller-portrait">
				<Photo src={s.memberImage} alt={s.memberNick} />
				{s.memberProducts != null && <span>{s.memberProducts} {uiText("products")}</span>}
			</Link>
			{!compact && s.memberImage && (
				<Link href={target} className="seller-avatar">
					<Photo src={s.memberImage} alt={`${s.memberNick} avatar`} />
				</Link>
			)}
			<div className="seller-card-copy">
				<Link href={target}>
					<h3>{s.memberNick}</h3>
				</Link>
				{!compact && <p className="seller-description">{s.memberDesc || ''}</p>}
				<FollowButton seller={s} compact />
				{!compact && <Link href={target}>{uiText("Visit Boutique →")}</Link>}
				<div className="seller-counters">
                    {s.memberFollowers != null && <span>{s.memberFollowers} {uiText("followers")}</span>}
					<span title={uiText("Views")}>
						<VisibilityOutlined fontSize="small" />
						{s.memberViews}
					</span>
					<span>
						<FavoriteBorder fontSize="small" />
						{s.memberLikes}
					</span>
				</div>
			</div>
		</article>
	);
}

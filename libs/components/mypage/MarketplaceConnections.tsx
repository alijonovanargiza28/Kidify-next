import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { Alert, IconButton, InputAdornment, TextField, Button } from '@mui/material';
import { Favorite, FavoriteBorder, PeopleOutline, StarOutline, VisibilityOutlined, SearchOutlined } from '@mui/icons-material';
import { userVar } from '../../../apollo/store';
import { useMarketplace } from '../../hooks/useMarketplace';
import { useMemberFavorite } from '../../hooks/useMemberFavorite';
import useUiText from '../../hooks/useUiText';
import { Pager, Photo, State } from '../common/Marketplace';
import FollowButton from '../seller/FollowButton';

function ConnectionRow({ connection, followers }: any) {
 const uiText = useUiText(), { t } = useTranslation('common');
 const viewer = useReactiveVar(userVar);
 const member = followers ? connection.followerData : connection.followingData;
 const favorite = useMemberFavorite(member ? {...member, meLiked:connection.meLiked ?? member.meLiked ?? []} : undefined, viewer._id);
 if (!member) return null;
 const seller = member.memberType === 'SELLER';
 const target = { pathname: seller ? '/sellers/detail' : '/member', query: { id: member._id } };
 // Relationship aggregates carry viewer-specific follow/like flags at the row level.
 const meFollowed = connection.meFollowed ?? member.meFollowed ?? (followers ? [] : [{}]);
 return <article className="connection-card">
  <Link href={target} className="connection-portraits" aria-label={member.memberNick}>
   <div className="connection-flower"><Photo src={member.memberImage} alt={member.memberNick}/></div>
   {member.memberImage && <div className="connection-avatar"><Photo src={member.memberImage} alt=""/></div>}
  </Link>
  <div className="connection-copy">
   <Link href={target}><h3>{member.memberNick}</h3></Link>
   {member.memberDesc && <p>{member.memberDesc}</p>}
   <div className="connection-meta">
    {member.memberFollowers != null && <span><PeopleOutline/>{member.memberFollowers} {uiText('followers')}</span>}
    {seller && member.averageRating != null && <span><StarOutline/>{Number(member.averageRating).toFixed(1)}</span>}
    {seller && member.memberProducts != null && <span>{member.memberProducts} {uiText('products')}</span>}
    {seller && <Link className="connection-boutique" href={target}>{t('connections.boutique')} →</Link>}
   </div>
  </div>
  <div className="connection-stats">
   {member.memberViews != null && <span title={uiText('Views')}><VisibilityOutlined/>{member.memberViews}</span>}
   {member.memberLikes != null && <span title={uiText('Likes')}><FavoriteBorder/>{member.memberLikes}</span>}
  </div>
  <div className="connection-actions">
   {seller && <FollowButton seller={{...member, meFollowed}} compact/>}
   <Link href={target}>{t('connections.visit')}</Link>
  </div>
  <IconButton className="connection-like" aria-label={t('connections.like', {name:member.memberNick})} aria-pressed={favorite.liked} disabled={favorite.busy} onClick={e=>{e.preventDefault();e.stopPropagation();void favorite.toggle();}}>
   {favorite.liked ? <Favorite/> : <FavoriteBorder/>}
  </IconButton>
 </article>;
}

export default function Connections({ followers = false }: { followers?: boolean }) {
 const user = useReactiveVar(userVar), { t } = useTranslation('common');
 const [page, setPage] = useState(1), [search, setSearch] = useState(''), [searchError, setSearchError] = useState(false), [fetchingMore, setFetchingMore] = useState(false);
 const term = search.trim().toLocaleLowerCase();
 const operation = followers ? 'getMemberFollowers' : 'getMyFollowings';
 const input = { page: term ? 1 : page, limit: term ? 100 : 12, ...(followers ? {search:{followingId:user._id}} : {}) };
 const q = useMarketplace(operation, {input}, !user._id);
 const list = q.value?.list || [];
 const total = q.value?.metaCounter?.[0]?.total || 0;
 const fetching = useRef(false);
 // The follow API has no text filter: search loads remaining pages using its existing pagination.
 useEffect(() => {
  if (!term || q.loading || fetching.current || searchError || list.length >= total || !list.length) return;
  fetching.current = true; setFetchingMore(true);
  q.fetchMore({variables:{input:{...input,page:Math.floor(list.length / 100)+1}}, updateQuery:(previous:any,{fetchMoreResult}:any) => {
   const next = fetchMoreResult?.[operation];
   if (!next?.list?.length) { setSearchError(true); return previous; }
   const merged = Array.from(new Map([...previous[operation].list,...next.list].map((row:any)=>[row._id,row])).values());
   if (merged.length <= previous[operation].list.length) { setSearchError(true); return previous; }
   return {...previous,[operation]:{...next,list:merged}};
  }}).catch(()=>setSearchError(true)).finally(()=>{fetching.current=false;setFetchingMore(false);});
 }, [term, q.loading, list.length, total, searchError, fetchingMore]);
 const filtered = term ? list.filter((row:any)=>{
  const member = followers ? row.followerData : row.followingData;
  return `${member?.memberNick || ''} ${member?.memberDesc || ''}`.toLocaleLowerCase().includes(term);
 }) : list;
 return <div className="account-connections">
  <div className="connections-heading">
   <h2>{t(followers ? 'connections.followers' : 'connections.followings')}</h2>
   <TextField size="small" value={search} placeholder={t(followers ? 'connections.searchFollowers' : 'connections.searchFollowings')} inputProps={{'aria-label':t(followers ? 'connections.searchFollowers' : 'connections.searchFollowings')}} onChange={e=>{setSearch(e.target.value);setPage(1);setSearchError(false);}} InputProps={{startAdornment:<InputAdornment position="start"><SearchOutlined/></InputAdornment>}}/>
  </div>
  {searchError && <Alert severity="warning" action={<Button onClick={()=>setSearchError(false)}>{t('connections.retry')}</Button>}>{t('connections.searchError')}</Alert>}
  {term && list.length < total && !searchError && <p role="status">{t('connections.searching')}</p>}
  <State query={q}>
   {!q.loading && !filtered.length && <p className="connections-empty">{t(term ? 'connections.noMatches' : followers ? 'connections.noFollowers' : 'connections.noFollowings')}</p>}
   <div className="connections-list">{(term ? filtered.slice((page-1)*12,page*12) : filtered).map((row:any)=><ConnectionRow key={row._id} connection={row} followers={followers}/>)}</div>
   <Pager value={term ? {metaCounter:[{total:filtered.length}]} : q.value} page={page} limit={12} onChange={setPage}/>
  </State>
 </div>;
}

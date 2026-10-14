import useUiText from '../../hooks/useUiText';
import React, { useRef, useState } from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useAction } from '../../hooks/useMarketplace';
export default function FollowButton({ seller, contained = false, compact = false }: any) {
 const uiText = useUiText();
 const user = useReactiveVar(userVar), router = useRouter(), action = useAction();
 const locked = useRef(false); const [busy, setBusy] = useState(false);
 if (user._id === seller._id) return null;
 const followed = !!seller.meFollowed?.length;
 return <Button disabled={busy} variant={compact ? (followed ? 'contained' : 'outlined') : (contained ? 'contained' : 'text')} aria-pressed={followed} onClick={async e => {
  e.stopPropagation(); if (locked.current) return;
  if (!user._id) { void router.push('/account/join'); return; }
  locked.current = true; setBusy(true);
  try { await action(followed ? 'unsubscribe' : 'subscribe', { input: seller._id }); }
  catch {} finally { locked.current = false; setBusy(false); }
 }}>{uiText(followed ? (compact ? 'Unfollow' : 'Following · Unfollow') : 'Follow')}</Button>;
}

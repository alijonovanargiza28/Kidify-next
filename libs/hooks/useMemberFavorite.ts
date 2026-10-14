import { useApolloClient } from '@apollo/client';
import { useState } from 'react';
import { mutationOperations } from '../../apollo/user/marketplace-mutation';
import { requestError } from '../utils/requestError';
import { sweetErrorAlert } from '../sweetAlert';
import useUiText from './useUiText';

const pending = new Set<string>();
export function useMemberFavorite(member: any, viewerId: string) {
 const client = useApolloClient(), [busy, setBusy] = useState(false), uiText = useUiText();
 const liked = !!viewerId && !!member?.meLiked?.some((like: any) => like.myFavorite && String(like.memberId) === String(viewerId));
 const toggle = async () => {
  if (!viewerId || !member?._id) return;
  const key = `${viewerId}:${member._id}`;
  if (pending.has(key)) return;
  pending.add(key); setBusy(true);
  try {
   await client.mutate({
    mutation: mutationOperations.likeTargetMember,
    variables: { memberId: member._id },
    update(cache, { data }) {
     const target = data?.likeTargetMember;
     if (!target) return;
     const flags = liked ? [] : [{ __typename: 'MeLiked', memberId: viewerId, likeRefId: member._id, myFavorite: true }];
     const cacheId = cache.identify(target);
     if (cacheId) cache.modify({ id: cacheId, fields: { meLiked: () => flags } });
     // Follow query aggregates keep viewer flags on their relationship rows, too.
     cache.modify({ id: 'ROOT_QUERY', fields: Object.fromEntries(
      ['getMyFollowings','getMemberFollowings','getMemberFollowers','getSellerFollowers'].map(name => [name, (existing: any, { readField }: any) => {
       if (!existing?.list) return existing;
       return { ...existing, list: existing.list.map((row: any) => {
        const memberField = name === 'getMemberFollowers' || name === 'getSellerFollowers' ? 'followerData' : 'followingData';
        if (String(readField('_id', readField(memberField, row))) !== String(member._id)) return row;
        if (row.__ref) { cache.modify({ id: row.__ref, fields: { meLiked: () => flags } }); return row; }
        return { ...row, meLiked: flags };
       }) };
      }])
     ) });
    },
   });
  } catch (error) { await sweetErrorAlert(uiText(requestError(error))); }
  finally { pending.delete(key); setBusy(false); }
 };
 return { liked, busy, toggle };
}

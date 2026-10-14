import { useApolloClient } from '@apollo/client';
import { useState } from 'react';
import { mutationOperations } from '../../apollo/user/marketplace-mutation';
import { sweetErrorAlert } from '../sweetAlert';
import { requestError } from '../utils/requestError';
const pending = new Set<string>();
export function useProductFavorite(product: any, memberId: string) {
 const client = useApolloClient();
 const [busy, setBusy] = useState(false);
 const liked = !!memberId && !!product?.meLiked?.some((like: any) => like.myFavorite && String(like.memberId) === String(memberId));
 const toggle = async () => {
  if (!memberId || !product?._id) return;
  const key = `${memberId}:${product._id}`;
  if (pending.has(key)) return;
  pending.add(key); setBusy(true);
  try {
   await client.mutate({
    mutation: mutationOperations.favoriteProduct,
    variables: { productId: product._id },
    optimisticResponse: { __typename: 'Mutation', favoriteProduct: { ...product,
     meLiked: liked ? [] : [{ __typename: 'MeLiked', memberId, likeRefId: product._id, myFavorite: true }],
     productFavorites: Math.max(0, (product.productFavorites || 0) + (liked ? -1 : 1)),
    } },
    update(cache, { data }) {
     if (data?.favoriteProduct?.meLiked?.length) return;
     cache.modify({ id: 'ROOT_QUERY', fields: {
      getMyFavoriteProducts(existing: any, { readField }: any) {
       if (!existing?.list) return existing;
       const list = existing.list.filter((item: any) => readField('_id', item) !== product._id);
       if (list.length === existing.list.length) return existing;
       return { ...existing, list, metaCounter: existing.metaCounter?.map((counter: any) => ({ ...counter, total: Math.max(0, counter.total - 1) })) };
      },
     } });
    },
   });
   // Refill paginated wishlist pages, without reloading unrelated catalog queries.
   await client.refetchQueries({ include: Array.from(client.getObservableQueries('active').values()).filter(query => query.queryName === 'getMyFavoriteProducts').map(query => query.options.query) });
  } catch (error) { await sweetErrorAlert(requestError(error)); }
  finally { pending.delete(key); setBusy(false); }
 };
 return { liked, busy, toggle };
}

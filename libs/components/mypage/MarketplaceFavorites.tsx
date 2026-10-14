import useUiText from '../../hooks/useUiText';
import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useMarketplace, useAction } from '../../hooks/useMarketplace';
import ProductCard from '../property/MarketplaceProductCard';
import { State, Pager } from '../common/Marketplace';
export default function Favorites({ visited = false }: any) {
 const uiText = useUiText();

	const [page, setPage] = useState(1),
		action = useAction();
	const q = useMarketplace(visited ? 'getRecentlyVisitedProducts' : 'getMyFavoriteProducts', {
		input: { page, limit: 12 },
	});
	return (
		<>
			<h2>{visited ? 'Recently Visited' : 'My Wishlist'}</h2>
			{visited && <Button onClick={() => void action('clearRecentlyVisited').catch(() => {})}>{uiText("Clear history")}</Button>}
			<State query={q} empty={q.value?.list?.length === 0}>
				<div className="product-grid">
					{q.value?.list?.map((p: any) => (
						<ProductCard key={p._id} product={p} />
					))}
				</div>
				<Pager value={q.value} page={page} onChange={setPage} />
			</State>
		</>
	);
}

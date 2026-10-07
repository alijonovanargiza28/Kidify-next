import React from 'react';
import Link from 'next/link';
import { useMarketplace } from '../../hooks/useMarketplace';
import { Photo, State } from './Marketplace';
export default function Brands() {
	const q = useMarketplace('getBrands', { input: { page: 1, limit: 12 } });
	return (
		<section className="home-section">
			<div className="section-heading">
				<div>
					<h2>Our Brands</h2>
					<p>Discover beautiful collections from brands we love.</p>
				</div>
			</div>
			<State query={q} empty={q.value?.list?.length === 0}>
				<div className="brand-grid">
					{q.value?.list?.map((brand: any) => (
						<Link
							className="brand-tile"
							key={brand._id}
							href={{ pathname: '/products', query: { brandId: brand._id } }}
						>
							<Photo src={brand.brandImage} alt={brand.brandName} />
							<div>
								<h3>{brand.brandName}</h3>
								<span>View Collection →</span>
							</div>
						</Link>
					))}
				</div>
			</State>
		</section>
	);
}

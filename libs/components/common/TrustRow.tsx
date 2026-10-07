import React from 'react';
import VerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
export default function TrustRow() {
	return (
		<section className="trust-row" aria-label="Shopping with Kidify">
			<div>
				<VerifiedUserOutlined />
				<h3>Verified Sellers</h3>
				<p>Explore our community of boutiques.</p>
			</div>
			<div>
				<ShoppingBagOutlined />
				<h3>Secure Shopping</h3>
				<p>Keep track of purchases in your account.</p>
			</div>
			<div>
				<FavoriteBorder />
				<h3>Quality & Care</h3>
				<p>Discover materials and care details before you choose.</p>
			</div>
		</section>
	);
}

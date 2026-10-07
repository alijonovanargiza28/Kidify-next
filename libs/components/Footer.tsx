import React from 'react';
import Link from 'next/link';
export default function Footer() {
	return (
		<footer className="kidify-footer">
			<div className="kidify-container">
				<div className="footer-grid">
					<div>
						<Link href="/" className="wordmark">
							Kidify
						</Link>
						<p>
							Curated elegance and gentle essentials for life's most precious beginnings. Heirloom nursery crafts, pure
							organic apparel, and mindful gifting.
						</p>
					</div>
					<div>
						<h3>Customer Care</h3>
						<Link href="/cs?category=DELIVERY">Shipping & Delivery</Link>
						<Link href="/cs?category=RETURN_EXCHANGE">Returns & Exchanges</Link>
						<Link href="/mypage?category=orders">Track Order</Link>
						<Link href="/cs">Contact Us</Link>
					</div>
					<div>
						<h3>Marketplace & Sellers</h3>
						<Link href="/account/join?mode=signup">Sell on Kidify</Link>
						<Link href="/sellers">Our Sellers</Link>
						<Link href="/mypage">My Account</Link>
						<Link href="/community">Community</Link>
					</div>
				</div>
				<div className="footer-bottom">© {new Date().getFullYear()} Kidify. Children's Marketplace.</div>
			</div>
		</footer>
	);
}

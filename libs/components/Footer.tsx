import useUiText from '../hooks/useUiText';
import React from 'react';
import Link from 'next/link';
export default function Footer() {
 const uiText = useUiText();

	return (
		<footer className="kidify-footer">
			<div className="kidify-container">
				<div className="footer-grid">
					<div>
						<Link href="/" className="wordmark">
							{uiText("Kidify")}</Link>
						<p>
							{uiText("Curated elegance and gentle essentials for life's most precious beginnings. Heirloom nursery crafts, pure organic apparel, and mindful gifting.")}</p>
					</div>
					<div>
						<h3>{uiText("Customer Care")}</h3>
						<Link href="/cs?category=DELIVERY">{uiText("Shipping & Delivery")}</Link>
						<Link href="/cs?category=RETURN_EXCHANGE">{uiText("Returns & Exchanges")}</Link>
						<Link href="/mypage?category=orders">{uiText("Track Order")}</Link>
						<Link href="/cs">{uiText("Contact Us")}</Link>
					</div>
					<div>
						<h3>{uiText("Marketplace & Sellers")}</h3>
						<Link href="/account/join?mode=signup">{uiText("Sell on Kidify")}</Link>
						<Link href="/sellers">{uiText("Our Sellers")}</Link>
						<Link href="/mypage">{uiText("My Account")}</Link>
						<Link href="/community">{uiText("Community")}</Link>
					</div>
				</div>
				<div className="footer-bottom">© {new Date().getFullYear()} {uiText("Kidify. Children's Marketplace.")}</div>
			</div>
		</footer>
	);
}

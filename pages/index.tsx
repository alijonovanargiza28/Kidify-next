import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade, A11y } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import withLayout from '../libs/components/layout/LayoutHome';
import { useMarketplace } from '../libs/hooks/useMarketplace';
import SellerCard from '../libs/components/seller/MarketplaceSellerCard';
import Brands from '../libs/components/common/Brands';
import TrustRow from '../libs/components/common/TrustRow';
import ProductCard from '../libs/components/property/MarketplaceProductCard';
import { Photo, State } from '../libs/components/common/Marketplace';
import { stitchImages } from '../libs/components/homepage/stitch-assets';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
const categories = [
	['Girls', 8, 'collection', 'GIRLS'],
	['Boys', 9, 'collection', 'BOYS'],
	['Newborn', 10, 'collection', 'NEWBORN'],
	['Baby', 11, 'collection', 'BABY'],
	['Shoes', 12, 'type', 'SHOES'],
	['Accessories', 13, 'type', 'ACCESSORY'],
	['Toys', 14, 'type', 'TOYS'],
	['Books', 15, 'type', 'BOOKS'],
] as const;
function ProductsSection({ title, sort }: any) {
	const q = useMarketplace('getProducts', { input: { page: 1, limit: 4, sort } });
	return (
		<section className="home-section">
			<div className="section-heading">
				<h2>{title}</h2>
				<Link href={{ pathname: '/products', query: { sort } }}>View All →</Link>
			</div>
			<State query={q} empty={q.value?.list?.length === 0}>
				<div className="product-grid four">
					{q.value?.list?.map((p: any) => (
						<ProductCard key={p._id} product={p} />
					))}
				</div>
			</State>
		</section>
	);
}
function Home() {
	const router = useRouter(),
		sellers = useMarketplace('getSellers', {
			input: { page: 1, limit: 6, sort: 'memberLikes', direction: 'DESC', search: {} },
		}),
		events = useMarketplace('getEvents', { input: { page: 1, limit: 3 } });
	return (
		<>
			<section className="kidify-hero">
				<Swiper
					modules={[Autoplay, Navigation, Pagination, EffectFade, A11y]}
					effect="fade"
					fadeEffect={{ crossFade: true }}
					speed={1000}
					navigation
					pagination={{ clickable: true }}
					autoplay={{ delay: 4500, pauseOnMouseEnter: true, disableOnInteraction: false }}
					loop
				>
					{[1, 2].map((n, i) => (
						<SwiperSlide key={n}>
							<Photo src={stitchImages[n].src} alt={stitchImages[n].alt} />
							<div className="hero-copy">
								{i === 1 && <h1>Delicate Skin.</h1>}
								<Button
									variant="contained"
									onClick={() => router.push({ pathname: '/products', query: { type: i ? 'BABY_CARE' : 'TOYS' } })}
								>
									{i ? 'Explore Baby Care' : 'Explore Plushies'} →
								</Button>
								<Button className="hero-secondary" onClick={() => router.push('/community')}>
									Nursery Stories
								</Button>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										const f = new FormData(e.currentTarget);
										router.push({
											pathname: '/products',
											query: { collection: String(f.get('collection') || ''), text: String(f.get('text') || '') },
										});
									}}
								>
									<select name="collection" aria-label="Collection">
										<option value="">Category / Age</option>
										{['NEWBORN', 'BABY', 'GIRLS', 'BOYS', 'MOM'].map((c) => (
											<option key={c}>{c}</option>
										))}
									</select>
									<input name="text" placeholder="Find something special" aria-label="Search products" />
									<Button type="submit" variant="contained">
										Search
									</Button>
								</form>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</section>
			<section className="intro-promos">
				{[
					[3, 'Exclusive Collections', 'TOYS'],
					[4, 'Happiness Guaranteed', 'BABY_CARE'],
					[5, 'Trending Toys', 'DEVELOPMENT_TOYS'],
				].map(([n, title, type]) => (
					<Link key={title} href={{ pathname: '/products', query: { type } }}>
						<Photo src={stitchImages[Number(n)].src} alt={String(title)} />
						<h3>{title}</h3>
						<span>Discover more →</span>
					</Link>
				))}
			</section>
			<section className="split-promos">
				{[
					[6, 'New Born', 'NEWBORN'],
					[7, 'Best Collections For Your Baby', 'BABY'],
				].map(([n, title, collection]) => (
					<Link key={title} href={{ pathname: '/products', query: { collection } }}>
						<div>
							<p className="eyebrow">Gentle essentials</p>
							<h2>{title}</h2>
							<span>Shop Now →</span>
						</div>
						<Photo src={stitchImages[Number(n)].src} alt={String(title)} />
					</Link>
				))}
			</section>
			<section className="home-section">
				<div className="section-heading">
					<h2>Shop by Category</h2>
					<Link href="/products">All Departments →</Link>
				</div>
				<Swiper
					className="category-carousel"
					modules={[Navigation, A11y]}
					navigation
					slidesPerView={2}
					spaceBetween={24}
					breakpoints={{ 640: { slidesPerView: 4 }, 1024: { slidesPerView: 6 } }}
				>
					{categories.map(([name, i, key, value]) => (
						<SwiperSlide key={name}>
							<Link href={{ pathname: '/products', query: { [key]: value } }}>
								<Photo src={stitchImages[i].src} alt={name} />
								<span>{name}</span>
							</Link>
						</SwiperSlide>
					))}
				</Swiper>
			</section>
			<ProductsSection title="New In Store" sort="NEWEST" />
			<ProductsSection title="Best Sellers" sort="BEST_SELLING" />
			<Link className="sale-banner" href="/products?saleOnly=true">
				<Photo src={stitchImages[36].src} alt="Little styles, special prices" />
				<div>
					<p className="eyebrow">Special Offers</p>
					<h2>
						Little styles,
						<br />
						special prices.
					</h2>
					<span>Shop the sale →</span>
				</div>
			</Link>
			<section className="home-section">
				<div className="section-heading">
					<h2>Top Sellers</h2>
					<Link href="/sellers">View all sellers →</Link>
				</div>
				<State query={sellers} empty={sellers.value?.list?.length === 0}>
					<div className="seller-strip">
						{sellers.value?.list?.map((seller: any) => (
							<SellerCard key={seller._id} seller={seller} compact />
						))}
					</div>
				</State>
			</section>
			<ProductsSection title="Trending Now" sort="TRENDING" />
			<Brands />
			<section className="home-section">
				<div className="section-heading">
					<h2>Kidify Events</h2>
					<Link href="/events">All Upcoming Events →</Link>
				</div>
				<State query={events} empty={events.value?.list?.length === 0}>
					<div className="editorial-grid">
						{events.value?.list?.map((e: any) => (
							<Link className="editorial-card" key={e._id} href={{ pathname: '/events', query: { id: e._id } }}>
								<Photo src={e.images?.[0]} alt={e.title} />
								<div>
									<p className="eyebrow">{e.eventType.replace(/_/g, ' ')}</p>
									<h3>{e.title}</h3>
									<p>{e.description}</p>
									<span>View Event →</span>
								</div>
							</Link>
						))}
					</div>
				</State>
			</section>
			<TrustRow />
		</>
	);
}
export default withLayout(Home);

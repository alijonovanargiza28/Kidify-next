import useUiText from '../libs/hooks/useUiText';
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
import TrustRow from '../libs/components/common/TrustRow';
import ProductCard from '../libs/components/property/MarketplaceProductCard';
import { Photo, State } from '../libs/components/common/Marketplace';
import { stitchImages } from '../libs/components/homepage/stitch-assets';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
const heroSlides = [
	{ image: 'plush-toys', alt: 'Baby cuddling a plush bunny', cta: 'Explore Plush Toys', title: '', filter: 'type', value: 'TOYS', position: '58% 50%' },
	{ image: 'baby-care', alt: 'Baby with baby care essentials', cta: 'Explore Baby Care', title: 'Delicate Skin.', filter: 'type', value: 'BABY_CARE', position: '58% 50%' },
	{ image: 'developmental-toys', alt: 'Child playing with wooden developmental toys', cta: 'Explore Developmental Toys', title: '', filter: 'type', value: 'DEVELOPMENT_TOYS', position: '43% 50%' },
	{ image: 'feeding', alt: 'Blush and cream feeding essentials', cta: 'Explore Feeding Essentials', title: '', filter: 'type', value: 'FEEDING', position: '50% 50%' },
] as const;
const categories = [
	['Girls', 8, 'collection', 'GIRLS'],
	['Boys', 9, 'collection', 'BOYS'],
	['Newborn', 10, 'collection', 'NEWBORN'],
	['Baby', 11, 'collection', 'BABY'],
	['Shoes', 12, 'type', 'SHOES'],
	['Accessories', '/img/hero/feeding.png', 'type', 'ACCESSORY'],
	['Toys', 14, 'type', 'TOYS'],
	['Baby Care', '/img/hero/baby-care.png', 'type', 'BABY_CARE'],
	['Books', 15, 'type', 'BOOKS'],
	['Feeding', '/img/hero/feeding.png', 'type', 'FEEDING'],
	['Strollers', 26, 'type', 'STROLLER'],
	['Bath Essentials', '/img/hero/baby-care.png', 'type', 'BATH'],
	['Developmental Toys', '/img/hero/developmental-toys.png', 'type', 'DEVELOPMENT_TOYS'],
	['Plush Toys', '/img/hero/plush-toys.png', 'category', 'PLUSH_TOYS'],
	['Hats & Bonnets', 43, 'category', 'HAT'],
	['Clothing Sets', 23, 'category', 'SET'],
] as const;
function ProductsSection({ title, sort }: any) {
 const uiText = useUiText();

	const q = useMarketplace('getProducts', { input: { page: 1, limit: 8, sort } });
	return (
		<section className="home-section">
			<div className="section-heading">
				<h2>{uiText(String(title))}</h2>
				<Link href={{ pathname: '/products', query: { sort } }}>{uiText("View All →")}</Link>
			</div>
			<State query={q} empty={q.value?.list?.length === 0}>
				<div className="product-grid four">
					{q.value?.list?.slice(0, 8).map((p: any) => (
						<ProductCard key={p._id} product={p} />
					))}
				</div>
			</State>
		</section>
	);
}
function Home() {
 const uiText = useUiText();

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
					{heroSlides.map((slide, i) => (
						<SwiperSlide key={slide.image}>
							<Photo src={`/img/hero/${slide.image}.png`} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" style={{ objectFit: 'cover', objectPosition: slide.position }} />
							<Link className="hero-slide-link" href={{ pathname: "/products", query: { [slide.filter]: slide.value } }} aria-label={uiText(slide.cta)} />
							<div className="hero-copy">
								{slide.title && <h1>{uiText(slide.title)}</h1>}
								<Button
									variant="contained"
									onClick={() => router.push({ pathname: '/products', query: { [slide.filter]: slide.value } })}
								>
									{uiText(slide.cta)} →
								</Button>
								<Button className="hero-secondary" onClick={() => router.push('/community')}>
									{uiText("Nursery Stories")}</Button>
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
									<select name="collection" aria-label={uiText("Collection")}>
										<option value="">{uiText("Category / Age")}</option>
										{['NEWBORN', 'BABY', 'GIRLS', 'BOYS', 'MOM'].map((c) => (
											<option key={c} value={c}>{uiText(c)}</option>
										))}
									</select>
									<input name="text" placeholder={uiText("Find something special")} aria-label={uiText("Search products")} />
									<Button type="submit" variant="contained">
										{uiText("Search")}</Button>
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
						<div className="promo-frame"><Photo src={stitchImages[Number(n)].src} alt={String(title)} /></div>
						<div className="promo-copy">
							<h3>{uiText(String(title))}</h3>
							<span>{uiText("Discover more →")}</span>
						</div>
					</Link>
				))}
			</section>
			<section className="split-promos">
				{[
					['/img/offers/newborn-basket.jpg', 'New Born', 'NEWBORN'],
					['/img/offers/baby-collection.jpg', 'Best Collections For Your Baby', 'BABY'],
				].map(([n, title, collection]) => (
					<Link key={title} href={{ pathname: '/products', query: { collection } }}>
						<div>
							<p className="eyebrow">{uiText("Gentle essentials")}</p>
							<h2>{uiText(String(title))}</h2>
							<span>{uiText("Shop Now →")}</span>
						</div>
						<Photo src={String(n)} alt={String(title)} />
					</Link>
				))}
			</section>
			<section className="home-section">
				<div className="section-heading">
					<h2>{uiText("Shop by Category")}</h2>
					<Link href="/products">{uiText("All Departments →")}</Link>
				</div>
				<Swiper
					className="category-carousel"
					
					modules={[Autoplay, Navigation, A11y]}
                    autoplay={{delay:4500,disableOnInteraction:true,pauseOnMouseEnter:true}}
                    speed={900}
					navigation
					slidesPerView="auto"
					spaceBetween={14}
					grabCursor
				>
					{categories.map(([name, i, key, value]) => (
						<SwiperSlide key={uiText(name)}>
							<Link href={{ pathname: '/products', query: { [key]: value } }}>
								<span className="category-frame">
									<Photo src={typeof i === 'number' ? stitchImages[i].src : i} alt={uiText(name)} />
								</span>
								<span style={{ whiteSpace: 'nowrap' }}>{uiText(name)}</span>
							</Link>
						</SwiperSlide>
					))}
				</Swiper>
			</section>
			<ProductsSection title={uiText("New In Store")} sort="NEWEST" />
			<ProductsSection title={uiText("Best Sellers")} sort="BEST_SELLING" />
			<section className="sale-banner">
				<Photo className="sale-offer-image" src="/img/offers/baby-knit-collection.png" alt="Baby knitwear and nursery accessories" />
				<div>
					<p className="eyebrow">{uiText("Special Offers")}</p>
					<h2>
						{uiText("Little styles,")}<br />
						{uiText("special prices.")}</h2>
					<Link href="/products?saleOnly=true">{uiText("SHOP SALE")}</Link>
				</div>
			</section>
			<section className="home-section">
				<div className="section-heading">
					<h2>{uiText("Top Sellers")}</h2>
					<Link href="/sellers">{uiText("View all sellers →")}</Link>
				</div>
				<State query={sellers} empty={sellers.value?.list?.length === 0}>
					<div className="seller-strip seller-portraits">
						{sellers.value?.list?.map((seller: any) => (
							<Link key={seller._id} className="home-seller-portrait" href={{pathname:'/sellers/detail',query:{id:seller._id}}} aria-label={seller.memberNick}>
                                <Photo src={seller.memberImage} alt={seller.memberNick}/>
                            </Link>
						))}
					</div>
				</State>
			</section>
			<ProductsSection title={uiText("Trending Now")} sort="MOST_FAVORITED" />
			<section className="home-section">
				<div className="section-heading">
					<h2>{uiText("Kidify Events")}</h2>
					<Link href="/events">{uiText("All Upcoming Events →")}</Link>
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
									<span>{uiText("View Event →")}</span>
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

import { useTranslation } from 'next-i18next';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import styles from '../../libs/components/common/MarketplaceRedesign.module.scss';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import withLayout from '../../libs/components/layout/LayoutBasic';
import { useMarketplace } from '../../libs/hooks/useMarketplace';
import { State, Photo, PageTitle, Pager } from '../../libs/components/common/Marketplace';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
function Events() {
 const { t } = useTranslation('common');
	const router = useRouter(),
		id = String(router.query.id || ''),
		[page, setPage] = useState(1),
		q = useMarketplace('getEvents', { input: { page, limit: 12 } }, !!id),
		detail = useMarketplace('getEvent', { id }, !id);
	if (id)
		return (
			<State query={detail}>
				{detail.value && (
					<>
                        <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">{t('HOME')}</Link><span>/</span><Link href="/events">{t('redesign.events')}</Link><span>/</span><span>{detail.value.title}</span></nav>
                        <article className={styles.eventCard}>
                          <Photo src={detail.value.images?.[0]} alt={detail.value.title} />
                          <div>
                            <span className={styles.eventType}>{detail.value.eventType.replace(/_/g, ' ')}</span>
                            <h1>{detail.value.title}</h1>
                            <p className={styles.eventDate}><CalendarMonthOutlined />{new Date(detail.value.startAt).toLocaleDateString(router.locale)} — {new Date(detail.value.endAt).toLocaleDateString(router.locale)}</p>
                            <p>{detail.value.description}</p>
                            <Link href="/events">{t('redesign.allEvents')} →</Link>
                          </div>
                        </article>
					</>
				)}
			</State>
		);
	return (
		<>
			<PageTitle title="Kidify Events" />
			<State query={q} empty={q.value?.list?.length === 0}>
				<div className="editorial-grid">
					{q.value?.list?.map((e: any) => (
						<Link key={e._id} className="editorial-card" href={{ pathname: '/events', query: { id: e._id } }}>
							<Photo src={e.images?.[0]} alt={e.title} style={{ objectFit: "contain" }} />
							<div>
								<h3>{e.title}</h3>
								<p>{e.description}</p>
								<span>View Event →</span>
							</div>
						</Link>
					))}
				</div>
				<Pager value={q.value} page={page} onChange={setPage} />
			</State>
		</>
	);
}
export default withLayout(Events);

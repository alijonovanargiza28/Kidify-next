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
						<PageTitle title={detail.value.title} subtitle={detail.value.eventType.replace(/_/g, ' ')} />
						<Photo
							src={detail.value.images?.[0]}
							alt={detail.value.title}
							style={{ maxHeight: 500, width: '100%', borderRadius: 18 }}
						/>
						<p>
							{new Date(detail.value.startAt).toLocaleDateString()} —{' '}
							{new Date(detail.value.endAt).toLocaleDateString()}
						</p>
						<p style={{ whiteSpace: 'pre-wrap' }}>{detail.value.description}</p>
						<Link href="/events">All Events →</Link>
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
							<Photo src={e.images?.[0]} alt={e.title} />
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

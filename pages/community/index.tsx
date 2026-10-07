import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Button, TextField, MenuItem } from '@mui/material';
import { userVar } from '../../apollo/store';
import withLayout from '../../libs/components/layout/LayoutBasic';
import { useMarketplace } from '../../libs/hooks/useMarketplace';
import { State, Photo, Pager, PageTitle } from '../../libs/components/common/Marketplace';
import { backendEnums } from '../../libs/types/marketplace';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
function Community() {
	const router = useRouter(),
		user = useReactiveVar(userVar),
		[page, setPage] = useState(1),
		[category, setCategory] = useState(''),
		[text, setText] = useState('');
	const q = useMarketplace('getBoardArticles', {
		input: { page, limit: 12, search: { ...(category ? { articleCategory: category } : {}), text } },
	});
	return (
		<>
			<PageTitle title="Community" subtitle="Stories, advice and little moments worth sharing." />
			<div className="result-toolbar">
				<TextField
					label="Search stories"
					value={text}
					onChange={(e) => {
						setText(e.target.value);
						setPage(1);
					}}
				/>
				<TextField InputLabelProps={{htmlFor:undefined}}
					select
					label="Category"
					value={category}
					onChange={(e) => {
						setCategory(e.target.value);
						setPage(1);
					}}
					fullWidth
				>
					<MenuItem value="">All</MenuItem>
					{backendEnums.BoardArticleCategory.map((c) => (
						<MenuItem key={c} value={c}>
							{c.replace(/_/g, ' ')}
						</MenuItem>
					))}
				</TextField>
				{['SELLER', 'ADMIN'].includes(user.memberType) && (
					<Button onClick={() => router.push('/mypage?category=articles')}>Write an article</Button>
				)}
			</div>
			<State query={q} empty={q.value?.list?.length === 0}>
				<div className="editorial-grid">
					{q.value?.list?.map((a: any) => (
						<Link className="editorial-card" key={a._id} href={{ pathname: '/community/detail', query: { id: a._id } }}>
							<Photo src={a.articleImage} alt={a.articleTitle} />
							<div>
								<p className="eyebrow">{a.articleCategory.replace(/_/g, ' ')}</p>
								<h3>{a.articleTitle}</h3>
								<p>
									{a.memberData?.memberNick} · {a.articleViews} views
								</p>
								<span>Read Story →</span>
							</div>
						</Link>
					))}
				</div>
				<Pager value={q.value} page={page} onChange={setPage} />
			</State>
		</>
	);
}
export default withLayout(Community);

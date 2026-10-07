import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Button, TextField, MenuItem, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { userVar } from '../../apollo/store';
import withLayout from '../../libs/components/layout/LayoutBasic';
import { useMarketplace } from '../../libs/hooks/useMarketplace';
import { State, Pager, PageTitle } from '../../libs/components/common/Marketplace';
import { backendEnums } from '../../libs/types/marketplace';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
function CS() {
	const router = useRouter(),
		user = useReactiveVar(userVar),
		[text, setText] = useState(''),
		[page, setPage] = useState(1);
	const category = String(router.query.category || '');
	const q = useMarketplace('getFAQs', {
		input: { page, limit: 10 },
		text,
		...(category && backendEnums.FAQCategory.includes(category as any) ? { category } : {}),
	});
	return (
		<>
			<PageTitle title="How can we help?" subtitle="Customer Care & Frequently Asked Questions" />
			<div className="result-toolbar">
				<TextField
					label="Search help"
					value={text}
					onChange={(e) => {
						setText(e.target.value);
						setPage(1);
					}}
				/>
				<TextField InputLabelProps={{htmlFor:undefined}}
					select
					fullWidth
					label="Category"
					value={category}
					onChange={(e) => {
						setPage(1);
						router.push({ pathname: '/cs', query: { category: e.target.value } });
					}}
				>
					<MenuItem value="">All</MenuItem>
					{backendEnums.FAQCategory.map((c) => (
						<MenuItem key={c} value={c}>
							{c.replace(/_/g, ' ')}
						</MenuItem>
					))}
				</TextField>
			</div>
			<State query={q} empty={q.value?.list?.length === 0}>
				{q.value?.list?.map((f: any) => (
					<Accordion key={f._id} elevation={0}>
						<AccordionSummary expandIcon={<ExpandMore />}>{f.question}</AccordionSummary>
						<AccordionDetails>{f.answer}</AccordionDetails>
					</Accordion>
				))}
				<Pager value={q.value} page={page} limit={10} onChange={setPage} />
			</State>
			<section className="panel">
				<h2>Still need a hand?</h2>
				<p>Send a message to our support team.</p>
				<Button
					variant="contained"
					onClick={() =>
						router.push(user._id ? '/mypage?category=support' : '/account/join?returnTo=%2Fmypage%3Fcategory%3Dsupport')
					}
				>
					Contact Support
				</Button>
			</section>
		</>
	);
}
export default withLayout(CS);

import useUiText from '../../libs/hooks/useUiText';
import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Button } from '@mui/material';
import { userVar } from '../../apollo/store';
import withLayout from '../../libs/components/layout/LayoutBasic';
import { useMarketplace, useAction } from '../../libs/hooks/useMarketplace';
import { State, Photo, PageTitle } from '../../libs/components/common/Marketplace';
import Comments from '../../libs/components/common/Comments';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
const Viewer = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
function Article() {
 const uiText = useUiText();

	const router = useRouter(),
		id = String(router.query.id || router.query.articleId || ''),
		user = useReactiveVar(userVar),
		action = useAction();
	const q = useMarketplace('getBoardArticle', { articleId: id }, !id),
		a = q.value;
	return (
		<State query={q}>
			{a && (
				<>
					<PageTitle title={a.articleTitle} subtitle={a.articleCategory.replace(/_/g, ' ')} />
					{a.articleImage && (
						<Photo
							src={a.articleImage}
							alt={a.articleTitle}
							style={{ maxHeight: 500, width: '100%', borderRadius: 18 }}
						/>
					)}
					<p>
						{a.memberData?.memberNick} · {a.articleViews} {uiText("views")}</p>
					<Viewer key={a._id} markdown={a.articleContent} />
					<Button
						variant="outlined"
						onClick={() =>
							user._id
								? void action('likeTargetBoardArticle', { articleId: id }).catch(() => {})
								: router.push('/account/join')
						}
					>
						{a.meLiked?.length ? 'Unlike' : 'Like'} · {a.articleLikes}
					</Button>
					<Comments id={id} group="ARTICLE" />
				</>
			)}
		</State>
	);
}
export default withLayout(Article);

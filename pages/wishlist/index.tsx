import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import withLayout from '../../libs/components/layout/LayoutBasic';
import Favorites from '../../libs/components/mypage/MarketplaceFavorites';
import { RequireMember, PageTitle } from '../../libs/components/common/Marketplace';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
function Wishlist() {
	const user = useReactiveVar(userVar);
	return (
		<RequireMember user={user}>
			<PageTitle title="My Wishlist" />
			{user._id && <Favorites />}
		</RequireMember>
	);
}
export default withLayout(Wishlist);

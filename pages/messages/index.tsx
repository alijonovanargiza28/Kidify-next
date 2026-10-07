import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import withLayout from '../../libs/components/layout/LayoutBasic';
import Chat from '../../libs/components/Chat';
import { RequireMember, PageTitle } from '../../libs/components/common/Marketplace';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
function Messages() {
	const user = useReactiveVar(userVar);
	return (
		<RequireMember user={user}>
			<PageTitle title="Notifications & Messages" />
			{user._id && <Chat />}
		</RequireMember>
	);
}
export default withLayout(Messages);

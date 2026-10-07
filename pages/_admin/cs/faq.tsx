export const getServerSideProps = async () => ({ redirect: { destination: '/mypage?category=faq', permanent: false } });
export default function Redirect() {
	return null;
}

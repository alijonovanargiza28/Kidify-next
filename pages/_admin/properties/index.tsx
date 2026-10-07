export const getServerSideProps = async () => ({
	redirect: { destination: '/mypage?category=products', permanent: false },
});
export default function Redirect() {
	return null;
}

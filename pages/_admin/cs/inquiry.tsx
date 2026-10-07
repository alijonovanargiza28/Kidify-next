export const getServerSideProps = async () => ({
	redirect: { destination: '/mypage?category=support', permanent: false },
});
export default function Redirect() {
	return null;
}

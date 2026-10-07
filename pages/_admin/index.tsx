export const getServerSideProps = async () => ({
	redirect: { destination: '/mypage?category=dashboard', permanent: false },
});
export default function Redirect() {
	return null;
}

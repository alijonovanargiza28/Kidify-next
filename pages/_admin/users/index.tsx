export const getServerSideProps = async () => ({
	redirect: { destination: '/mypage?category=users', permanent: false },
});
export default function Redirect() {
	return null;
}

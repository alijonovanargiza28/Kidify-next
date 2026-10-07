export const getServerSideProps = async () => ({
	redirect: { destination: '/mypage?category=events', permanent: false },
});
export default function Redirect() {
	return null;
}

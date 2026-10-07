export const getServerSideProps = async () => ({
	redirect: { destination: '/mypage?category=articles', permanent: false },
});
export default function Redirect() {
	return null;
}

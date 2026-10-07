export default function About() {
	return null;
}
export const getServerSideProps = async () => ({ redirect: { destination: '/cs', permanent: false } });

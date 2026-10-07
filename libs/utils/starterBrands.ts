// Used only by the explicit Admin → Brands action. Never used as dropdown data.
export const starterBrandNames = ['Agabang', 'Moimoln', 'Happyland', 'Blue Dog Baby', 'Minkmui', 'Alro & Luglio'];
export async function addStarterBrands(
	fetchPage: (page: number) => Promise<{ list: { brandName: string }[]; metaCounter?: { total: number }[] }>,
	create: (input: { brandName: string; brandStatus: string }) => Promise<unknown>,
) {
	const existing = new Set<string>();
	for (let page = 1; ; page++) {
		const result = await fetchPage(page);
		result.list.forEach((brand) => existing.add(brand.brandName.trim().toLowerCase()));
		if (!result.list.length || page * 100 >= (result.metaCounter?.[0]?.total ?? result.list.length)) break;
	}
	let added = 0;
	for (const brandName of starterBrandNames) {
		if (existing.has(brandName.toLowerCase())) continue;
		await create({ brandName, brandStatus: 'ACTIVE' });
		existing.add(brandName.toLowerCase());
		added++;
	}
	return added;
}

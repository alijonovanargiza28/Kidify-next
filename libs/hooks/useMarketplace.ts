import { useQuery, useApolloClient } from '@apollo/client';
import { queryOperations } from '../../apollo/user/marketplace-query';
import { mutationOperations } from '../../apollo/user/marketplace-mutation';
import { sweetErrorAlert } from '../sweetAlert';
export function useMarketplace(name: keyof typeof queryOperations, variables: any = {}, skip = false) {
	const q = useQuery(queryOperations[name], {
		variables,
		skip,
		fetchPolicy: 'cache-and-network',
		notifyOnNetworkStatusChange: true,
	});
	return { ...q, value: q.data?.[name] };
}
export function useAction() {
	const client = useApolloClient();
	return async (name: keyof typeof mutationOperations, variables: any = {}) => {
		try {
			const { data } = await client.mutate({ mutation: mutationOperations[name], variables });
			await client.refetchQueries({ include: 'active' });
			return data[name];
		} catch (e: any) {
			await sweetErrorAlert(e.message || 'Request failed');
			throw e;
		}
	};
}

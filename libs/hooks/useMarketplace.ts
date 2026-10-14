import useUiText from './useUiText';
import { useQuery, useApolloClient } from '@apollo/client';
import { queryOperations } from '../../apollo/user/marketplace-query';
import { mutationOperations } from '../../apollo/user/marketplace-mutation';
import { requestError } from '../utils/requestError';
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
 const uiText = useUiText();
	const client = useApolloClient();
	return async (name: keyof typeof mutationOperations, variables: any = {}, options: { refetchActive?: boolean } = {}) => {
		try {
			const { data } = await client.mutate({ mutation: mutationOperations[name], variables });
			// A failed background query must not turn a committed mutation into a failed save.
			if (options.refetchActive !== false) await client.refetchQueries({ include: 'active' }).catch(() => {
				console.warn('[Kidify] Saved successfully; background refresh is temporarily unavailable.');
			});
			return data[name];
		} catch (e: any) {
			const message = uiText(requestError(e));
			await sweetErrorAlert(message);
			e.message = message;
			throw e;
		}
	};
}

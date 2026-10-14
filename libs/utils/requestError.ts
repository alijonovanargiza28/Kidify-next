export function requestError(e: any) {
	const raw = e?.graphQLErrors?.[0]?.extensions?.originalError?.message;
	const message = Array.isArray(raw) ? raw.join(' ') : raw || e?.message || '';
	const known: Record<string, string> = {
        COUPON_CODE_ALREADY_EXISTS: 'This coupon code already exists. Choose another code.',
        INVALID_COUPON_CODE: 'Enter a coupon code (up to 80 characters).',
        SELLER_CODE_ALREADY_EXISTS: 'This seller invitation code already exists. Choose another code.',
        SELLER_CODE_LENGTH: 'Seller code must contain 8–128 characters.',
		ORDER_NOT_FOUND: 'Choose one of your own orders.',
		CANNOT_DISABLE_OWN_ADMIN: 'You cannot disable your own admin account.',
		SELECT_SUPPORTED_MONTH: 'Choose an available month.',
		INVALID_AGE_RANGE: 'Check the supported month interval.',
		OVERLAPPING_AGE_VARIANTS: 'Month intervals for the same color must not overlap.',
		INVALID_VARIANT_IMAGES: 'Choose uploaded product images for each color.',
		INVALID_SALE_PERIOD: 'Choose a sale end after its start.',
		PURCHASE_REQUIRED_FOR_REVIEW: 'Reviews require your paid, delivered purchase of this product.',
	};
	if (/E11000|duplicate key|MongoServerError/i.test(message)) return 'This action was already processed. Refresh and try again.';
	if (known[message]) return known[message];
	if (/relatedOrderId.*mongodb/i.test(message)) return 'Choose a valid order from your order list.';
	if (/Bad Request Exception/i.test(message)) return 'Check the required fields and your selections, then try again.';
	if (/FORBIDDEN|UNAUTHENTICATED|TOKEN|Unauthorized/i.test(message))
		return 'Please sign in with an account allowed to perform this action.';
	return message.replace(/_/g, ' ') || 'Unable to save. Please try again.';
}

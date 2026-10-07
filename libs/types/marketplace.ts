/* Generated from the existing backend GraphQL schema. */
export const inputTypes = {
	PageInquiry: {
		page: {
			type: 'Int!',
			default: 1,
		},
		limit: {
			type: 'Int!',
			default: 20,
		},
		oldest: {
			type: 'Boolean!',
			default: false,
		},
	},
	ProductsInquiry: {
		page: {
			type: 'Int!',
			default: 1,
		},
		limit: {
			type: 'Int!',
			default: 20,
		},
		oldest: {
			type: 'Boolean!',
			default: false,
		},
		sort: {
			type: 'ProductSort!',
			default: 'NEWEST',
		},
		search: {
			type: 'ProductSearch',
		},
	},
	ProductSearch: {
		saleOnly: {
			type: 'Boolean',
		},
		category: {
			type: 'ProductCategory',
		},
		type: {
			type: 'ProductType',
		},
		collection: {
			type: 'ProductCollection',
		},
		brandId: {
			type: 'String',
		},
		sellerId: {
			type: 'String',
		},
		color: {
			type: 'String',
		},
		size: {
			type: 'String',
		},
		minPrice: {
			type: 'Float',
		},
		maxPrice: {
			type: 'Float',
		},
		discount: {
			type: 'Int',
		},
		status: {
			type: 'ProductStatus',
		},
		text: {
			type: 'String',
		},
	},
	OrdersInquiry: {
		page: {
			type: 'Int!',
			default: 1,
		},
		limit: {
			type: 'Int!',
			default: 20,
		},
		oldest: {
			type: 'Boolean!',
			default: false,
		},
		status: {
			type: 'OrderStatus',
		},
	},
	SellersInquiry: {
		page: {
			type: 'Int!',
		},
		limit: {
			type: 'Int!',
		},
		sort: {
			type: 'String',
		},
		direction: {
			type: 'Direction',
		},
		search: {
			type: 'AISearch!',
		},
	},
	AISearch: {
		text: {
			type: 'String',
		},
	},
	MembersInquiry: {
		page: {
			type: 'Int!',
		},
		limit: {
			type: 'Int!',
		},
		sort: {
			type: 'String',
		},
		direction: {
			type: 'Direction',
		},
		search: {
			type: 'MISearch!',
		},
	},
	MISearch: {
		memberStatus: {
			type: 'MemberStatus',
		},
		memberType: {
			type: 'MemberType',
		},
		sellerCode: {
			type: 'String',
		},
		text: {
			type: 'String',
		},
	},
	NotificationsInquiry: {
		page: {
			type: 'Int!',
			default: 1,
		},
		limit: {
			type: 'Int!',
			default: 20,
		},
		oldest: {
			type: 'Boolean!',
			default: false,
		},
		filter: {
			type: 'NotificationFilter!',
			default: 'ALL',
		},
	},
	BoardArticlesInquiry: {
		page: {
			type: 'Int!',
		},
		limit: {
			type: 'Int!',
		},
		sort: {
			type: 'String',
		},
		direction: {
			type: 'Direction',
		},
		search: {
			type: 'BAISearch!',
		},
	},
	BAISearch: {
		articleCategory: {
			type: 'BoardArticleCategory',
		},
		text: {
			type: 'String',
		},
		memberId: {
			type: 'String',
		},
	},
	AllBoardArticlesInquiry: {
		page: {
			type: 'Int!',
		},
		limit: {
			type: 'Int!',
		},
		sort: {
			type: 'String',
		},
		direction: {
			type: 'Direction',
		},
		search: {
			type: 'ABAISearch!',
		},
	},
	ABAISearch: {
		articleStatus: {
			type: 'BoardArticleStatus',
		},
		articleCategory: {
			type: 'BoardArticleCategory',
		},
	},
	CommentsInquiry: {
		page: {
			type: 'Int!',
		},
		limit: {
			type: 'Int!',
		},
		sort: {
			type: 'String',
		},
		direction: {
			type: 'Direction',
		},
		search: {
			type: 'CISearch!',
		},
	},
	CISearch: {
		commentRefId: {
			type: 'String!',
		},
	},
	FollowInquiry: {
		page: {
			type: 'Int!',
		},
		limit: {
			type: 'Int!',
		},
		search: {
			type: 'FollowSearch!',
		},
	},
	FollowSearch: {
		followingId: {
			type: 'String',
		},
		followerId: {
			type: 'String',
		},
	},
	CouponInput: {
		code: {
			type: 'String!',
		},
		discountType: {
			type: 'DiscountType!',
		},
		discountValue: {
			type: 'Float!',
		},
		minimumOrder: {
			type: 'Float',
		},
		maximumDiscount: {
			type: 'Float',
		},
		usageLimit: {
			type: 'Int',
		},
		startAt: {
			type: 'DateTime',
		},
		endAt: {
			type: 'DateTime',
		},
	},
	CartItemInput: {
		productId: {
			type: 'String!',
		},
		variantId: {
			type: 'String',
		},
		quantity: {
			type: 'Int!',
		},
	},
	ProductInput: {
		productName: {
			type: 'String!',
		},
		productDesc: {
			type: 'String',
		},
		productPrice: {
			type: 'Float!',
		},
		productImages: {
			type: '[String!]!',
		},
		productType: {
			type: 'ProductType!',
		},
		productCategory: {
			type: 'ProductCategory!',
		},
		productCollection: {
			type: 'ProductCollection',
		},
		productBrandId: {
			type: 'String',
		},
		productDiscount: {
			type: 'Int',
		},
		material: {
			type: 'String',
		},
		careInstructions: {
			type: 'String',
		},
		deliveryReturnInfo: {
			type: 'String',
		},
		productVariants: {
			type: '[ProductVariantInput!]!',
		},
	},
	ProductVariantInput: {
		color: {
			type: 'String',
		},
		size: {
			type: 'String',
		},
		stock: {
			type: 'Int!',
		},
		sku: {
			type: 'String',
		},
	},
	ProductUpdate: {
		productName: {
			type: 'String!',
		},
		productDesc: {
			type: 'String',
		},
		productPrice: {
			type: 'Float!',
		},
		productImages: {
			type: '[String!]!',
		},
		productType: {
			type: 'ProductType!',
		},
		productCategory: {
			type: 'ProductCategory!',
		},
		productCollection: {
			type: 'ProductCollection',
		},
		productBrandId: {
			type: 'String',
		},
		productDiscount: {
			type: 'Int',
		},
		material: {
			type: 'String',
		},
		careInstructions: {
			type: 'String',
		},
		deliveryReturnInfo: {
			type: 'String',
		},
		productVariants: {
			type: '[ProductVariantInput!]!',
		},
		_id: {
			type: 'String!',
		},
	},
	AddressInput: {
		recipientName: {
			type: 'String!',
		},
		phone: {
			type: 'String!',
		},
		region: {
			type: 'String!',
		},
		city: {
			type: 'String!',
		},
		district: {
			type: 'String',
		},
		street: {
			type: 'String!',
		},
		postalCode: {
			type: 'String',
		},
		instructions: {
			type: 'String',
		},
		isDefault: {
			type: 'Boolean',
		},
	},
	CheckoutInput: {
		addressId: {
			type: 'String!',
		},
		couponCode: {
			type: 'String',
		},
		requestId: {
			type: 'String!',
		},
	},
	ReviewInput: {
		group: {
			type: 'ReviewGroup!',
		},
		targetId: {
			type: 'String!',
		},
		orderId: {
			type: 'String!',
		},
		rating: {
			type: 'Int!',
		},
		text: {
			type: 'String!',
		},
	},
	MessageInput: {
		receiverId: {
			type: 'String!',
		},
		productId: {
			type: 'String',
		},
		text: {
			type: 'String!',
		},
	},
	EventInput: {
		title: {
			type: 'String!',
		},
		description: {
			type: 'String!',
		},
		images: {
			type: '[String!]!',
		},
		eventType: {
			type: 'EventType!',
		},
		startAt: {
			type: 'DateTime!',
		},
		endAt: {
			type: 'DateTime!',
		},
		status: {
			type: 'ContentStatus',
		},
	},
	FAQInput: {
		question: {
			type: 'String!',
		},
		answer: {
			type: 'String!',
		},
		category: {
			type: 'FAQCategory!',
		},
		sortOrder: {
			type: 'Int',
		},
		status: {
			type: 'ContentStatus',
		},
	},
	SupportInput: {
		subject: {
			type: 'String!',
		},
		message: {
			type: 'String!',
		},
		category: {
			type: 'FAQCategory!',
		},
		relatedOrderId: {
			type: 'String',
		},
	},
	MemberInput: {
		memberNick: {
			type: 'String!',
		},
		memberPassword: {
			type: 'String!',
		},
		memberPhone: {
			type: 'String!',
		},
		memberType: {
			type: 'MemberType',
		},
		sellerCode: {
			type: 'String',
		},
		memberAuthType: {
			type: 'MemberAuthType',
		},
	},
	LoginInput: {
		memberNick: {
			type: 'String!',
		},
		memberPassword: {
			type: 'String!',
		},
	},
	MemberUpdate: {
		_id: {
			type: 'String',
		},
		memberType: {
			type: 'MemberType',
		},
		memberStatus: {
			type: 'MemberStatus',
		},
		memberPhone: {
			type: 'String',
		},
		memberNick: {
			type: 'String',
		},
		memberPassword: {
			type: 'String',
		},
		memberFullName: {
			type: 'String',
		},
		memberImage: {
			type: 'String',
		},
		memberAddress: {
			type: 'String',
		},
		memberDesc: {
			type: 'String',
		},
	},
	SellerCodeInput: {
		code: {
			type: 'String',
		},
		expiresAt: {
			type: 'DateTime',
		},
	},
	BrandInput: {
		brandName: {
			type: 'String!',
		},
		brandImage: {
			type: 'String',
		},
		brandDescription: {
			type: 'String',
		},
		brandStatus: {
			type: 'ContentStatus',
		},
	},
	BoardArticleInput: {
		articleCategory: {
			type: 'BoardArticleCategory!',
		},
		articleTitle: {
			type: 'String!',
		},
		articleContent: {
			type: 'String!',
		},
		articleImage: {
			type: 'String',
		},
	},
	BoardArticleUpdate: {
		_id: {
			type: 'String!',
		},
		articleStatus: {
			type: 'BoardArticleStatus',
		},
		articleTitle: {
			type: 'String',
		},
		articleContent: {
			type: 'String',
		},
		articleImage: {
			type: 'String',
		},
	},
	CommentInput: {
		commentGroup: {
			type: 'CommentGroup!',
		},
		commentContent: {
			type: 'String!',
		},
		commentRefId: {
			type: 'String!',
		},
	},
	CommentUpdate: {
		_id: {
			type: 'String!',
		},
		commentStatus: {
			type: 'CommentStatus',
		},
		commentContent: {
			type: 'String',
		},
	},
} as const;
export const backendEnums = {
	MemberType: ['USER', 'SELLER', 'CS', 'ADMIN'],
	MemberStatus: ['ACTIVE', 'BLOCK', 'DELETE'],
	MemberAuthType: ['PHONE', 'EMAIL', 'TELEGRAM'],
	SellerCodeStatus: ['ACTIVE', 'USED', 'EXPIRED', 'REVOKED'],
	ProductType: [
		'CLOTHING',
		'SHOES',
		'TOYS',
		'BABY_CARE',
		'BOOKS',
		'STROLLER',
		'ACCESSORY',
		'DEVELOPMENT_TOYS',
		'FEEDING',
		'BATH',
		'OTHER',
	],
	ProductCategory: [
		'SALE',
		'TOP',
		'BOTTOM',
		'DRESS',
		'OUTERWEAR',
		'SET',
		'SHOES',
		'DEVELOPMENT_TOYS',
		'PLUSH_TOYS',
		'BOOKS',
		'CREAM',
		'LOTION',
		'SHAMPOO',
		'BATH',
		'STROLLER',
		'CAR_SEAT',
		'BAG',
		'HAT',
		'SOCKS',
		'BOTTLE',
		'PACIFIER',
		'TABLEWARE',
		'OTHER',
	],
	ProductCollection: ['NEWBORN', 'BABY', 'GIRLS', 'BOYS', 'MOM', 'MONTHLY_PHOTO', 'FIRST_BIRTHDAY', 'HOLIDAY'],
	ProductStatus: ['ACTIVE', 'PAUSE', 'SOLD_OUT', 'DELETE'],
	OrderStatus: [
		'PENDING',
		'CONFIRMED',
		'PREPARING',
		'READY_FOR_DELIVERY',
		'SHIPPED',
		'DELIVERED',
		'CANCELLED',
		'REFUNDED',
	],
	PaymentStatus: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED'],
	BoardArticleCategory: ['BABY_CARE', 'PARENTING', 'PRODUCT_GUIDE', 'NEWS', 'EVENTS', 'TIPS', 'FREE'],
	BoardArticleStatus: ['ACTIVE', 'DELETE'],
	DiscountType: ['PERCENT', 'FIXED'],
	CouponStatus: ['ACTIVE', 'DISABLED'],
	ReviewGroup: ['PRODUCT', 'SELLER'],
	ContentStatus: ['ACTIVE', 'PAUSE', 'DELETE'],
	EventType: [
		'NEWBORN',
		'MONTHLY_PHOTO',
		'BABY_100_DAYS',
		'FIRST_BIRTHDAY',
		'BIRTHDAY',
		'BABY_SHOWER',
		'HOLIDAY',
		'SALE',
	],
	FAQCategory: ['ORDER', 'PAYMENT', 'DELIVERY', 'RETURN_EXCHANGE', 'PRODUCT', 'SELLER', 'ACCOUNT', 'OTHER'],
	SupportStatus: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
	NotificationType: ['LIKE', 'COMMENT', 'FOLLOW', 'ORDER', 'DELIVERY', 'EVENT', 'MESSAGE', 'SYSTEM'],
	NotificationStatus: ['WAIT', 'READ'],
	NotificationGroup: ['PROPERTY', 'PRODUCT', 'ARTICLE', 'MEMBER', 'ORDER', 'EVENT', 'MESSAGE'],
	CommentStatus: ['ACTIVE', 'DELETE'],
	CommentGroup: ['MEMBER', 'ARTICLE', 'PROPERTY', 'PRODUCT'],
	ProductSort: [
		'NEWEST',
		'PRICE_LOW_TO_HIGH',
		'PRICE_HIGH_TO_LOW',
		'MOST_VIEWED',
		'MOST_FAVORITED',
		'BEST_SELLING',
		'TRENDING',
		'DISCOUNT',
	],
	Direction: ['ASC', 'DESC'],
	NotificationFilter: ['ALL', 'UNREAD', 'READ'],
} as const;
export type MarketplaceRecord = Record<string, any>;

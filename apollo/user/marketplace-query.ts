import { gql } from '@apollo/client';

export const sayHello = gql`
	query sayHello {
		sayHello
	}
`;

export const getCoupons = gql`
	query getCoupons($input: PageInquiry!) {
		getCoupons(input: $input) {
			list {
				_id
				code
				discountType
				discountValue
				minimumOrder
				maximumDiscount
				usageLimit
				usedCount
				startAt
				endAt
				status
				createdBy
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const validateCoupon = gql`
	query validateCoupon($code: String!) {
		validateCoupon(code: $code) {
			discount
			total
		}
	}
`;

export const getMyCart = gql`
	query getMyCart {
		getMyCart {
			_id
			memberId
			items {
				_id
				productId
				variantId
				color
				size
				quantity
				unitPrice
				lineTotal
				available
				product {
					_id
					productName
					productDesc
					productPrice
					productImages
					productType
					productCategory
					productCollection
					productBrandId
					productDiscount
					material
					careInstructions
					deliveryReturnInfo
					productSellerId
					productStatus
					productVariants {
						_id
						color
						size
						stock
						sku
					}
					productViews
					productFavorites
					productComments
					productReviews
					productSales
					averageRating
					productRank
					finalPrice
					productOldPrice
					badges
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					createdAt
					updatedAt
				}
			}
			subtotal
			updatedAt
		}
	}
`;

export const getProducts = gql`
	query getProducts($input: ProductsInquiry!) {
		getProducts(input: $input) {
			list {
				_id
				productName
				productDesc
				productPrice
				productImages
				productType
				productCategory
				productCollection
				productBrandId
				productDiscount
				material
				careInstructions
				deliveryReturnInfo
				productSellerId
				productStatus
				productVariants {
					_id
					color
					size
					stock
					sku
				}
				productViews
				productFavorites
				productComments
				productReviews
				productSales
				averageRating
				productRank
				finalPrice
				productOldPrice
				badges
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getProduct = gql`
	query getProduct($productId: String!) {
		getProduct(productId: $productId) {
			_id
			productName
			productDesc
			productPrice
			productImages
			productType
			productCategory
			productCollection
			productBrandId
			productDiscount
			material
			careInstructions
			deliveryReturnInfo
			productSellerId
			productStatus
			productVariants {
				_id
				color
				size
				stock
				sku
			}
			productViews
			productFavorites
			productComments
			productReviews
			productSales
			averageRating
			productRank
			finalPrice
			productOldPrice
			badges
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			createdAt
			updatedAt
		}
	}
`;

export const getRelatedProducts = gql`
	query getRelatedProducts($productId: String!, $input: ProductsInquiry!) {
		getRelatedProducts(productId: $productId, input: $input) {
			list {
				_id
				productName
				productDesc
				productPrice
				productImages
				productType
				productCategory
				productCollection
				productBrandId
				productDiscount
				material
				careInstructions
				deliveryReturnInfo
				productSellerId
				productStatus
				productVariants {
					_id
					color
					size
					stock
					sku
				}
				productViews
				productFavorites
				productComments
				productReviews
				productSales
				averageRating
				productRank
				finalPrice
				productOldPrice
				badges
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getAllProductsByAdmin = gql`
	query getAllProductsByAdmin($input: ProductsInquiry!) {
		getAllProductsByAdmin(input: $input) {
			list {
				_id
				productName
				productDesc
				productPrice
				productImages
				productType
				productCategory
				productCollection
				productBrandId
				productDiscount
				material
				careInstructions
				deliveryReturnInfo
				productSellerId
				productStatus
				productVariants {
					_id
					color
					size
					stock
					sku
				}
				productViews
				productFavorites
				productComments
				productReviews
				productSales
				averageRating
				productRank
				finalPrice
				productOldPrice
				badges
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getMyProducts = gql`
	query getMyProducts($input: ProductsInquiry!) {
		getMyProducts(input: $input) {
			list {
				_id
				productName
				productDesc
				productPrice
				productImages
				productType
				productCategory
				productCollection
				productBrandId
				productDiscount
				material
				careInstructions
				deliveryReturnInfo
				productSellerId
				productStatus
				productVariants {
					_id
					color
					size
					stock
					sku
				}
				productViews
				productFavorites
				productComments
				productReviews
				productSales
				averageRating
				productRank
				finalPrice
				productOldPrice
				badges
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getMyFavoriteProducts = gql`
	query getMyFavoriteProducts($input: PageInquiry!) {
		getMyFavoriteProducts(input: $input) {
			list {
				_id
				productName
				productDesc
				productPrice
				productImages
				productType
				productCategory
				productCollection
				productBrandId
				productDiscount
				material
				careInstructions
				deliveryReturnInfo
				productSellerId
				productStatus
				productVariants {
					_id
					color
					size
					stock
					sku
				}
				productViews
				productFavorites
				productComments
				productReviews
				productSales
				averageRating
				productRank
				finalPrice
				productOldPrice
				badges
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getMyLikedArticles = gql`
	query getMyLikedArticles($input: PageInquiry!) {
		getMyLikedArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberSales
					memberReviews
					averageRating
					memberArticles
					memberFollowers
					memberFollowings
					memberLikes
					memberViews
					memberComments
					memberPoints
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getRecentlyVisitedProducts = gql`
	query getRecentlyVisitedProducts($input: PageInquiry!) {
		getRecentlyVisitedProducts(input: $input) {
			list {
				_id
				productName
				productDesc
				productPrice
				productImages
				productType
				productCategory
				productCollection
				productBrandId
				productDiscount
				material
				careInstructions
				deliveryReturnInfo
				productSellerId
				productStatus
				productVariants {
					_id
					color
					size
					stock
					sku
				}
				productViews
				productFavorites
				productComments
				productReviews
				productSales
				averageRating
				productRank
				finalPrice
				productOldPrice
				badges
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getMyAddresses = gql`
	query getMyAddresses {
		getMyAddresses {
			_id
			memberId
			recipientName
			phone
			region
			city
			district
			street
			postalCode
			instructions
			isDefault
			createdAt
		}
	}
`;

export const getMyOrders = gql`
	query getMyOrders($input: OrdersInquiry!) {
		getMyOrders(input: $input) {
			list {
				_id
				memberId
				items {
					_id
					productId
					sellerId
					productName
					productImage
					variantId
					color
					size
					quantity
					unitPrice
					discount
					finalUnitPrice
					finalItemPrice
					status
				}
				shippingAddress {
					recipientName
					phone
					region
					city
					district
					street
					postalCode
					instructions
				}
				subtotal
				productDiscount
				couponDiscount
				deliveryFee
				total
				status
				paymentStatus
				paymentId
				deliveryId
				couponId
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getOrder = gql`
	query getOrder($orderId: String!) {
		getOrder(orderId: $orderId) {
			_id
			memberId
			items {
				_id
				productId
				sellerId
				productName
				productImage
				variantId
				color
				size
				quantity
				unitPrice
				discount
				finalUnitPrice
				finalItemPrice
				status
			}
			shippingAddress {
				recipientName
				phone
				region
				city
				district
				street
				postalCode
				instructions
			}
			subtotal
			productDiscount
			couponDiscount
			deliveryFee
			total
			status
			paymentStatus
			paymentId
			deliveryId
			couponId
			createdAt
			updatedAt
		}
	}
`;

export const getSellerOrders = gql`
	query getSellerOrders($input: OrdersInquiry!) {
		getSellerOrders(input: $input) {
			list {
				_id
				items {
					_id
					productId
					sellerId
					productName
					productImage
					variantId
					color
					size
					quantity
					unitPrice
					discount
					finalUnitPrice
					finalItemPrice
					status
				}
				status
				paymentStatus
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getAllOrdersByAdmin = gql`
	query getAllOrdersByAdmin($input: OrdersInquiry!) {
		getAllOrdersByAdmin(input: $input) {
			list {
				_id
				memberId
				items {
					_id
					productId
					sellerId
					productName
					productImage
					variantId
					color
					size
					quantity
					unitPrice
					discount
					finalUnitPrice
					finalItemPrice
					status
				}
				shippingAddress {
					recipientName
					phone
					region
					city
					district
					street
					postalCode
					instructions
				}
				subtotal
				productDiscount
				couponDiscount
				deliveryFee
				total
				status
				paymentStatus
				paymentId
				deliveryId
				couponId
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getPayment = gql`
	query getPayment($paymentId: String!) {
		getPayment(paymentId: $paymentId) {
			_id
			orderId
			memberId
			amount
			status
			paidAt
			createdAt
		}
	}
`;

export const getPaymentsByAdmin = gql`
	query getPaymentsByAdmin($input: OrdersInquiry!) {
		getPaymentsByAdmin(input: $input) {
			list {
				_id
				orderId
				memberId
				amount
				status
				paidAt
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getDelivery = gql`
	query getDelivery($deliveryId: String!) {
		getDelivery(deliveryId: $deliveryId) {
			_id
			orderId
			status
			shippingAddress {
				recipientName
				phone
				region
				city
				district
				street
				postalCode
				instructions
			}
			trackingCode
			shippedAt
			deliveredAt
			createdAt
		}
	}
`;

export const getDeliveries = gql`
	query getDeliveries($input: OrdersInquiry!) {
		getDeliveries(input: $input) {
			list {
				_id
				orderId
				status
				shippingAddress {
					recipientName
					phone
					region
					city
					district
					street
					postalCode
					instructions
				}
				trackingCode
				shippedAt
				deliveredAt
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getReviews = gql`
	query getReviews($group: ReviewGroup!, $targetId: String!, $input: PageInquiry!) {
		getReviews(group: $group, targetId: $targetId, input: $input) {
			list {
				_id
				group
				targetId
				orderId
				authorId
				rating
				text
				status
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getReviewsByAdmin = gql`
	query getReviewsByAdmin($group: ReviewGroup!, $targetId: String!, $input: PageInquiry!) {
		getReviewsByAdmin(group: $group, targetId: $targetId, input: $input) {
			list {
				_id
				group
				targetId
				orderId
				authorId
				rating
				text
				status
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getMyMessages = gql`
	query getMyMessages($input: PageInquiry!, $peerId: String) {
		getMyMessages(input: $input, peerId: $peerId) {
			list {
				_id
				senderId
				receiverId
				productId
				text
				isRead
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getEvent = gql`
	query getEvent($id: String!) {
		getEvent(id: $id) {
			_id
			title
			description
			images
			eventType
			startAt
			endAt
			status
			createdAt
			updatedAt
		}
	}
`;

export const getEvents = gql`
	query getEvents($input: PageInquiry!, $text: String) {
		getEvents(input: $input, text: $text) {
			list {
				_id
				title
				description
				images
				eventType
				startAt
				endAt
				status
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getEventsByAdmin = gql`
	query getEventsByAdmin($input: PageInquiry!) {
		getEventsByAdmin(input: $input) {
			list {
				_id
				title
				description
				images
				eventType
				startAt
				endAt
				status
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getFAQ = gql`
	query getFAQ($id: String!) {
		getFAQ(id: $id) {
			_id
			question
			answer
			category
			sortOrder
			status
			createdAt
			updatedAt
		}
	}
`;

export const getFAQs = gql`
	query getFAQs($input: PageInquiry!, $text: String, $category: FAQCategory) {
		getFAQs(input: $input, text: $text, category: $category) {
			list {
				_id
				question
				answer
				category
				sortOrder
				status
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getFAQsByAdmin = gql`
	query getFAQsByAdmin($input: PageInquiry!) {
		getFAQsByAdmin(input: $input) {
			list {
				_id
				question
				answer
				category
				sortOrder
				status
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getMySupportTickets = gql`
	query getMySupportTickets($input: PageInquiry!) {
		getMySupportTickets(input: $input) {
			list {
				_id
				creatorId
				subject
				message
				category
				relatedOrderId
				status
				assignedCS
				replies {
					authorId
					text
					createdAt
				}
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getSupportTicket = gql`
	query getSupportTicket($ticketId: String!) {
		getSupportTicket(ticketId: $ticketId) {
			_id
			creatorId
			subject
			message
			category
			relatedOrderId
			status
			assignedCS
			replies {
				authorId
				text
				createdAt
			}
			createdAt
			updatedAt
		}
	}
`;

export const getSupportQueue = gql`
	query getSupportQueue($input: PageInquiry!) {
		getSupportQueue(input: $input) {
			list {
				_id
				subject
				createdAt
			}
		}
	}
`;

export const getSupportOrder = gql`
	query getSupportOrder($ticketId: String!) {
		getSupportOrder(ticketId: $ticketId) {
			_id
			memberId
			items {
				_id
				productId
				sellerId
				productName
				productImage
				variantId
				color
				size
				quantity
				unitPrice
				discount
				finalUnitPrice
				finalItemPrice
				status
			}
			shippingAddress {
				recipientName
				phone
				region
				city
				district
				street
				postalCode
				instructions
			}
			subtotal
			productDiscount
			couponDiscount
			deliveryFee
			total
			status
			paymentStatus
			paymentId
			deliveryId
			couponId
			createdAt
			updatedAt
		}
	}
`;

export const getAdminDashboard = gql`
	query getAdminDashboard {
		getAdminDashboard {
			totalUsers
			totalSellers
			activeSellers
			blockedSellers
			totalProducts
			activeProducts
			totalOrders
			deliveredOrders
			pendingOrders
			revenue
			topProducts {
				_id
				productName
				productDesc
				productPrice
				productImages
				productType
				productCategory
				productCollection
				productBrandId
				productDiscount
				material
				careInstructions
				deliveryReturnInfo
				productSellerId
				productStatus
				productVariants {
					_id
					color
					size
					stock
					sku
				}
				productViews
				productFavorites
				productComments
				productReviews
				productSales
				averageRating
				productRank
				finalPrice
				productOldPrice
				badges
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				createdAt
				updatedAt
			}
			topSellers {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProducts
				memberSales
				memberReviews
				averageRating
				memberArticles
				memberFollowers
				memberFollowings
				memberLikes
				memberViews
				memberComments
				memberPoints
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			recentOrders {
				_id
				memberId
				items {
					_id
					productId
					sellerId
					productName
					productImage
					variantId
					color
					size
					quantity
					unitPrice
					discount
					finalUnitPrice
					finalItemPrice
					status
				}
				shippingAddress {
					recipientName
					phone
					region
					city
					district
					street
					postalCode
					instructions
				}
				subtotal
				productDiscount
				couponDiscount
				deliveryFee
				total
				status
				paymentStatus
				paymentId
				deliveryId
				couponId
				createdAt
				updatedAt
			}
		}
	}
`;

export const getSellerDashboard = gql`
	query getSellerDashboard {
		getSellerDashboard {
			productCount
			salesCount
			deliveredCount
			followers
			reviewCount
			averageRating
			revenue
		}
	}
`;

export const checkAuth = gql`
	query checkAuth {
		checkAuth
	}
`;

export const checkAuthRoles = gql`
	query checkAuthRoles {
		checkAuthRoles
	}
`;

export const getMember = gql`
	query getMember($memberId: String!) {
		getMember(memberId: $memberId) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProducts
			memberSales
			memberReviews
			averageRating
			memberArticles
			memberFollowers
			memberFollowings
			memberLikes
			memberViews
			memberComments
			memberPoints
			memberRank
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			meFollowed {
				followingId
				followerId
				myFollowing
			}
		}
	}
`;

export const getMe = gql`
	query getMe {
		getMe {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProducts
			memberSales
			memberReviews
			averageRating
			memberArticles
			memberFollowers
			memberFollowings
			memberLikes
			memberViews
			memberComments
			memberPoints
			memberRank
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			meFollowed {
				followingId
				followerId
				myFollowing
			}
		}
	}
`;

export const getSellers = gql`
	query getSellers($input: SellersInquiry!) {
		getSellers(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProducts
				memberSales
				memberReviews
				averageRating
				memberArticles
				memberFollowers
				memberFollowings
				memberLikes
				memberViews
				memberComments
				memberPoints
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getSeller = gql`
	query getSeller($sellerId: String!) {
		getSeller(sellerId: $sellerId) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProducts
			memberSales
			memberReviews
			averageRating
			memberArticles
			memberFollowers
			memberFollowings
			memberLikes
			memberViews
			memberComments
			memberPoints
			memberRank
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			meFollowed {
				followingId
				followerId
				myFollowing
			}
		}
	}
`;

export const getAllMemberByAdmin = gql`
	query getAllMemberByAdmin($input: MembersInquiry!) {
		getAllMemberByAdmin(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProducts
				memberSales
				memberReviews
				averageRating
				memberArticles
				memberFollowers
				memberFollowings
				memberLikes
				memberViews
				memberComments
				memberPoints
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getSellerCodes = gql`
	query getSellerCodes($input: PageInquiry!) {
		getSellerCodes(input: $input) {
			list {
				_id
				code
				status
				expiresAt
				usedBy
				usedAt
				createdBy
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getBrand = gql`
	query getBrand($id: String!) {
		getBrand(id: $id) {
			_id
			brandName
			brandImage
			brandDescription
			brandStatus
			createdAt
			updatedAt
		}
	}
`;

export const getBrands = gql`
	query getBrands($input: PageInquiry!, $text: String) {
		getBrands(input: $input, text: $text) {
			list {
				_id
				brandName
				brandImage
				brandDescription
				brandStatus
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getBrandsByAdmin = gql`
	query getBrandsByAdmin($input: PageInquiry!) {
		getBrandsByAdmin(input: $input) {
			list {
				_id
				brandName
				brandImage
				brandDescription
				brandStatus
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getMyNotifications = gql`
	query getMyNotifications($input: NotificationsInquiry!) {
		getMyNotifications(input: $input) {
			list {
				_id
				notificationType
				notificationStatus
				notificationGroup
				notificationTitle
				notificationDesc
				authorId
				receiverId
				targetId
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getUnreadNotificationCount = gql`
	query getUnreadNotificationCount {
		getUnreadNotificationCount
	}
`;

export const getBoardArticle = gql`
	query getBoardArticle($articleId: String!) {
		getBoardArticle(articleId: $articleId) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
			memberId
			createdAt
			updatedAt
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProducts
				memberSales
				memberReviews
				averageRating
				memberArticles
				memberFollowers
				memberFollowings
				memberLikes
				memberViews
				memberComments
				memberPoints
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
		}
	}
`;

export const getBoardArticles = gql`
	query getBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberSales
					memberReviews
					averageRating
					memberArticles
					memberFollowers
					memberFollowings
					memberLikes
					memberViews
					memberComments
					memberPoints
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getAllBoardArticlesByAdmin = gql`
	query getAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
		getAllBoardArticlesByAdmin(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberSales
					memberReviews
					averageRating
					memberArticles
					memberFollowers
					memberFollowings
					memberLikes
					memberViews
					memberComments
					memberPoints
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getComments = gql`
	query getComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberSales
					memberReviews
					averageRating
					memberArticles
					memberFollowers
					memberFollowings
					memberLikes
					memberViews
					memberComments
					memberPoints
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getMemberFollowings = gql`
	query getMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followingData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberSales
					memberReviews
					averageRating
					memberArticles
					memberFollowers
					memberFollowings
					memberLikes
					memberViews
					memberComments
					memberPoints
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getMemberFollowers = gql`
	query getMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberSales
					memberReviews
					averageRating
					memberArticles
					memberFollowers
					memberFollowings
					memberLikes
					memberViews
					memberComments
					memberPoints
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getMyFollowings = gql`
	query getMyFollowings($input: PageInquiry!) {
		getMyFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followingData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberSales
					memberReviews
					averageRating
					memberArticles
					memberFollowers
					memberFollowings
					memberLikes
					memberViews
					memberComments
					memberPoints
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const getSellerFollowers = gql`
	query getSellerFollowers($sellerId: String!, $input: PageInquiry!) {
		getSellerFollowers(sellerId: $sellerId, input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberSales
					memberReviews
					averageRating
					memberArticles
					memberFollowers
					memberFollowings
					memberLikes
					memberViews
					memberComments
					memberPoints
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const queryOperations = {
	sayHello,
	getCoupons,
	validateCoupon,
	getMyCart,
	getProducts,
	getProduct,
	getRelatedProducts,
	getAllProductsByAdmin,
	getMyProducts,
	getMyFavoriteProducts,
	getMyLikedArticles,
	getRecentlyVisitedProducts,
	getMyAddresses,
	getMyOrders,
	getOrder,
	getSellerOrders,
	getAllOrdersByAdmin,
	getPayment,
	getPaymentsByAdmin,
	getDelivery,
	getDeliveries,
	getReviews,
	getReviewsByAdmin,
	getMyMessages,
	getEvent,
	getEvents,
	getEventsByAdmin,
	getFAQ,
	getFAQs,
	getFAQsByAdmin,
	getMySupportTickets,
	getSupportTicket,
	getSupportQueue,
	getSupportOrder,
	getAdminDashboard,
	getSellerDashboard,
	checkAuth,
	checkAuthRoles,
	getMember,
	getMe,
	getSellers,
	getSeller,
	getAllMemberByAdmin,
	getSellerCodes,
	getBrand,
	getBrands,
	getBrandsByAdmin,
	getMyNotifications,
	getUnreadNotificationCount,
	getBoardArticle,
	getBoardArticles,
	getAllBoardArticlesByAdmin,
	getComments,
	getMemberFollowings,
	getMemberFollowers,
	getMyFollowings,
	getSellerFollowers,
};

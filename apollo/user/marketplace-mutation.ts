import { gql } from '@apollo/client';

export const createCoupon = gql`
	mutation createCoupon($input: CouponInput!) {
		createCoupon(input: $input) {
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
	}
`;

export const updateCoupon = gql`
	mutation updateCoupon($couponId: String!, $input: CouponInput!) {
		updateCoupon(couponId: $couponId, input: $input) {
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
	}
`;

export const disableCoupon = gql`
	mutation disableCoupon($couponId: String!) {
		disableCoupon(couponId: $couponId) {
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
	}
`;

export const addToCart = gql`
	mutation addToCart($input: CartItemInput!) {
		addToCart(input: $input) {
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

export const updateCartItem = gql`
	mutation updateCartItem($itemId: String!, $quantity: Int!) {
		updateCartItem(itemId: $itemId, quantity: $quantity) {
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

export const removeCartItem = gql`
	mutation removeCartItem($itemId: String!) {
		removeCartItem(itemId: $itemId) {
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

export const clearCart = gql`
	mutation clearCart {
		clearCart {
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

export const moveFavoriteToCart = gql`
	mutation moveFavoriteToCart($input: CartItemInput!) {
		moveFavoriteToCart(input: $input) {
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

export const moveCartItemToFavorite = gql`
	mutation moveCartItemToFavorite($itemId: String!) {
		moveCartItemToFavorite(itemId: $itemId) {
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

export const createProduct = gql`
	mutation createProduct($input: ProductInput!) {
		createProduct(input: $input) {
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

export const updateProduct = gql`
	mutation updateProduct($input: ProductUpdate!) {
		updateProduct(input: $input) {
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

export const changeProductStatus = gql`
	mutation changeProductStatus($productId: String!, $status: ProductStatus!) {
		changeProductStatus(productId: $productId, status: $status) {
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

export const favoriteProduct = gql`
	mutation favoriteProduct($productId: String!) {
		favoriteProduct(productId: $productId) {
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

export const clearRecentlyVisited = gql`
	mutation clearRecentlyVisited {
		clearRecentlyVisited
	}
`;

export const createAddress = gql`
	mutation createAddress($input: AddressInput!) {
		createAddress(input: $input) {
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

export const updateAddress = gql`
	mutation updateAddress($addressId: String!, $input: AddressInput!) {
		updateAddress(addressId: $addressId, input: $input) {
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

export const removeAddress = gql`
	mutation removeAddress($addressId: String!) {
		removeAddress(addressId: $addressId)
	}
`;

export const setDefaultAddress = gql`
	mutation setDefaultAddress($addressId: String!) {
		setDefaultAddress(addressId: $addressId) {
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

export const createOrder = gql`
	mutation createOrder($input: CheckoutInput!) {
		createOrder(input: $input) {
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

export const cancelOrder = gql`
	mutation cancelOrder($orderId: String!) {
		cancelOrder(orderId: $orderId) {
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

export const buyAgain = gql`
	mutation buyAgain($orderId: String!) {
		buyAgain(orderId: $orderId) {
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

export const updateSellerOrderItemStatus = gql`
	mutation updateSellerOrderItemStatus($orderId: String!, $itemId: String!, $status: OrderStatus!) {
		updateSellerOrderItemStatus(orderId: $orderId, itemId: $itemId, status: $status) {
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
	}
`;

export const updateOrderStatusByAdmin = gql`
	mutation updateOrderStatusByAdmin($orderId: String!, $status: OrderStatus!) {
		updateOrderStatusByAdmin(orderId: $orderId, status: $status) {
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

export const payOrderDemo = gql`
	mutation payOrderDemo($paymentId: String!) {
		payOrderDemo(paymentId: $paymentId) {
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

export const failPaymentDemo = gql`
	mutation failPaymentDemo($paymentId: String!) {
		failPaymentDemo(paymentId: $paymentId) {
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

export const updateDeliveryStatus = gql`
	mutation updateDeliveryStatus($orderId: String!, $status: OrderStatus!, $trackingCode: String) {
		updateDeliveryStatus(orderId: $orderId, status: $status, trackingCode: $trackingCode) {
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

export const createReview = gql`
	mutation createReview($input: ReviewInput!) {
		createReview(input: $input) {
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
	}
`;

export const removeReviewByAdmin = gql`
	mutation removeReviewByAdmin($reviewId: String!) {
		removeReviewByAdmin(reviewId: $reviewId) {
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
	}
`;

export const sendMessage = gql`
	mutation sendMessage($input: MessageInput!) {
		sendMessage(input: $input) {
			_id
			senderId
			receiverId
			productId
			text
			isRead
			createdAt
		}
	}
`;

export const markMessageRead = gql`
	mutation markMessageRead($messageId: String!) {
		markMessageRead(messageId: $messageId) {
			_id
			senderId
			receiverId
			productId
			text
			isRead
			createdAt
		}
	}
`;

export const createEvent = gql`
	mutation createEvent($input: EventInput!) {
		createEvent(input: $input) {
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

export const updateEvent = gql`
	mutation updateEvent($id: String!, $input: EventInput!) {
		updateEvent(id: $id, input: $input) {
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

export const removeEvent = gql`
	mutation removeEvent($id: String!) {
		removeEvent(id: $id) {
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

export const createFAQ = gql`
	mutation createFAQ($input: FAQInput!) {
		createFAQ(input: $input) {
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

export const updateFAQ = gql`
	mutation updateFAQ($id: String!, $input: FAQInput!) {
		updateFAQ(id: $id, input: $input) {
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

export const removeFAQ = gql`
	mutation removeFAQ($id: String!) {
		removeFAQ(id: $id) {
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

export const createSupportTicket = gql`
	mutation createSupportTicket($input: SupportInput!) {
		createSupportTicket(input: $input) {
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

export const replySupportTicket = gql`
	mutation replySupportTicket($ticketId: String!, $text: String!) {
		replySupportTicket(ticketId: $ticketId, text: $text) {
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

export const assignSupportTicket = gql`
	mutation assignSupportTicket($ticketId: String!, $csId: String!) {
		assignSupportTicket(ticketId: $ticketId, csId: $csId) {
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

export const claimSupportTicket = gql`
	mutation claimSupportTicket($ticketId: String!) {
		claimSupportTicket(ticketId: $ticketId) {
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

export const updateSupportTicketStatus = gql`
	mutation updateSupportTicketStatus($ticketId: String!, $status: SupportStatus!) {
		updateSupportTicketStatus(ticketId: $ticketId, status: $status) {
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

export const signup = gql`
	mutation signup($input: MemberInput!) {
		signup(input: $input) {
			accessToken
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

export const login = gql`
	mutation login($input: LoginInput!) {
		login(input: $input) {
			accessToken
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

export const updateMember = gql`
	mutation updateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
			accessToken
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

export const logout = gql`
	mutation logout {
		logout
	}
`;

export const likeTargetMember = gql`
	mutation likeTargetMember($memberId: String!) {
		likeTargetMember(memberId: $memberId) {
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

export const updateMemberByAdmin = gql`
	mutation updateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
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

export const imageUploader = gql`
	mutation imageUploader($file: Upload!, $target: String!) {
		imageUploader(file: $file, target: $target)
	}
`;

export const imagesUploader = gql`
	mutation imagesUploader($files: [Upload!]!, $target: String!) {
		imagesUploader(files: $files, target: $target)
	}
`;

export const createSellerCode = gql`
	mutation createSellerCode($input: SellerCodeInput!) {
		createSellerCode(input: $input) {
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
	}
`;

export const revokeSellerCode = gql`
	mutation revokeSellerCode($codeId: String!) {
		revokeSellerCode(codeId: $codeId) {
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
	}
`;

export const createBrand = gql`
	mutation createBrand($input: BrandInput!) {
		createBrand(input: $input) {
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

export const updateBrand = gql`
	mutation updateBrand($id: String!, $input: BrandInput!) {
		updateBrand(id: $id, input: $input) {
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

export const removeBrand = gql`
	mutation removeBrand($id: String!) {
		removeBrand(id: $id) {
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

export const markNotificationRead = gql`
	mutation markNotificationRead($notificationId: String!) {
		markNotificationRead(notificationId: $notificationId) {
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
	}
`;

export const markAllNotificationsRead = gql`
	mutation markAllNotificationsRead {
		markAllNotificationsRead
	}
`;

export const createSystemAnnouncement = gql`
	mutation createSystemAnnouncement($title: String!) {
		createSystemAnnouncement(title: $title)
	}
`;

export const createBoardArticle = gql`
	mutation createBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
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

export const updateBoardArticle = gql`
	mutation updateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
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

export const likeTargetBoardArticle = gql`
	mutation likeTargetBoardArticle($articleId: String!) {
		likeTargetBoardArticle(articleId: $articleId) {
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

export const updateBoardArticleByAdmin = gql`
	mutation updateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
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

export const removeBoardArticleByAdmin = gql`
	mutation removeBoardArticleByAdmin($articleId: String!) {
		removeBoardArticleByAdmin(articleId: $articleId) {
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

export const createComment = gql`
	mutation createComment($input: CommentInput!) {
		createComment(input: $input) {
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
	}
`;

export const updateComment = gql`
	mutation updateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
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
	}
`;

export const removeCommentByAdmin = gql`
	mutation removeCommentByAdmin($commentId: String!) {
		removeCommentByAdmin(commentId: $commentId) {
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
	}
`;

export const subscribe = gql`
	mutation subscribe($input: String!) {
		subscribe(input: $input) {
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
	}
`;

export const unsubscribe = gql`
	mutation unsubscribe($input: String!) {
		unsubscribe(input: $input) {
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
	}
`;

export const mutationOperations = {
	createCoupon,
	updateCoupon,
	disableCoupon,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
	moveFavoriteToCart,
	moveCartItemToFavorite,
	createProduct,
	updateProduct,
	changeProductStatus,
	favoriteProduct,
	clearRecentlyVisited,
	createAddress,
	updateAddress,
	removeAddress,
	setDefaultAddress,
	createOrder,
	cancelOrder,
	buyAgain,
	updateSellerOrderItemStatus,
	updateOrderStatusByAdmin,
	payOrderDemo,
	failPaymentDemo,
	updateDeliveryStatus,
	createReview,
	removeReviewByAdmin,
	sendMessage,
	markMessageRead,
	createEvent,
	updateEvent,
	removeEvent,
	createFAQ,
	updateFAQ,
	removeFAQ,
	createSupportTicket,
	replySupportTicket,
	assignSupportTicket,
	claimSupportTicket,
	updateSupportTicketStatus,
	signup,
	login,
	updateMember,
	logout,
	likeTargetMember,
	updateMemberByAdmin,
	imageUploader,
	imagesUploader,
	createSellerCode,
	revokeSellerCode,
	createBrand,
	updateBrand,
	removeBrand,
	markNotificationRead,
	markAllNotificationsRead,
	createSystemAnnouncement,
	createBoardArticle,
	updateBoardArticle,
	likeTargetBoardArticle,
	updateBoardArticleByAdmin,
	removeBoardArticleByAdmin,
	createComment,
	updateComment,
	removeCommentByAdmin,
	subscribe,
	unsubscribe,
};

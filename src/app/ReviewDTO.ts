export interface ReviewDTO {
  id?: number;
  starRating: number;
  reviewText: string;
  sentiment: string;
  reviewDate?: Date;
  productId: number;
  productName?: string;
  userId: number;
  username?: string;
  avatarUrl?: string;
  sellerReply?: string;
  reviewAnswerTimestamp?: Date;
}

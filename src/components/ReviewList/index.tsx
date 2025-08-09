import { useTranslation } from 'react-i18next';
import type { Review } from '../../types';
import StarRating from '../StarRating';

interface Props {
  reviews: Review[];
}

export default function ReviewList({ reviews }: Props) {
  const { i18n, t } = useTranslation();
  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-400">{t('reviews_none')}</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <p className="font-semibold text-white mr-4">{review.username}</p>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="text-gray-300 mb-2">{review.comment}</p>
          <p className="text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleDateString(i18n.language)}
          </p>
        </div>
      ))}
    </div>
  );
}
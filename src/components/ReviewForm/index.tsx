import { useState } from 'react';
import StarRating from '../StarRating';
import { useTranslation } from 'react-i18next';

interface Props {
    onSubmit: (rating: number, comment: string) => void;
    isLoading: boolean;
}

export default function ReviewForm({ onSubmit, isLoading }: Props) {
    const { t } = useTranslation();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert(t('review_form_rating_alert'));
            return;
        }
        onSubmit(rating, comment);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Оставить свой отзыв</h3>
            <div className="mb-2">
                <StarRating rating={rating} onRatingChange={setRating} />
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ваш комментарий..."
                className="w-full p-2 rounded bg-gray-600 text-white min-h-[100px] mb-2"
            />
            <button
                type="submit"
                disabled={isLoading || rating === 0}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
            >
                {isLoading ? "Отправка..." : "Отправить"}
            </button>
        </form>
    );
}
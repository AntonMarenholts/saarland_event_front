import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import {
  fetchEventById,
  setReminder,
  fetchReviewsByEventId,
  createReview,
} from "../../api";

import type { Event, Review } from "../../types";
import AuthService from "../../services/auth.service";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import StarRating from "../../components/StarRating";
import ReviewList from "../../components/ReviewList";
import ReviewForm from "../../components/ReviewForm";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentUser = AuthService.getCurrentUser();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTime, setReminderTime] = useState(1);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setIsLoading(true);

        const [eventData, reviewsData] = await Promise.all([
          fetchEventById(id),
          fetchReviewsByEventId(Number(id)),
        ]);

        setEvent(eventData);
        setReviews(reviewsData);

        if (reviewsData.length > 0) {
          const totalRating = reviewsData.reduce(
            (acc, review) => acc + review.rating,
            0
          );
          setAvgRating(totalRating / reviewsData.length);
        }
      } catch {
        setError(t("errorLoadEvents"));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, t]);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!event) return;
    setIsReviewLoading(true);
    try {
      const newReview = await createReview(event.id, { rating, comment });
      setReviews([newReview, ...reviews]);
    } catch (err: unknown) {
      let errorMessage = "Failed to send feedback.";

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
      ) {
        errorMessage = (err as { response: { data: { message: string } } })
          .response.data.message;
      }
      alert(`Error: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleSetReminder = async () => {
    if (!currentUser || !event) return;
    const eventDate = new Date(event.eventDate);
    const remindAtDate = new Date(
      eventDate.getTime() - reminderTime * 60 * 60 * 1000
    );
    try {
      await setReminder(currentUser.id, event.id, remindAtDate.toISOString());
      alert(
        `${t("reminder_set_alert")} ${remindAtDate.toLocaleString(
          i18n.language
        )}`
      );
      setShowReminderModal(false);
    } catch (err) {
      alert(t("reminder_error_alert"));
      console.error(err);
    }
  };

  if (isLoading)
    return <div className="text-white text-center">{t("loading")}</div>;
  if (error || !event)
    return (
      <div className="text-red-500 text-center">
        {error || t("event_not_found")}
      </div>
    );

  const translation =
    event.translations.find((tr) => tr.locale === i18n.language) ||
    event.translations.find((tr) => tr.locale === "de");

  const eventDateObject = new Date(event.eventDate);
  const timeIsSpecified =
    eventDateObject.getUTCHours() !== 0 ||
    eventDateObject.getUTCMinutes() !== 0;
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  if (timeIsSpecified) {
    dateOptions.hour = "2-digit";
    dateOptions.minute = "2-digit";
  }
  const formattedDate = eventDateObject.toLocaleString(
    i18n.language,
    dateOptions
  );

  const isEventPast = new Date(event.eventDate) < new Date();
  const hasUserReviewed = reviews.some(
    (review) => review.userId === currentUser?.id
  );
  const canUserReview = isEventPast && currentUser && !hasUserReviewed;

  return (
    <div className="text-white w-full max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
      >
        &larr; {t("backToList")}
      </button>

      <article className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-8">
        <img
          src={event.imageUrl || "https://via.placeholder.com/800x400"}
          alt={translation?.name}
          className="w-full h-64 md:h-96 object-contain"
        />
        <div className="p-4 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              {translation?.name}
            </h1>
            {avgRating > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <StarRating rating={avgRating} size="md" />
                <span className="text-gray-400 text-sm">
                  ({reviews.length})
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row flex-wrap gap-x-8 gap-y-2 text-gray-400 mb-6 border-b border-gray-700 pb-4">
            <p>
              <strong>{t("city_label")}:</strong> {event.city.name}
            </p>
            <p>
              <strong>{t("category_label")}:</strong>
              <Link
                to={`/category/${event.category.name}`}
                className="text-cyan-400 hover:underline ml-1"
              >
                {event.category.name}
              </Link>
            </p>
            <p>
              <strong>{t("date_label")}:</strong> {formattedDate}{" "}
              
            </p>
          </div>
          {currentUser && (
            <button
              onClick={() => setShowReminderModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg mb-6"
            >
              ⏰ {t("remind_button")}
            </button>
          )}
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold">{t("description_label")}</h2>
            <p>{translation?.description}</p>
          </div>
        </div>
      </article>

      {event.city.latitude && event.city.longitude && (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg p-4 md:p-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("location_map_title")}
          </h2>
          <MapContainer
            center={[event.city.latitude, event.city.longitude]}
            zoom={14}
            scrollWheelZoom={false}
            className="h-96 w-full rounded-md"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[event.city.latitude, event.city.longitude]}>
              <Popup>
                {translation?.name} <br /> {event.city.name}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-lg p-4 md:p-8 mt-8">
        <h2 className="text-2xl font-semibold mb-4">{t("reviews_title")}</h2>
        {canUserReview && (
          <div className="mb-8">
            <ReviewForm
              onSubmit={handleReviewSubmit}
              isLoading={isReviewLoading}
            />
          </div>
        )}
        <ReviewList reviews={reviews} />
      </div>

      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-white">
            <h2 className="text-2xl mb-4">{t("reminder_modal_title")}</h2>
            <p className="mb-4">{t("reminder_modal_question")}</p>
            <select
              value={reminderTime}
              onChange={(e) => setReminderTime(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-700 text-white mb-6"
            >
              <option value={1}>{t("reminder_option_1h")}</option>
              <option value={3}>{t("reminder_option_3h")}</option>
              <option value={24}>{t("reminder_option_1d")}</option>
              <option value={72}>{t("reminder_option_3d")}</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
              >
                {t("cancel_button")}
              </button>
              <button
                onClick={handleSetReminder}
                className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700"
              >
                {t("set_button")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

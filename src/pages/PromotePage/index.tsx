import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchEventById, createPaymentSession } from "../../api";
import type { Event } from "../../types";
import { useAuth } from "../../hooks/useAuth";

const pricingTiers = [
  { days: 3, price: 10, popular: false },
  { days: 7, price: 20, popular: true },
  { days: 14, price: 30, popular: false },
  { days: 30, price: 50, popular: false },
];

export default function PromotePage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [selectedTier, setSelectedTier] = useState(pricingTiers[1]);

  useEffect(() => {
    if (id) {
      fetchEventById(id)
        .then(setEvent)
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handlePayment = async () => {
    if (!id || !user) return;
    setIsRedirecting(true);
    try {
      const response = await createPaymentSession(
        Number(id),
        selectedTier.days,
        user.id
      );
      window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error("Failed to create payment session:", error);
      alert(t("payment_error_alert"));
      setIsRedirecting(false);
    }
  };

  if (isLoading) {
    return <div className="text-white text-center">{t("loading")}</div>;
  }

  if (!event) {
    return <div className="text-white text-center">{t("event_not_found")}</div>;
  }

  const translation =
    event.translations.find((tr) => tr.locale === i18n.language) ||
    event.translations[0];

  if (event.isPremium && event.premiumUntil) {
    const formattedDate = new Date(event.premiumUntil).toLocaleDateString(
      i18n.language
    );
    return (
      <div className="max-w-4xl mx-auto text-white text-center">
        <Link
          to="/profile"
          className="text-cyan-400 hover:underline mb-6 block"
        >
          &larr; {t("back_to_profile")}
        </Link>
        <div className="bg-gray-800 p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-4">"{translation.name}"</h1>
          <p className="text-xl text-green-400">
            {t("promote_page.already_promoted", { date: formattedDate })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-white">
      <Link to="/profile" className="text-cyan-400 hover:underline mb-6 block">
        &larr; {t("back_to_profile")}
      </Link>
      <h1 className="text-4xl font-bold text-center mb-4">
        {t("promote_page_title")}
      </h1>
      <p className="text-xl text-gray-400 text-center mb-2">
        {t("promote_page_subtitle")}
      </p>
      <p className="text-2xl text-cyan-400 font-bold text-center mb-12">
        "{translation.name}"
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pricingTiers.map((tier) => (
          <div
            key={tier.days}
            onClick={() => setSelectedTier(tier)}
            className={`relative p-8 border-2 rounded-lg cursor-pointer transition-all ${
              selectedTier.days === tier.days
                ? "border-cyan-500 scale-105 bg-gray-800"
                : "border-gray-700 bg-gray-900"
            }`}
          >
            {tier.popular && (
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-cyan-500 text-white">
                  {t("popular_choice")}
                </span>
              </div>
            )}
            <h3 className="text-2xl font-semibold text-center">
              {t("days_count", { count: tier.days, ns: "translation" })}
            </h3>
            <p className="text-5xl font-bold text-center my-4">€{tier.price}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={handlePayment}
          disabled={isRedirecting}
          className="bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 px-12 rounded-lg text-xl transition disabled:bg-gray-500"
        >
          {isRedirecting
            ? t("redirecting_to_payment")
            : t("pay_and_promote_button", { price: selectedTier.price })}
        </button>
      </div>
    </div>
  );
}

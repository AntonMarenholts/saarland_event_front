import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";

export default function RulesPage() {
  const { t } = useTranslation();

  return (
    <div className="text-white max-w-4xl mx-auto">
      <Link to="/" className="text-cyan-400 hover:underline mb-8 block">
        &larr; {t("backToList")}
      </Link>

      <div className="bg-gray-800 rounded-lg p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center">
          {t("rules_page.title")}
        </h1>

        
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">
            {t("rules_page.sections.submission.title")}
          </h2>
          <div className="prose prose-invert max-w-none text-gray-300 space-y-4">
            <p>{t("rules_page.sections.submission.p1")}</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>{t("rules_page.sections.submission.step1")}</li>
              <li>{t("rules_page.sections.submission.step2")}</li>
              <li>{t("rules_page.sections.submission.step3")}</li>
            </ol>
          </div>
        </section>

        
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">
            {t("rules_page.sections.moderation.title")}
          </h2>
          <div className="prose prose-invert max-w-none text-gray-300 space-y-4">
            <p>{t("rules_page.sections.moderation.p1")}</p>
            <h3 className="text-xl font-semibold">
              {t("rules_page.sections.moderation.allowed_title")}
            </h3>
            <ul className="list-disc list-inside">
              <li>{t("rules_page.sections.moderation.allowed_item1")}</li>
              <li>{t("rules_page.sections.moderation.allowed_item2")}</li>
              <li>{t("rules_page.sections.moderation.allowed_item3")}</li>
            </ul>
            <h3 className="text-xl font-semibold">
              {t("rules_page.sections.moderation.forbidden_title")}
            </h3>
            <ul className="list-disc list-inside">
              <li>{t("rules_page.sections.moderation.forbidden_item1")}</li>
              <li>{t("rules_page.sections.moderation.forbidden_item2")}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-cyan-500 pb-2">
            {t("rules_page.sections.promotion.title")}
          </h2>
          <div className="prose prose-invert max-w-none text-gray-300 space-y-4">
            <p>
              <Trans i18nKey="rules_page.sections.promotion.p1">
                Чтобы выделить ваше событие, воспользуйтесь услугой
                "Премиум-продвижение". Оплаченные события отображаются в самом
                верху главной страницы. Услуга активируется мгновенно после
                оплаты. Управлять продвижением можно в разделе{" "}
                <Link to="/profile" className="text-cyan-400 hover:underline">
                  Мои события
                </Link>{" "}
                вашего профиля.
              </Trans>
            </p>
            <h3 className="text-xl font-semibold">
              {t("rules_page.sections.promotion.tariffs_title")}
            </h3>
            <ul className="list-disc list-inside">
              <li>
                <strong>{t("days_count", { count: 3 })}</strong> — €10
              </li>
              <li>
                <strong>{t("days_count", { count: 7 })}</strong> — €20
              </li>
              <li>
                <strong>{t("days_count", { count: 14 })}</strong> — €30
              </li>
              <li>
                <strong>{t("days_count", { count: 30 })}</strong> — €50
              </li>
            </ul>
            <p>{t("rules_page.sections.promotion.p2")}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import type { Category, City,  CreateEventData,  Event } from "../../types";
import { fetchCategories, fetchCities, translateText, } from "../../api";
import { useTranslation } from "react-i18next";

interface Props {
  onSubmit: (eventData: CreateEventData) => void;
  isLoading: boolean;
  initialData?: Event;
}

export default function EventForm({ onSubmit, isLoading, initialData }: Props) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  
  const [isTranslating, setIsTranslating] = useState(false);

  const [cityId, setCityId] = useState<number | undefined>(initialData?.city.id);
  const [eventDate, setEventDate] = useState(initialData ? new Date(initialData.eventDate).toISOString().slice(0, 16) : "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [categoryId, setCategoryId] = useState<number | undefined>(initialData?.category.id);
  
  const [nameDe, setNameDe] = useState(initialData?.translations.find(tr => tr.locale === 'de')?.name || "");
  const [descriptionDe, setDescDe] = useState(initialData?.translations.find(tr => tr.locale === 'de')?.description || "");
  const [nameEn, setNameEn] = useState(initialData?.translations.find(tr => tr.locale === 'en')?.name || "");
  const [descriptionEn, setDescEn] = useState(initialData?.translations.find(tr => tr.locale === 'en')?.description || "");
  const [nameRu, setNameRu] = useState(initialData?.translations.find(tr => tr.locale === 'ru')?.name || "");
  const [descriptionRu, setDescRu] = useState(initialData?.translations.find(tr => tr.locale === 'ru')?.description || "");

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchCities().then(setCities);
  }, []);

  const handleTranslate = async () => {
    if (!nameDe || !descriptionDe) {
      alert("Пожалуйста, сначала заполните название и описание на немецком.");
      return;
    }
    setIsTranslating(true);
    try {
      const [translatedNameEn, translatedDescEn, translatedNameRu, translatedDescRu] = await Promise.all([
        translateText(nameDe, 'en'),
        translateText(descriptionDe, 'en'),
        translateText(nameDe, 'ru'),
        translateText(descriptionDe, 'ru')
      ]);
      setNameEn(translatedNameEn);
      setDescEn(translatedDescEn);
      setNameRu(translatedNameRu);
      setDescRu(translatedDescRu);
    } catch (error) {
      alert("Произошла ошибка при переводе.");
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !cityId) {
      alert("Пожалуйста, выберите город и категорию.");
      return;
    }

    const translations = [];
    if (nameDe) translations.push({ locale: "de", name: nameDe, description: descriptionDe });
    if (nameEn) translations.push({ locale: "en", name: nameEn, description: descriptionEn });
    if (nameRu) translations.push({ locale: "ru", name: nameRu, description: descriptionRu });

    const eventData: CreateEventData = {
      eventDate: new Date(eventDate).toISOString(),
      imageUrl,
      categoryId,
      cityId,
      translations,
    };
    onSubmit(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold text-white">{initialData ? t("edit") : t("addNewEvent")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className="p-2 rounded bg-gray-700 text-white" />
        <select value={cityId || ""} onChange={(e) => setCityId(Number(e.target.value))} required className="p-2 rounded bg-gray-700 text-white">
          <option value="" disabled>Выберите город</option>
          {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
        </select>
        <select value={categoryId || ""} onChange={(e) => setCategoryId(Number(e.target.value))} required className="p-2 rounded bg-gray-700 text-white">
          <option value="" disabled>{t("selectCategory")}</option>
          {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <input type="text" placeholder={t("formImageUrl")} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white md:col-span-1" />
      </div>
      <div className="space-y-4">
        <div className="border border-gray-700 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-white font-semibold">Deutsch (DE)</label>
            <button type="button" onClick={handleTranslate} disabled={isTranslating} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md disabled:bg-gray-500">
              {isTranslating ? 'Übersetzt...' : 'Alles übersetzen'}
            </button>
          </div>
          <input type="text" placeholder={t('formTitleDE')} value={nameDe} onChange={(e) => setNameDe(e.target.value)} required className="w-full p-2 rounded bg-gray-700 text-white mb-2" />
          <textarea placeholder={t('formDescriptionDE')} value={descriptionDe} onChange={(e) => setDescDe(e.target.value)} required className="w-full p-2 rounded bg-gray-700 text-white" />
        </div>
        <div className="border border-gray-700 p-4 rounded-md">
          <label className="block text-white font-semibold mb-2">English (EN)</label>
          <input type="text" placeholder="Name (EN)" value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white mb-2" />
          <textarea placeholder="Description (EN)" value={descriptionEn} onChange={(e) => setDescEn(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" />
        </div>
        <div className="border border-gray-700 p-4 rounded-md">
          <label className="block text-white font-semibold mb-2">Русский (RU)</label>
          <input type="text" placeholder="Название (RU)" value={nameRu} onChange={(e) => setNameRu(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white mb-2" />
          <textarea placeholder="Описание (RU)" value={descriptionRu} onChange={(e) => setDescRu(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" />
        </div>
      </div>
      <button type="submit" disabled={isLoading || isTranslating} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-500">
        {isLoading ? t('saving') : (initialData ? t('save') : t('add'))}
      </button>
    </form>
  );
}
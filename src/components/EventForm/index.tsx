import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchCategories,
  fetchCities,
  translateText,
  uploadImage,
} from "../../api";
import type { Category, City, CreateEventData, Event } from "../../types";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [specifyTime, setSpecifyTime] = useState(true);
  const [isRange, setIsRange] = useState(false);

  const [eventDate, setEventDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [cityId, setCityId] = useState<number | undefined>(
    initialData?.city.id
  );
  const [categoryId, setCategoryId] = useState<number | undefined>(
    initialData?.category.id
  );
  const [nameDe, setNameDe] = useState(
    initialData?.translations.find((tr) => tr.locale === "de")?.name || ""
  );
  const [descriptionDe, setDescDe] = useState(
    initialData?.translations.find((tr) => tr.locale === "de")?.description ||
      ""
  );
  const [nameEn, setNameEn] = useState(
    initialData?.translations.find((tr) => tr.locale === "en")?.name || ""
  );
  const [descriptionEn, setDescEn] = useState(
    initialData?.translations.find((tr) => tr.locale === "en")?.description ||
      ""
  );
  const [nameRu, setNameRu] = useState(
    initialData?.translations.find((tr) => tr.locale === "ru")?.name || ""
  );
  const [descriptionRu, setDescRu] = useState(
    initialData?.translations.find((tr) => tr.locale === "ru")?.description ||
      ""
  );

  useEffect(() => {
    fetchCategories().then((data) => {
      data.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(data);
    });

    fetchCities().then((data) => {
      data.sort((a, b) => a.name.localeCompare(b.name));
      setCities(data);
    });

    if (initialData) {
      const initialStartDate = new Date(initialData.eventDate);
      const timeIsSpecified =
        initialStartDate.getUTCHours() !== 0 || initialStartDate.getUTCMinutes() !== 0;
      setSpecifyTime(timeIsSpecified);

      const formatToInput = (date: Date) => {
          const tzoffset = date.getTimezoneOffset() * 60000;
          const localISOTime = new Date(date.getTime() - tzoffset)
            .toISOString()
            .slice(0, 16);
          return timeIsSpecified ? localISOTime : localISOTime.slice(0, 10);
      };

      setEventDate(formatToInput(initialStartDate));

      if (initialData.endDate && initialData.endDate !== initialData.eventDate) {
        setIsRange(true);
        setEndDate(formatToInput(new Date(initialData.endDate)));
      }
    }
  }, [initialData]);

  const handleTranslate = async () => {
    if (!nameDe || !descriptionDe) {
      alert(t("alertFillGerman"));
      return;
    }
    setIsTranslating(true);
    try {
      const [
        translatedNameEn,
        translatedDescEn,
        translatedNameRu,
        translatedDescRu,
      ] = await Promise.all([
        translateText(nameDe, "en"),
        translateText(descriptionDe, "en"),
        translateText(nameDe, "ru"),
        translateText(descriptionDe, "ru"),
      ]);
      setNameEn(translatedNameEn);
      setDescEn(translatedDescEn);
      setNameRu(translatedNameRu);
      setDescRu(translatedDescRu);
    } catch (error) {
      alert(t("alertTranslateError"));
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    } else {
      setImageFile(null);
      setFileName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !cityId) {
      alert(t("alertSelectCityAndCategory"));
      return;
    }

    let finalImageUrl = initialData?.imageUrl || "";

    if (imageFile) {
      setIsUploading(true);
      try {
        const response = await uploadImage(imageFile);
        finalImageUrl = response.imageUrl;
      } catch (error) {
        console.error("Image upload failed:", error);
        alert(t("uploadError"));
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const getIsoString = (dateStr: string) => {
        if (specifyTime) {
            return new Date(dateStr).toISOString();
        } else {
            return new Date(dateStr + "T00:00:00Z").toISOString();
        }
    }
    
    const eventData: CreateEventData = {
      eventDate: getIsoString(eventDate),
      endDate: isRange && endDate ? getIsoString(endDate) : getIsoString(eventDate),
      imageUrl: finalImageUrl,
      categoryId,
      cityId,
      translations: [
        { locale: "de", name: nameDe, description: descriptionDe },
        { locale: "en", name: nameEn, description: descriptionEn },
        { locale: "ru", name: nameRu, description: descriptionRu },
      ].filter(t => t.name)
    };
    onSubmit(eventData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 mb-8 p-6 bg-gray-800 rounded-lg"
    >
      <h2 className="text-xl font-semibold text-white">
        {initialData ? t("edit") : t("addNewEvent")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{isRange ? t("form_start_date") : t("formDate")}</label>
          <input
            type={specifyTime ? "datetime-local" : "date"}
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
            className="p-2 rounded bg-gray-700 text-white w-full"
          />
        </div>
        
        {isRange && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t("form_end_date")}</label>
            <input
              type={specifyTime ? "datetime-local" : "date"}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required={isRange}
              className="p-2 rounded bg-gray-700 text-white w-full"
            />
          </div>
        )}

        <div className="flex items-center gap-6 md:col-span-2">
            <div className="flex items-center">
                <input
                    id="specifyTime"
                    type="checkbox"
                    checked={specifyTime}
                    onChange={(e) => setSpecifyTime(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-600 text-cyan-600 focus:ring-cyan-500 bg-gray-700"
                />
                <label
                    htmlFor="specifyTime"
                    className="ml-2 block text-sm text-gray-300"
                >
                    {t("form_specify_time")}
                </label>
            </div>
            <div className="flex items-center">
                 <input
                    id="isRange"
                    type="checkbox"
                    checked={isRange}
                    onChange={(e) => setIsRange(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-600 text-cyan-600 focus:ring-cyan-500 bg-gray-700"
                />
                <label
                    htmlFor="isRange"
                    className="ml-2 block text-sm text-gray-300"
                >
                    {t("form_is_range")}
                </label>
            </div>
        </div>

        <select
          value={cityId || ""}
          onChange={(e) => setCityId(Number(e.target.value))}
          required
          className="p-2 rounded bg-gray-700 text-white"
        >
          <option value="" disabled>
            {t("selectCity")}
          </option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <select
          value={categoryId || ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          required
          className="p-2 rounded bg-gray-700 text-white"
        >
          <option value="" disabled>
            {t("selectCategory")}
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("formImageUrl")}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="imageUpload"
              className="hidden"
            />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer bg-cyan-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-cyan-700 whitespace-nowrap"
            >
              {t("selectFileButton")}
            </label>
            <span className="text-sm text-gray-400 truncate">
              {fileName || t("noFileSelected")}
            </span>
          </div>
          {initialData?.imageUrl && !imageFile && (
            <img
              src={initialData.imageUrl}
              alt="Current"
              className="mt-4 rounded-lg max-h-40"
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="border border-gray-700 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-white font-semibold">
              Deutsch (DE)
            </label>
            <button
              type="button"
              onClick={handleTranslate}
              disabled={isTranslating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md disabled:bg-gray-500"
            >
              {isTranslating ? t("translating") : t("translateAll")}
            </button>
          </div>
          <input
            type="text"
            placeholder={t("formTitleDE")}
            value={nameDe}
            onChange={(e) => setNameDe(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          />
          <textarea
            placeholder={t("formDescriptionDE")}
            value={descriptionDe}
            onChange={(e) => setDescDe(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="border border-gray-700 p-4 rounded-md">
          <label className="block text-white font-semibold mb-2">
            English (EN)
          </label>
          <input
            type="text"
            placeholder={t("formTitleEN")}
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          />
          <textarea
            placeholder={t("formDescriptionEN")}
            value={descriptionEn}
            onChange={(e) => setDescEn(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="border border-gray-700 p-4 rounded-md">
          <label className="block text-white font-semibold mb-2">
            Русский (RU)
          </label>
          <input
            type="text"
            placeholder={t("formTitleRU")}
            value={nameRu}
            onChange={(e) => setNameRu(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          />
          <textarea
            placeholder={t("formDescriptionRU")}
            value={descriptionRu}
            onChange={(e) => setDescRu(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || isTranslating || isUploading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-500"
      >
        {isUploading
          ? t("uploadingPhoto")
          : isLoading
          ? t("saving")
          : initialData
          ? t("save")
          : t("add")}
      </button>
    </form>
  );
}
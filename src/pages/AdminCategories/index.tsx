import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCategories, createCategory, deleteCategory } from "../../api";
import type { Category, CategoryData } from "../../types";

export default function AdminCategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory: CategoryData = {
      name: newName,
      description: newDescription,
    };
    try {
      await createCategory(newCategory);
      setNewName("");
      setNewDescription("");
      await loadCategories();
    } catch (error) {
      alert(t("errorCreate"));
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await deleteCategory(id);
        await loadCategories();
      } catch (error) {
        alert(t("errorDelete"));
        console.error(error);
      }
    }
  };

  if (isLoading) return <div className="text-white">{t("loading")}</div>;

  return (
    <div className="w-full text-white">
      <Link to="/admin" className="text-cyan-400 hover:underline mb-6 block">
        &larr; {t("backToAdmin")}
      </Link>
      <h1 className="text-3xl font-bold mb-6">{t("manageCategories")}</h1>

      <form
        onSubmit={handleCreate}
        className="mb-8 p-6 bg-gray-800 rounded-lg space-y-4"
      >
        <h2 className="text-xl font-semibold">{t("addNewCategory")}</h2>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={t("categoryName_placeholder")}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder={t("categoryDesc_placeholder")}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
        >
          {t("add")}
        </button>
      </form>

      <div className="bg-gray-800 rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">{t("allCategories")}</h2>
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-700 p-3 rounded gap-2"
            >
              <div>
                <p className="font-bold">{cat.name}</p>
                <p className="text-sm text-gray-400">{cat.description}</p>
              </div>
              <div className="flex gap-4 self-end sm:self-center">
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  {t("delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

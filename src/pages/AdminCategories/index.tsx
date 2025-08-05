// src/pages/AdminCategories/index.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories, createCategory, deleteCategory } from "../../api";
import type { Category, CategoryData } from "../../types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Состояния для формы создания
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Не удалось загрузить категории", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory: CategoryData = { name: newName, description: newDescription };
    try {
      await createCategory(newCategory);
      setNewName("");
      setNewDescription("");
      await loadCategories(); // Перезагружаем список
    } catch (error) {
      alert("Не удалось создать категорию. Возможно, категория с таким именем уже существует.");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить эту категорию?")) {
      try {
        await deleteCategory(id);
        await loadCategories(); // Перезагружаем список
      } catch (error) {
        alert("Не удалось удалить категорию.");
        console.error(error);
      }
    }
  };
  
  if (isLoading) return <div className="text-white">Загрузка категорий...</div>;

  return (
    <div className="w-full text-white">
      <Link to="/admin" className="text-cyan-400 hover:underline mb-6 block">&larr; Назад к панели событий</Link>
      <h1 className="text-3xl font-bold mb-6">Управление категориями</h1>

      {/* Форма для создания */}
      <form onSubmit={handleCreate} className="mb-8 p-6 bg-gray-800 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Добавить новую категорию</h2>
        <input 
          type="text" 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Название категории" 
          required 
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input 
          type="text" 
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Описание" 
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
          Добавить
        </button>
      </form>

      {/* Таблица с категориями */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Все категории</h2>
        <ul className="space-y-3">
          {categories.map(cat => (
            <li key={cat.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
              <div>
                <p className="font-bold">{cat.name}</p>
                <p className="text-sm text-gray-400">{cat.description}</p>
              </div>
              <div className="flex gap-4">
                {/* <button className="text-indigo-400 hover:text-indigo-300 text-sm">Редактировать</button> */}
                <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-400 text-sm">Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
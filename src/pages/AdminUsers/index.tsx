import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchAllUsers, deleteUser } from "../../api";
import type { User } from "../../types";

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Не удалось загрузить пользователей", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await deleteUser(id);
        await loadUsers();
      } catch {
        alert(t('errorDelete'));
      }
    }
  };

  if (isLoading) return <div className="text-white">{t('loading')}</div>;

  return (
    <div className="w-full text-white">
      <Link to="/admin" className="text-cyan-400 hover:underline mb-6 block">&larr; {t('backToAdmin')}</Link>
      <h1 className="text-3xl font-bold mb-6">{t('manage_users')}</h1>
      <div className="bg-gray-800 rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">{t('all_users')}</h2>
        <ul className="space-y-3">
          {users.map(user => (
            <li key={user.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-700 p-3 rounded gap-2">
              <div>
                <p className="font-bold">{user.username} ({user.role})</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              {user.role !== 'ROLE_ADMIN' && (
                <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-400 text-sm self-end sm:self-center">{t('delete')}</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
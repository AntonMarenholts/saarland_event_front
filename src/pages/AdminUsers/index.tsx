import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchAllUsers, deleteUser } from "../../api";
import type { User } from "../../types";
import Pagination from "../../components/Pagination";

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 50;

  const loadUsers = async (page = 0) => {
    try {
      setIsLoading(true);
      const data = await fetchAllUsers(page, pageSize);
      setUsers(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await deleteUser(id);
        if (users.length === 1 && currentPage > 0) {
          setCurrentPage(currentPage - 1);
        } else {
          loadUsers(currentPage);
        }
      } catch {
        alert(t("errorDelete"));
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) return <div className="text-white">{t("loading")}</div>;

  return (
    <div className="w-full text-white">
      <Link to="/admin" className="text-cyan-400 hover:underline mb-6 block">
        &larr; {t("backToAdmin")}
      </Link>
      <h1 className="text-3xl font-bold mb-6">{t("manage_users")}</h1>
      <div className="bg-gray-800 rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">{t("all_users")}</h2>
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-700 p-3 rounded gap-2"
            >
              <div>
                <p className="font-bold">
                  {user.username} ({user.role})
                </p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              {user.role !== "ROLE_ADMIN" && (
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500 hover:text-red-400 text-sm self-end sm:self-center"
                >
                  {t("delete")}
                </button>
              )}
            </li>
          ))}
        </ul>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
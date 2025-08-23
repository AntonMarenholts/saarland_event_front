import { useTranslation } from "react-i18next";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const { t } = useTranslation();
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center items-center text-white my-8"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-4 py-2 mx-1 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
      >
        {t("pagination_back")}
      </button>

      <div className="hidden md:flex">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-4 py-2 mx-1 rounded-md ${
              currentPage === number
                ? "bg-cyan-600 font-bold"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {number + 1}
          </button>
        ))}
      </div>
      <div className="md:hidden text-sm px-4">
        {currentPage + 1} / {totalPages}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-4 py-2 mx-1 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
      >
        {t("pagination_forward")}
      </button>
    </nav>
  );
}

import { useTranslation } from "react-i18next";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}


const getPaginationItems = (currentPage: number, totalPages: number) => {
  const delta = 2; 
  const left = currentPage - delta;
  const right = currentPage + delta + 1;
  const range = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots.map(item => typeof item === 'number' ? item - 1 : item);
};


export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const { t } = useTranslation();
  if (totalPages <= 1) {
    return null;
  }

  const paginationItems = getPaginationItems(currentPage + 1, totalPages);

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
        {paginationItems.map((page, index) => {
           if (typeof page === 'string') {
             return (
                <span key={`dots-${index}`} className="px-4 py-2 mx-1">
                    {page}
                </span>
             );
           }
           return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 mx-1 rounded-md ${
                currentPage === page
                  ? "bg-cyan-600 font-bold"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {page + 1}
            </button>
           )
        })}
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
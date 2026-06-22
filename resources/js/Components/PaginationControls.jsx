import React from "react";
import { router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

const buildQueryString = (page, params) => {
  const searchParams = new URLSearchParams({ ...params, page });
  return searchParams.toString() ? `?${searchParams.toString()}` : "";
};

const PaginationControls = ({ pagination, params = {}, currentPage = null, totalPages = null, onPageChange = null }) => {
  const { t } = useTranslation();
  const clientSide = typeof onPageChange === "function" && Number.isInteger(currentPage) && Number.isInteger(totalPages);
  const page = clientSide ? currentPage : pagination?.current_page;
  const lastPage = clientSide ? totalPages : pagination?.last_page;

  if (!page || !lastPage || lastPage <= 1) {
    return null;
  }

  const previousPage = page - 1;
  const nextPage = page + 1;

  const navigate = (pageNumber) => {
    if (clientSide) {
      onPageChange(pageNumber);
      return;
    }

    if (!pagination?.path) {
      return;
    }

    router.visit(`${pagination.path}${buildQueryString(pageNumber, params)}`);
  };

  return (
    <div className="mt-8 w-full flex flex-col items-center gap-3 pb-3">
      <div className="flex flex-wrap justify-center items-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => navigate(previousPage)}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold shadow-sm transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("pagination.previous") || "← Previous"}
        </button>

        <span className="text-gray-700 font-semibold">
          {t("pagination.page") || "Page"} {page} {t("pagination.of") || "of"} {lastPage}
        </span>

        <button
          disabled={page === lastPage}
          onClick={() => navigate(nextPage)}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold shadow-sm transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("pagination.next") || "Next →"}
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;

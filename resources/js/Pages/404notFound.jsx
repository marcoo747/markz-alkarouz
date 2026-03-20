import React from "react";
import { Link } from "@inertiajs/react";
import styles from "../../css/NotFound.module.css";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
      <div className={styles.container}>
        <div className={styles.contentBox}>
        <h1 className={styles.heading}>
        404
        </h1>

          <h2 className={styles.subHeading}>
            {t('404.title')}
          </h2>

          <p className={styles.description}>
            {t('404.description')}
          </p>

          <Link
            href={route("home")}
            className={styles.homeLink}
          >
            {t('404.go_home')}
          </Link>
        </div>

        <div className={styles.backgroundText}>
          404
        </div>
      </div>
  );
};

export default NotFoundPage;

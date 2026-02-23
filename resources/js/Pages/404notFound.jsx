import React from "react";
import { Link } from "@inertiajs/react";
import styles from "../../css/NotFound.module.css";

const NotFoundPage = () => {
  return (
      <div className={styles.container}>
        <div className={styles.contentBox}>
        <h1 className={styles.heading}>
        404
        </h1>

          <h2 className={styles.subHeading}>
            Page Not Found
          </h2>

          <p className={styles.description}>
            Oops! The page you are looking for might have been removed, had its
            name changed, or is temporarily unavailable.
          </p>

          <Link
            href={route("home")}
            className={styles.homeLink}
          >
            Go to Home
          </Link>
        </div>

        <div className={styles.backgroundText}>
          404
        </div>
      </div>
  );
};

export default NotFoundPage;

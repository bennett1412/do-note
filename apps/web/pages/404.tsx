import type React from "react";
import styles from "@/styles/pages/notfound.module.scss";
import Link from "next/link";

const NotFound: React.FC = () => {
	return (
		<section className={styles.container}>
			<div className={styles.error_code}>404</div>
			<div className={styles.message}>
				<span>
					The page you are looking for doesn&apos;t exist, wanna{" "}
					<Link href={"/auth"}> login</Link>?
				</span>
			</div>
		</section>
	);
};

export default NotFound;

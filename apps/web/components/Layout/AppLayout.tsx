
import type React from "react";
import Sidebar from "../Common/Sidebar";
import styles from "./styles/layout.module.scss";

type AppLayoutProps = {
	children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
	return (
		<div className={styles.layout_container}>
			<Sidebar />
			<main className={styles.main_content}>
				{children}
			</main>
		</div>
	);
};

export default AppLayout;


import type React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiHome, FiFileText, FiSettings, FiLogOut } from "react-icons/fi";
import { useSession } from "@/hooks/useSession";
import styles from "./styles/sidebar.module.scss";
import Image from "next/image";

const Sidebar: React.FC = () => {
	const router = useRouter();
	const { user, signOut } = useSession();

	const handleLogout = () => {
		signOut();
	};

	const isActive = (path: string) => router.pathname === path;

	if (!user?.id) return null;

	return (
		<aside className={styles.sidebar}>
			

			<nav className={styles.nav_links}>
				<div className={styles.logo_container}>
				<Link href="/notes" className={styles.logo}>
					DN
				</Link>
			</div>
				<Link
					href="/notes"
					className={`${styles.nav_item} ${isActive("/notes") ? styles.active : ""}`}
				>
					<FiHome size={24} />
					<span className={styles.tooltip}>Notes</span>
				</Link>
				{/* Placeholder for Articles list or dashboard if we implement it */}
				<Link
					href="/articles"
					className={`${styles.nav_item} ${isActive("/articles") ? styles.active : ""}`}
				>
					<FiFileText size={24} />
					<span className={styles.tooltip}>Articles</span>
				</Link>
			</nav>

			<div className={styles.bottom_actions}>
				{user?.picture && (
					<div className={styles.user_profile}>
						<Image
							src={user.picture}
							alt="Profile"
							width={32}
							height={32}
							className={styles.avatar}
						/>
						
					</div>
				)}
				<button onClick={handleLogout} className={styles.logout_btn}>
					<FiLogOut size={24} />
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;

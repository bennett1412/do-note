
import type React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiHome, FiFileText, FiSettings, FiLogOut } from "react-icons/fi";
import { useSession } from "@/hooks/useSession";
import styles from "./styles/sidebar.module.scss";
// import Image from "next/image"; // Using Mantine Avatar instead
import { Stack, Tooltip, UnstyledButton, Avatar, Group, Box } from "@mantine/core";
import clsx from "clsx";

const Sidebar: React.FC = () => {
	const router = useRouter();
	const { user, signOut } = useSession();

	const handleLogout = () => {
		signOut();
	};

	const isActive = (path: string) => router.pathname === path;

	if (!user?.id) return null;

	return (
		<Stack component="aside" className={styles.sidebar} align="center" justify="space-between" py="md">
			<Stack className={styles.nav_links} gap="lg" align="center">
				<div className={styles.logo_container}>
					<Link href="/notes" className={styles.logo}>
						Dn
					</Link>
				</div>
				<Tooltip label="Notes" position="right" withArrow>
					<Link
						href="/notes"
						className={clsx(styles.nav_item, { [styles.active]: isActive("/notes") })}
					>
						<FiHome size={24} />
					</Link>
				</Tooltip>
				
				<Tooltip label="Articles" position="right" withArrow>
					<Link
						href="/articles"
						className={clsx(styles.nav_item, { [styles.active]: isActive("/articles") })}
					>
						<FiFileText size={24} />
					</Link>
				</Tooltip>
			</Stack>

			<Stack className={styles.bottom_actions} gap="md" align="center">
				{user?.picture && (
					<div className={styles.user_profile}>
						<Avatar
							src={user.picture}
							alt="Profile"
							size={32}
							radius="xl"
							className={styles.avatar}
						/>
					</div>
				)}
				<UnstyledButton onClick={handleLogout} className={styles.logout_btn}>
					<FiLogOut size={24} />
				</UnstyledButton>
			</Stack>
		</Stack>
	);
};

export default Sidebar;

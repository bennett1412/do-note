
import type React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiHome, FiFileText, FiLogOut } from "react-icons/fi";
import { useSession } from "@/hooks/useSession";
import { Stack, Tooltip, UnstyledButton, Avatar, Box } from "@mantine/core";

const Sidebar: React.FC = () => {
	const router = useRouter();
	const { user, signOut } = useSession();

	const handleLogout = () => {
		signOut();
	};

	const isActive = (path: string) => router.pathname === path;

	if (!user?.id) return null;

	return (
		<Stack
			component="aside"
			w={72}
			h="100vh"
			pos="fixed"
			left={0}
			top={0}
			bg="surface.0"
			bdR="1px solid var(--color-surface-200, #232524)"
			align="center"
			justify="space-between"
			py="md"
			style={{ zIndex: 50, transition: "width 0.3s ease" }}
		>
			<Stack gap="lg" align="center" w="100%">
				<Box py="xs">
					<Link
						href="/notes"
						style={{
							fontWeight: 700,
							fontSize: "1.5rem",
							color: "var(--color-primary-500, #f6f8f7)",
							textDecoration: "none",
						}}
					>
						Dn
					</Link>
				</Box>

				<Tooltip label="Notes" position="right" withArrow>
					<UnstyledButton
						component={Link}
						href="/notes"
						w={48}
						h={48}
						display="flex"
						style={{
							alignItems: "center",
							justifyContent: "center",
							borderRadius: "12px",
							transition: "all 0.2s ease",
						}}
						bg={isActive("/notes") ? "primary.0" : "transparent"}
						c={isActive("/notes") ? "surface.0" : "var(--text-secondary, #898a89)"}
						styles={{
							root: {
								"&:hover": {
									backgroundColor: isActive("/notes")
										? "var(--color-primary-100, #eff2f1)"
										: "var(--color-surface-200, #232524)",
									color: isActive("/notes")
										? "var(--color-surface-100, #0b0e0d)"
										: "var(--text-primary, #f8f9f9)",
								},
							},
						}}
					>
						<FiHome size={24} />
					</UnstyledButton>
				</Tooltip>

				<Tooltip label="Articles" position="right" withArrow>
					<UnstyledButton
						component={Link}
						href="/articles"
						w={48}
						h={48}
						display="flex"
						style={{
							alignItems: "center",
							justifyContent: "center",
							borderRadius: "12px",
							transition: "all 0.2s ease",
						}}
						bg={isActive("/articles") ? "primary.0" : "transparent"}
						c={isActive("/articles") ? "surface.0" : "var(--text-secondary, #898a89)"}
						styles={{
							root: {
								"&:hover": {
									backgroundColor: isActive("/articles")
										? "var(--color-primary-100, #eff2f1)"
										: "var(--color-surface-200, #232524)",
									color: isActive("/articles")
										? "var(--color-surface-100, #0b0e0d)"
										: "var(--text-primary, #f8f9f9)",
								},
							},
						}}
					>
						<FiFileText size={24} />
					</UnstyledButton>
				</Tooltip>
			</Stack>

			<Stack gap="md" align="center">
				{user?.picture && (
					<Box style={{ borderRadius: "50%" }}>
						<Avatar src={user.picture} alt="Profile" size={32} radius="xl" />
					</Box>
				)}
				<UnstyledButton
					onClick={handleLogout}
					w={48}
					h={48}
					display="flex"
					style={{
						alignItems: "center",
						justifyContent: "center",
						borderRadius: "12px",
						transition: "all 0.2s ease",
					}}
					c="var(--text-secondary, #898a89)"
					styles={{
						root: {
							"&:hover": {
								backgroundColor: "rgba(255, 0, 0, 0.1)",
								color: "#ff6b6b",
							},
						},
					}}
				>
					<FiLogOut size={24} />
				</UnstyledButton>
			</Stack>
		</Stack>
	);
};

export default Sidebar;

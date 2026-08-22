
import type React from "react";
import Sidebar from "../Common/Sidebar";
import { Box, useMatches } from "@mantine/core";

type AppLayoutProps = {
	children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
	const sidebarVisible = useMatches({
		base: false,
		sm: true,
	});
	return (
		<Box display="flex" style={{ minHeight: "100vh" }} bg="surface.0">
			<Sidebar />
			<Box
				component="main"
				style={{
					flex: 1,
					marginLeft: sidebarVisible ? 72 : 0,
					width: sidebarVisible ? "calc(100% - 72px)" : "100%",
					position: "relative",
					transition: "margin-left 0.3s ease, width 0.3s ease",
				}}
			>
				{children}
			</Box>
		</Box>
	);
};

export default AppLayout;

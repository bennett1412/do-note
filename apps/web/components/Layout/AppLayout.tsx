
import type React from "react";
import Sidebar from "../Common/Sidebar";
import { Box } from "@mantine/core";

type AppLayoutProps = {
	children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
	return (
		<Box display="flex" style={{ minHeight: "100vh" }} bg="surface.0">
			<Sidebar />
			<Box
				component="main"
				style={{
					flex: 1,
					marginLeft: 72,
					width: "calc(100% - 72px)",
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

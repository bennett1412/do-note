import { ReactNode } from "react";
import { Box } from "@mantine/core";

type BackdropProps = {
	onClick: () => void;
};

const Backdrop = ({ onClick }: BackdropProps) => {
	return (
		<Box
			onClick={onClick}
			pos="fixed"
			top={0}
			left={0}
			w="100%"
			h="100%"
			bg="rgba(0, 0, 0, 0.7)"
			style={{
				zIndex: 3,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				transition: "background 2s ease-in-out",
			}}
		/>
	);
};

export default Backdrop;
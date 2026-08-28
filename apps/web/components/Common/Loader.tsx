import { Loader } from "@mantine/core";
import React from "react";

export const OvalLoader = ({ magnify }: { magnify: string }) => {
	return (
		<Loader
			type="oval"
			size={80}
			color="var(--color-surface-500, #6d6f6e)"
			style={{
				position: "fixed",
				top: "50%",
				left: "50%",
				transform: `translate(-50%,-50%) scale(${magnify})`,
			}}
		/>
	);
};

export const DotsLoader = () => {
	return (
		<Loader
			type="dots"
			size={64}
			color="var(--color-primary-500, #f6f8f7)"
			style={{
				position: "fixed",
				left: "50%",
				top: "50%",
				transform: "translate(-50%,-50%) scale(1.5)",
			}}
		/>
	);
};
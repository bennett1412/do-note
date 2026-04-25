import type { FC } from "react";
import { Button as MantineButton, type ButtonProps as MantineButtonProps, type ElementProps } from "@mantine/core";

export interface ButtonProps extends MantineButtonProps, ElementProps<"button", keyof MantineButtonProps> {
	specialProp?: string;
}

const Button: FC<ButtonProps> = ({
	children,
	style,
	className,
	onClick,
	disabled,
	...props
}) => {
	return (
		<MantineButton
			disabled={disabled}
			style={style}
			className={className}
			onClick={onClick}
			// Default styles to match previous design if needed, or rely on theme
			variant={props.variant ?? "filled"} 
			color={props.color ?? "surface.2"} // Mapping to --color-surface-300 which was #3a3c3b
			c={props.c ?? "primary.0"}     // Mapping to --color-primary-100 which was #eff2f1
			radius={props.radius ?? "10px"}
			{...props}
		>
			{children}
		</MantineButton>
	);
};

export default Button;

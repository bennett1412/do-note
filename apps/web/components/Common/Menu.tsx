import React from "react";
import { Menu as MantineMenu, type MenuProps as MantineMenuProps, type MenuItemProps as MantineMenuItemProps, UnstyledButton } from "@mantine/core";
// import styles from "./styles/menu.module.scss"; 
// Using Mantine styles

type Direction = "bottom" | "top";
type Align = "start" | "center" | "end";

export interface MenuProps extends Omit<MantineMenuProps, "children"> {
	menuButton: React.ReactNode;
	direction?: Direction;
	align?: Align;
	children?: React.ReactNode;
}

interface KeepableMouseEvent<T = Element> extends React.MouseEvent<T, MouseEvent> {
	keepOpen?: boolean;
}

interface MenuItemProps extends MantineMenuItemProps {
	onClick?: (e: KeepableMouseEvent<HTMLButtonElement>) => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
	onClick,
	children,
	disabled,
	...props
}) => {
	const handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled) return;
		const proxy = ev as KeepableMouseEvent<HTMLButtonElement>;
		proxy.keepOpen = false;
		
		if (onClick) onClick(proxy);
		
		// Note: Mantine closes by default. If we really need to keep it open dynamically based on the event:
		// We can't easily change the prop after the click has started bubbling.
		// For now, let's rely on Mantine's closeMenuOnClick prop if the user sets it on the component usage,
		// or if we detect specific usage patterns. 
        // Ideally we'd deprecate the keepOpen event pattern in favor of closeMenuOnClick prop.
	};

	return (
		<MantineMenu.Item
			onClick={handleClick}
			disabled={disabled}
			{...props}
		>
			{children}
		</MantineMenu.Item>
	);
};

export const MenuDivider: React.FC = () => {
	return <MantineMenu.Divider />;
};

interface MenuButtonProps {
	title?: string;
	className?: string; // Mantine might handle styling via Target props or children
	children?: React.ReactNode;
}

export const MenuButton: React.ForwardRefExoticComponent<MenuButtonProps & React.RefAttributes<HTMLButtonElement>> = React.forwardRef<HTMLButtonElement, MenuButtonProps>(({ title, className, children, ...props }, ref) => {
    // MenuTarget requires a component that accepts a ref.
	return (
		<UnstyledButton ref={ref} className={className} title={title} aria-hidden={title ? undefined : "true"} {...props}>
			{children}
		</UnstyledButton>
	);
});
MenuButton.displayName = "MenuButton";

const Menu: React.FC<MenuProps> = ({
	menuButton,
	direction = "bottom",
	align = "start",
	children,
	...props
}) => {
    // Map existing direction/align to Mantine placement
    const placement: MantineMenuProps['position'] = `${direction}-${align === "center" ? "center" : align === "end" ? "end" : "start"}` as any; 
    // Simplified placement mapping:
    // Mantine uses: top, top-start, top-end, bottom, bottom-start, bottom-end, etc.
    const mantinePlacement = `${direction}${align === 'center' ? '' : align === 'start' ? '-start' : '-end'}` as const;

	return (
		<MantineMenu position={mantinePlacement} offset={8} {...props}>
			<MantineMenu.Target>
                {/* Ensure menuButton handles ref properly or use MenuButton wrapper */}
				{menuButton}
			</MantineMenu.Target>

			<MantineMenu.Dropdown>
				{children}
			</MantineMenu.Dropdown>
		</MantineMenu>
	);
};

export default Menu;

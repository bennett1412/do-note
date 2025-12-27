import React, { useState, useEffect } from "react";
import {
	useFloating,
	offset as fuOffset,
	flip,
	shift,
	autoUpdate,
	useInteractions,
	useClick,
	useDismiss,
	useRole,
	type Placement,
} from "@floating-ui/react";
import styles from "./styles/menu.module.scss";
import clsx from "clsx";

type Direction = "bottom" | "top";
type Align = "start" | "center" | "end";

interface MenuProps {
	menuButton: React.ReactNode;
	direction?: Direction;
	offsetY?: number;
	align?: Align;
	menuStyle?: React.CSSProperties;
	className?: string;
	transition?: boolean;
	children?: React.ReactNode;
}

interface KeepableMouseEvent<T = Element> extends React.MouseEvent<T, MouseEvent> {
	keepOpen?: boolean;
}

interface MenuItemProps {
	onClick?: (e: KeepableMouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	className?: string;
	children?: React.ReactNode;
}

export const MenuItem: React.FC<MenuItemProps> = ({
	onClick,
	disabled,
	className,
	children,
}) => {
	const handleClick = (ev: React.MouseEvent) => {
		if (disabled) return;
		const proxy = ev as KeepableMouseEvent<HTMLButtonElement>;
		proxy.keepOpen = proxy.keepOpen ?? false;
		if (onClick) onClick(proxy);
	};

	return (
		<button
			className={`${styles.menu_item} ${className ?? ""}`}
			role="menuitem"
			onClick={handleClick}
			disabled={disabled}
			type="button"
		>
			{children}
		</button>
	);
};

export const MenuDivider: React.FC = () => {
	return <div className={styles.menu_divider} />;
};

interface MenuButtonProps {
	title?: string;
	className?: string;
	children?: React.ReactNode;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ title, className, children }) => {
	return (
		<span className={className} title={title} aria-hidden={title ? undefined : "true"}>
			{children}
		</span>
	);
};

const Menu: React.FC<MenuProps> = ({
	menuButton,
	direction = "bottom",
	offsetY = 8,
	align = "start",
	menuStyle,
	className,
	transition,
	children,
}) => {
	const [open, setOpen] = useState(false);
	const [renderPanel, setRenderPanel] = useState(open);
	const TRANSITION_MS = 150;

	const placement = (`${direction === "bottom" ? "bottom" : "top"}${align === "start" ? "-start" : align === "end" ? "-end" : ""
		}`) as Placement;

	const { x, y, reference, floating, strategy, context } = useFloating({
		open,
		onOpenChange: setOpen,
		placement,
		middleware: [fuOffset(offsetY), flip(), shift({ padding: 8 })],
		whileElementsMounted: autoUpdate,
	});

	const { getReferenceProps, getFloatingProps } = useInteractions([
		useClick(context),
		useDismiss(context),
		useRole(context, { role: "menu" }),
	]);

	// wrapper for children clicks -- closes menu unless handler set .keepOpen
	const handleChildClick = (ev: KeepableMouseEvent) => {
		if (ev?.keepOpen) return;
		setOpen(false);
	};

	const clonedChildren = React.Children.map(children, (child) => {
		if (!React.isValidElement(child)) return child;
		const childProps = (child as React.ReactElement<Record<string, unknown>>).props;
		const orig = childProps.onClick as ((e: KeepableMouseEvent) => void) | undefined;
		const disabled = childProps.disabled as boolean | undefined;
		return React.cloneElement(child as React.ReactElement, {
			onClick: (e: React.MouseEvent) => {
				const proxy = e as KeepableMouseEvent;
				proxy.keepOpen = proxy.keepOpen ?? false;
				if (orig) orig(proxy);
				if (!proxy.keepOpen && !disabled) handleChildClick(proxy);
			},
		});
	});

	// floating-ui handles dismiss via useDismiss; no manual outside-click needed

	// manage mount/unmount for transitions
	useEffect(() => {
		if (open) {
			setRenderPanel(true);
			return;
		}
		if (!open && transition) {
			const t = setTimeout(() => setRenderPanel(false), TRANSITION_MS + 10);
			return () => clearTimeout(t);
		}
		if (!open) setRenderPanel(false);
	}, [open, transition]);

	const panelClass = `${styles.menu_panel} ${transition ? (open ? styles.panel_enter : styles.panel_exit) : ""}`;

	const userProps = React.isValidElement(menuButton) ? menuButton.props : {};
	const referenceProps = getReferenceProps({
		...userProps,
		ref: reference,
		"aria-haspopup": "menu",
		"aria-expanded": open,
	}) as React.HTMLAttributes<HTMLElement>;

	const floatingStyle: React.CSSProperties = {
		position: strategy,
		left: x != null ? `${Math.round(x)}px` : undefined,
		top: y != null ? `${Math.round(y)}px` : undefined,
		minWidth: "8rem",
		zIndex: 9999,
		...menuStyle,
	};

	return (
		<>
			{React.isValidElement(menuButton)
				? React.cloneElement(menuButton as React.ReactElement, referenceProps)
				: menuButton}

			{renderPanel && (
				<div
					ref={floating}
					{...getFloatingProps({})}
					className={`${panelClass} dropdown-content menu menu-compact`}
					style={floatingStyle}
				>
					{clonedChildren}
				</div>
			)}
		</>
	);
};

export default Menu;

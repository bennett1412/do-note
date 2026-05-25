import { IoIosColorPalette } from "react-icons/io";
import { ActionIcon, Box } from "@mantine/core";
import Menu from "./Menu";

type ColorMenuProps = {
	setColor: (color: string) => void;
};

const ColorMenu = ({ setColor }: ColorMenuProps) => {
	const lightColorCount = 2;
	const lightColorPrefix = "--note-bg-light-";
	const darkColorCount = 4;
	const darkColorPrefix = "--note-bg-dark-";

	const getColorPallete = () => {
		const getColors = (cssPrefix: string, colorCount: number): string[] => {
			const colorList = [];
			for (let i = 1; i <= colorCount; i++) {
				colorList.push(`var(${cssPrefix}${i})`);
			}
			return colorList;
		};
		let palletteList = getColors(lightColorPrefix, lightColorCount);
		palletteList = palletteList.concat(getColors(darkColorPrefix, darkColorCount));
		return palletteList.map((color, i) => (
			<button
				key={`${i}-${color}`}
				type="button"
				onClick={() => setColor(color)}
				style={{
					background: color,
					width: "2rem",
					height: "2rem",
					borderRadius: "50%",
					cursor: "pointer",
					border: "1px solid rgba(0, 0, 0, 0.1)",
					outline: "none",
					boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
					transition: "transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.transform = "scale(1.1)";
					e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.transform = "scale(1)";
					e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.2)";
				}}
				onMouseDown={(e) => {
					e.currentTarget.style.transform = "scale(0.95)";
				}}
				onMouseUp={(e) => {
					e.currentTarget.style.transform = "scale(1.1)";
				}}
			/>
		));
	};

	return (
		<Menu
			menuButton={
				<ActionIcon
					title="change note color"
					variant="subtle"
					color="gray"
					radius="xl"
					size="lg"
				>
					<IoIosColorPalette size={20} />
				</ActionIcon>
			}
			direction="bottom"
			align="center"
		>
			<Box
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					gap: "0.5rem",
					padding: "0.5rem",
					borderRadius: "10px",
				}}
				bg="surface.3"
			>
				{getColorPallete()}
			</Box>
		</Menu>
	);
};

export default ColorMenu;

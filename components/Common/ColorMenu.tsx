import { IoIosColorPalette } from "react-icons/io";
import styles from "./styles/colormenu.module.scss";
import button from "./styles/button.module.scss";
import clsx from "clsx";
import Menu, { MenuButton } from "./Menu";

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
        className={styles.color_circle}
        type="button"
        onClick={() => setColor(color)}
        style={{ background: color }}
      />
    ));
  };

  return (
    <Menu
      menuButton={
        <button title="change note color" className={clsx(button.button, button.toolbar_button)}>
          <IoIosColorPalette />
        </button>
      }
      direction={"bottom"}
      offsetY={12}
      align="center"
    >
      <div className={styles.color_grid}>
        {getColorPallete()}
      </div>
    </Menu>
  );
};

export default ColorMenu;

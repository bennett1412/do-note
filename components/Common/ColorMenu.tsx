import { IoIosColorPalette } from "react-icons/io";
import styles from "./styles/colormenu.module.scss";
import button from "./styles/button.module.scss";
import clsx from "clsx";
import Menu, { MenuButton, MenuItem } from "./Menu";

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
      <MenuItem key={`${i}-${color}`} className={styles.color_menu_item}>
        <button type="button" onClick={() => setColor(color)} style={{ background: color }}></button>
      </MenuItem>
    ));
  };

  return (
    <Menu
      menuButton={
        <MenuButton title="change note color" className={clsx(button.button, button.toolbar_button)}>
          <IoIosColorPalette />
        </MenuButton>
      }
      direction={"bottom"}
      offsetY={12}
      align="center"
      className={styles.color_menu_container}
    >
      {getColorPallete()}
    </Menu>
  );
};

export default ColorMenu;

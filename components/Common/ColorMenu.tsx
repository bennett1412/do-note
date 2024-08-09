import React from "react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { IoIosColorPalette } from "react-icons/io";
import styles from "@/styles/common/colormenu.module.scss";
import button from "@/styles/common/button.module.scss";
import { colors } from "@/utils/common/noteColors";
import clsx from "clsx";
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
      <MenuItem key={i} className={styles.color_menu_item}>
        <button onClick={() => setColor(color)} style={{ background: color }}></button>
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
      transition
      align="center"
      className={styles.color_menu_container}
    >
      {getColorPallete()}
    </Menu>
  );
};

export default ColorMenu;

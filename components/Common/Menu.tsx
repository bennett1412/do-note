import React from "react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { IoIosColorPalette } from "react-icons/io";
import styles from "@/styles/common/colormenu.module.scss";
import button from "@/styles/common/button.module.scss";
import { colors } from "@/utils/common/noteColors";
const ColorMenu = ({ setColor }: { setColor: Function }) => {
  // #FFEBD1 #FFC6C6 #DBD5FF #0D5C63 241623 #241623
  return (
    <Menu
      menuButton={
        <MenuButton className={button.toolbar_button}>
          <IoIosColorPalette />
        </MenuButton>
      }
      direction={"bottom"}
      offsetY={12}
      transition
      align="center"
      className={styles.color_menu_container}
    >
      {colors.map((color, i) => (
        <MenuItem key={i} className={styles.color_menu_item}>
          <button
            onClick={() => setColor(i)}
            style={{ background: color }}
          ></button>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ColorMenu;

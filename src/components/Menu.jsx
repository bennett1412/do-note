import React from "react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { IoIosColorPalette } from "react-icons/io";
import "../styles/common/colormenu.scss";
import { colors } from "../utils/common/noteColors";
const ColorMenu = ({ setColor }) => {
  // #FFEBD1 #FFC6C6 #DBD5FF #0D5C63 241623 #241623
  return (
    <Menu
      menuButton={
        <MenuButton className="toolbar-button">
          <IoIosColorPalette color="white" />
        </MenuButton>
      }
      direction={"bottom"}
      offsetY={12}
      transition
      align="center"
      className={"color-menu-container"}
    >
      {colors.map((color, i) => (
        <MenuItem key={i} className={"color-menu-item"}>
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

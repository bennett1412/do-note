import React from "react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { IoIosColorPalette } from "react-icons/io";
import "../styles/common/colormenu.scss";
const ColorMenu = ({ setColor }) => {
  const colors = ["#FFF9CA", "#FFDEB4", "#FFB4B4", "#B2A4FF"];
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
            onClick={() => setColor(color)}
            style={{ background: color }}
          ></button>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ColorMenu;

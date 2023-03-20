import React from "react";
import "../styles/common/navbar.scss";
import { FiLogOut } from "react-icons/fi";
import "react-float-menu/dist/react-float-menu.css";
import { useAuthUser } from "./../hooks/useAuthUser";
import { Menu, MenuDivider, MenuItem } from "@szhsin/react-menu";
import SyncIndicator from "./SyncIndicator";
import OfflineToggle from "./OfflineToggle";
const Navbar = () => {
  const { user, logout } = useAuthUser();
  const handleLogout = async () => {
    const res = await logout();
  };
  return (
    <nav>
      <a href="/">DoNote</a>
      <div className="more-ops">
        {user.data && (
          <>
            <Menu
              menuButton={<img src={user.data.photoURL} alt="profile-pic" />}
              direction="bottom"
              offsetY={12}
              align="end"
              menuStyle={{ minWidth: "min-content" }}
            >
              <MenuItem onClick={handleLogout} className={"menu-item"}>
                <FiLogOut size={25} /> Logout
              </MenuItem>
              <MenuDivider />
              <MenuItem disabled className={"menu-item"}>
                <OfflineToggle />
              </MenuItem>
            </Menu>
            <SyncIndicator />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

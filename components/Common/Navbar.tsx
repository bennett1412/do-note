import React from "react";
import "../styles/common/navbar.scss";
import { FiLogOut } from "react-icons/fi";
import "react-float-menu/dist/react-float-menu.css";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Menu, MenuDivider, MenuItem } from "@szhsin/react-menu";
import SyncIndicator from "./SyncIndicator";
import OfflineToggle from "./OfflineToggle";
import Link from "next/link";
const Navbar = () => {
  const { user, logout } = useAuthUser();
  const handleLogout = async () => {
    const res = await logout();
  };
  return (
    <nav>
      <Link className="logo" href="/">
        DoNote
      </Link>
      <div className="more-ops">
        {user.data && (
          <>
            <Menu
              //todo: change to custom next image component
              menuButton={<img src={user.data.photoURL} alt="profile-pic" />}
              direction="bottom"
              offsetY={12}
              align="end"
              menuStyle={{ minWidth: "8rem", fontSize: "18px" }}
            >
              <MenuItem onClick={handleLogout} className={"menu-item"}>
                <FiLogOut size={25} /> Logout
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation = true;
                  e.keepOpen = true;
                }}
                disabled
                className={"menu-item"}
              >
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

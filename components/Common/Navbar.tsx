import React from "react";
import styles from "@/styles/common/navbar.module.scss";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import "react-float-menu/dist/react-float-menu.css";
// import { useAuthUser } from "@/hooks/useAuthUser";
import { logout } from "@/utils/firebase/init";
import { useAuthUser } from "next-firebase-auth";
import { Menu, MenuDivider, MenuItem } from "@szhsin/react-menu";
import SyncIndicator from "./SyncIndicator";
import OfflineToggle from "./OfflineToggle";
import Link from "next/link";
import Image from "next/image";
import Button from "./Button";
import useDarkModeDetection from "@/hooks/useDarkMode";

const Navbar = () => {
  const user = useAuthUser();
  const isDarkMode = useDarkModeDetection();
  const handleLogout = async () => {
    await logout();
  };
  return (
    <nav className={styles.nav}>
      <Link className={styles.logo} href="/">
        DoNote
      </Link>
      <div className={styles.more_ops}>
        {/* <Button style={{borderRadius:'100%',backgroundColor:'transparent'}}> */}
        {/* {isDarkMode?<FiMoon/>:<FiSun/>} */}
        {/* </Button> */}
        {user.id && (
          <>
            <Menu
              //todo: change to custom next image component
              menuButton={<Image width={32} height={32} src={user.photoURL ?? ""} alt="profile-pic" />}
              direction="bottom"
              offsetY={12}
              align="end"
              menuStyle={{ minWidth: "8rem", fontSize: "18px" }}
            >
              <MenuItem onClick={handleLogout} className={styles.menu_item}>
                <FiLogOut size={25} /> Logout
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation = true;
                  e.keepOpen = true;
                }}
                disabled
                className={styles.menu_item}
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

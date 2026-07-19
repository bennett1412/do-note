import Image from "next/image";
import Link from "next/link";
import OfflineToggle from "./OfflineToggle";
import SyncIndicator from "./SyncIndicator";
import { LogOutIcon } from "@/utils/icons";
import { useSession } from "@/hooks/useSession";
import Menu, { MenuDivider, MenuItem } from "./Menu";
import { Group, Box } from "@mantine/core";

const Navbar = () => {
  const { user, signOut } = useSession();
  const handleLogout = async () => {
    signOut();
  };
  return (
    <Group
      component="nav"
      justify="space-between"
      align="center"
      px="md"
      h="3rem"
      bg="surface.0"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        fontFamily: '"Josefin Sans", sans-serif',
        color: "var(--color-primary-100, #eff2f1)",
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: "1.5rem",
          textDecoration: "none",
          color: "var(--color-primary-100, #eff2f1)",
          padding: "3px",
          borderRadius: "10px",
        }}
      >
        DoNote
      </Link>
      <Group gap="md" align="center">
        {user.id && (
          <>
            <Menu
              menuButton={
                <Box style={{ cursor: "pointer" }}>
                  <Image
                    width={32}
                    height={32}
                    src={user.picture ?? ""}
                    alt="profile-pic"
                    style={{ borderRadius: "100%" }}
                  />
                </Box>
              }
              direction="bottom"
              offsetY={12}
              align="end"
              menuStyle={{ minWidth: "8rem", fontSize: "18px" }}
            >
              <MenuItem
                onClick={handleLogout}
                style={{
                  justifyContent: "space-around",
                  paddingLeft: "0.5rem",
                  paddingRight: "0.5rem",
                }}
              >
                <LogOutIcon size={25} /> Logout
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  e.keepOpen = true;
                }}
                disabled
                style={{
                  justifyContent: "space-around",
                  paddingLeft: "0.5rem",
                  paddingRight: "0.5rem",
                }}
              >
                <OfflineToggle />
              </MenuItem>
            </Menu>
            <SyncIndicator />
          </>
        )}
      </Group>
    </Group>
  );
};

export default Navbar;

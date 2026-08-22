import Link from "next/link";
import OfflineToggle from "./OfflineToggle";
import SyncIndicator from "./SyncIndicator";
import { LogOutIcon } from "@/utils/icons";
import { useSession } from "@/hooks/useSession";
import { Group, Box, Avatar, Menu } from "@mantine/core";

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
            <Menu position="bottom-end" offset={12} shadow="md" styles={{ dropdown: { minWidth: "8rem", fontSize: "18px" } }}>
              <Menu.Target>
                <Box style={{ cursor: "pointer" }}>
                  <Avatar radius="xl" size={32} color="primary" variant="filled">
                    {user.email[0]?.toUpperCase() ?? "U"}
                  </Avatar>
                </Box>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={handleLogout}
                  leftSection={<LogOutIcon size={20} />}
                  style={{
                    justifyContent: "space-around",
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                  }}
                >
                  Logout
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item disabled>
                  <OfflineToggle />
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <SyncIndicator />
          </>
        )}
      </Group>
    </Group>
  );
};

export default Navbar;

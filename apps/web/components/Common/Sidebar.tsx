import type React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HomeIcon, FileTextIcon, LogOutIcon } from "@/utils/icons";
import { useSession } from "@/hooks/useSession";
import { Stack, NavLink, ActionIcon, Tooltip, Loader } from "@mantine/core";
import useStore from "@/hooks/useStore";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { user, signOut } = useSession();
  const syncing = useStore((state) => state.syncing);

  const handleLogout = () => {
    signOut();
  };

  const isActive = (path: string) => router.pathname === path;

  if (!user?.id) return null;

  return (
    <Stack
      component="aside"
      w={72}
      h="100vh"
      pos="fixed"
      left={0}
      top={0}
      bg="surface.0"
      py="md"
      align="center"
      visibleFrom="sm"
      style={{
        zIndex: 50,
        borderRight: "1px solid var(--color-surface-200, #232524)",
      }}
    >
      <Stack gap="lg" align="center" w="100%">
        <Tooltip label={syncing ? "Saving..." : "DoNote"} position="right" withArrow>
          <Link
            href="/notes"
            style={{
              fontWeight: 700,
              fontSize: "1.5rem",
              width: "2rem",
              height: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-primary-500, #f6f8f7)",
              textDecoration: "none",
            }}
          >
            {syncing ? <Loader size={22} color="var(--color-primary-500)" /> : "Dn"}
          </Link>
        </Tooltip>

        <Tooltip label="Notes" position="right" withArrow>
          <NavLink
            component={Link}
            href="/notes"
            label=""
            leftSection={<HomeIcon size={22} />}
            active={isActive("/notes")}
            variant="filled"
            w={48}
            h={48}
            styles={{
              root: { borderRadius: "12px" },
              label: { display: "none" },
            }}
          />
        </Tooltip>

        <Tooltip label="Articles" position="right" withArrow>
          <NavLink
            component={Link}
            href="/articles"
            label=""
            leftSection={<FileTextIcon size={22} />}
            active={isActive("/articles")}
            variant="filled"
            w={48}
            h={48}
            styles={{
              root: { borderRadius: "12px" },
              label: { display: "none" },
            }}
          />
        </Tooltip>
      </Stack>

      <Stack gap="md" align="center">
        <Tooltip label="Log out" position="right" withArrow>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            radius="md"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <LogOutIcon size={22} />
          </ActionIcon>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default Sidebar;

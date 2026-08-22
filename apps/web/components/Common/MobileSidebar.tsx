import type React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HomeIcon, FileTextIcon, LogOutIcon } from "@/utils/icons";
import { useSession } from "@/hooks/useSession";
import { Box, Group, UnstyledButton } from "@mantine/core";

export const MOBILE_TAB_BAR_HEIGHT = 56;

const MobileSidebar: React.FC = () => {
  const router = useRouter();
  const { user, signOut } = useSession();

  if (!user?.id) return null;

  const isActive = (path: string) => router.pathname === path;

  return (
    <Box
      component="nav"
      hiddenFrom="sm"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: MOBILE_TAB_BAR_HEIGHT,
        zIndex: 2,
        paddingBottom: "env(safe-area-inset-bottom)",
        display: "flex",
        alignItems: "stretch",
        borderTop: "1px solid var(--color-surface-200, #232524)",
        background: "rgba(11, 14, 13, 0.8)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <Group w="100%" gap={0} justify="space-around" align="stretch">
        <UnstyledButton
          component={Link}
          href="/notes"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isActive("/notes")
              ? "var(--color-primary-500, #f6f8f7)"
              : "var(--color-surface-600, #6f7170)",
          }}
          aria-label="Notes"
        >
          <HomeIcon size={24} />
        </UnstyledButton>

        <UnstyledButton
          component={Link}
          href="/articles"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isActive("/articles")
              ? "var(--color-primary-500, #f6f8f7)"
              : "var(--color-surface-600, #6f7170)",
          }}
          aria-label="Articles"
        >
          <FileTextIcon size={24} />
        </UnstyledButton>

        <UnstyledButton
          onClick={signOut}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-surface-600, #6f7170)",
          }}
          aria-label="Log out"
        >
          <LogOutIcon size={24} />
        </UnstyledButton>
      </Group>
    </Box>
  );
};

export default MobileSidebar;

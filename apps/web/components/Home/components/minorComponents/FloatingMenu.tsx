import React, { useCallback } from "react";
import { Editor, FloatingMenu as TiptapFloatingMenu } from "@tiptap/react";
import { ListIcon, HeadingIcon, ChecklistIcon, ImageIcon } from "@/utils/icons";
import { UnstyledButton, Box } from "@mantine/core";

type Props = { editor: Editor | null };

const CustomFloatingMenu: React.FC<Props> = ({ editor }) => {
  const addImage = useCallback(() => {
    const url = window.prompt("URL");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const getButtonStyle = (
    isActive: boolean,
    position: "first" | "middle" | "last"
  ): React.CSSProperties => {
    const borderRadii =
      position === "first" ? "10px 0 0 10px" : position === "last" ? "0 10px 10px 0" : "0";

    return {
      width: "2.5rem",
      height: "2.5rem",
      borderRadius: borderRadii,
      color: isActive ? "var(--color-surface-100)" : "var(--color-primary-100)",
      backgroundColor: isActive ? "var(--color-primary-100)" : "transparent",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    };
  };

  const buttonHoverStyles = (isActive: boolean) => ({
    root: {
      "&:hover": {
        backgroundColor: isActive ? "var(--color-primary-100)" : "var(--color-surface-400)",
      },
    },
  });

  const items = [
    {
      icon: <HeadingIcon size={18} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
      position: "first" as const,
    },
    {
      icon: <ListIcon size={18} />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      position: "middle" as const,
    },
    {
      icon: <ImageIcon size={18} />,
      onClick: addImage,
      isActive: editor.isActive("image"),
      position: "middle" as const,
    },
    {
      icon: <ChecklistIcon size={18} />,
      onClick: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive("taskList"),
      position: "last" as const,
    },
  ];

  return (
    <TiptapFloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <Box
        style={{
          backgroundColor: "var(--color-surface-300)",
          borderRadius: "10px",
          display: "flex",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
        }}
      >
        {items.map((item, idx) => (
          <UnstyledButton
            key={idx}
            onClick={item.onClick}
            style={getButtonStyle(item.isActive, item.position)}
            styles={buttonHoverStyles(item.isActive)}
          >
            {item.icon}
          </UnstyledButton>
        ))}
      </Box>
    </TiptapFloatingMenu>
  );
};

export default CustomFloatingMenu;

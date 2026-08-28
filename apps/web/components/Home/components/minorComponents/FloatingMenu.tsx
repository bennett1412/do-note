import React, { useCallback } from "react";
import { Editor, FloatingMenu as TiptapFloatingMenu } from "@tiptap/react";
import { ListIcon, HeadingIcon, ChecklistIcon, ImageIcon } from "@/utils/icons";
import { ActionIcon, Paper } from "@mantine/core";

type Props = { editor: Editor | null };

const CustomFloatingMenu: React.FC<Props> = ({ editor }) => {
  const addImage = useCallback(() => {
    const url = window.prompt("URL");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const items = [
    {
      icon: <HeadingIcon size={18} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
      label: "Heading",
    },
    {
      icon: <ListIcon size={18} />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      label: "Bullet list",
    },
    {
      icon: <ImageIcon size={18} />,
      onClick: addImage,
      isActive: editor.isActive("image"),
      label: "Image",
    },
    {
      icon: <ChecklistIcon size={18} />,
      onClick: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive("taskList"),
      label: "Checklist",
    },
  ];

  return (
    <TiptapFloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <Paper
        radius="md"
        shadow="md"
        style={{
          display: "flex",
          gap: 4,
          padding: 4,
          backgroundColor: "var(--color-surface-300)",
        }}
      >
        {items.map((item, idx) => (
          <ActionIcon
            key={idx}
            variant={item.isActive ? "filled" : "subtle"}
            color={item.isActive ? "primary" : "gray"}
            size="lg"
            radius="sm"
            title={item.label}
            onClick={item.onClick}
          >
            {item.icon}
          </ActionIcon>
        ))}
      </Paper>
    </TiptapFloatingMenu>
  );
};

export default CustomFloatingMenu;

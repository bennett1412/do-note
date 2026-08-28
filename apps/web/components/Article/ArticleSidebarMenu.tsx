import React, { memo, useContext, useState } from "react";
import type { Editor } from "@tiptap/react";
import { ActionIcon, Tooltip, Stack, Paper } from "@mantine/core";
import { CopyIcon, CheckIcon, DeleteIcon } from "@/utils/icons";
import { useRouter } from "next/router";
import { NotesContext } from "@/components/Home/components/NotesList";
import { useNoteContext } from "@/components/Home/components/NoteContext";
import type { NotesContextValue } from "@/types/Note";

type Props = {
  editor: Editor | null;
};

const ArticleSidebarMenu: React.FC<Props> = ({ editor }) => {
  const router = useRouter();
  const { deleteNote } = useContext(NotesContext) as NotesContextValue;
  const { fsId } = useNoteContext();
  const [copying, setCopying] = useState(false);

  const handleCopy = () => {
    setCopying(true);
    editor?.chain().focus().copyToClipboard().run();
    setTimeout(() => setCopying(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm("Delete this article?")) {
      deleteNote(fsId);
      router.push("/notes");
    }
  };

  return (
    <Paper
      pos="fixed"
      right={20}
      top="50%"
      p={8}
      bg="surface.1"
      radius="md"
      withBorder
      shadow="lg"
      style={{ transform: "translateY(-50%)", zIndex: 100 }}
    >
      <Stack gap="xs">
        <Tooltip label={copying ? "Copied!" : "Copy Content"} position="left" withArrow>
          <ActionIcon
            size="lg"
            variant="subtle"
            color="gray"
            radius="md"
            onClick={handleCopy}
          >
            {copying ? (
              <CheckIcon size={20} style={{ color: "#40C057" }} />
            ) : (
              <CopyIcon size={20} />
            )}
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Delete Article" position="left" withArrow>
          <ActionIcon
            size="lg"
            variant="subtle"
            color="gray"
            radius="md"
            onClick={handleDelete}
            styles={{
              root: {
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                  color: "#ff6b6b",
                },
              },
            }}
          >
            <DeleteIcon size={20} />
          </ActionIcon>
        </Tooltip>
      </Stack>
    </Paper>
  );
};

export default memo(ArticleSidebarMenu);

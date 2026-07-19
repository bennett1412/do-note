import { type EventHandler, type SyntheticEvent, memo, useContext, useState } from "react";
import { useRouter } from "next/router";
import { FileTextIcon, CheckIcon, CopyIcon, DeleteIcon } from "@/utils/icons";
import type { NoteContextType, NotesContextValue } from "@/types/Note";
import { NoteContext } from "./Note";
import { NotesContext } from "./NotesList";
import type { Editor } from "@tiptap/react";
import { ActionIcon, Group } from "@mantine/core";

type BottomMenuProps = {
  editor: Editor | null;
};

const BottomMenu = memo(function BottomMenu({ editor }: BottomMenuProps): JSX.Element {
  const { deleteNote } = useContext(NotesContext) as NotesContextValue;
  const { editMode, fsId, setColor } = useContext(NoteContext) as NoteContextType;
  const router = useRouter();
  const pathname = router?.pathname || "";
  const isArticle = pathname.includes("/articles/");
  const [copying, setCopying] = useState<boolean>(false);

  const handleDelete: EventHandler<SyntheticEvent> = async (e) => {
    const confirm = window.confirm("Are you sure you want to delete this note?");
    if (confirm) {
      deleteNote(fsId);
    }
    e.stopPropagation();
  };

  const handleCopy: EventHandler<SyntheticEvent> = (e) => {
    setCopying(true);
    editor?.chain().copyToClipboard();
    setTimeout(() => {
      setCopying(false);
    }, 500);
    e.stopPropagation();
  };

  return (
    <Group
      gap="xs"
      justify="space-between"
      w="100%"
      pos="absolute"
      bottom={5}
      left={0}
      px="sm"
      style={{
        zIndex: 1,
        opacity: editMode ? 1 : undefined,
        transition: "opacity 0.1s linear",
      }}
      className="note-toolbar"
    >
      <Group gap="xs">
        <ActionIcon
          title="copy note content"
          onClick={handleCopy}
          variant="subtle"
          color="gray"
          radius="xl"
          size="md"
          style={copying ? { backgroundColor: "rgba(64, 192, 87, 0.15)", color: "#40C057" } : {}}
        >
          {copying ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
        </ActionIcon>
        <ActionIcon
          title="delete note"
          onClick={handleDelete}
          variant="subtle"
          color="gray"
          radius="xl"
          size="md"
          styles={{
            root: {
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                color: "#ff6b6b",
              },
            },
          }}
        >
          <DeleteIcon size={18} />
        </ActionIcon>
      </Group>

      {editMode && !isArticle && (
        <ActionIcon
          title="Convert to Article"
          onClick={async () => {
            if (window.confirm("Convert to long-form Article? This cannot be undone.")) {
              const { updateNote } = await import("@/utils/supabase/db_operations");
              await updateNote(Number(fsId), { isArticle: true });
              router.push(`/articles/${fsId}`);
            }
          }}
          variant="subtle"
          color="gray"
          radius="xl"
          size="md"
        >
          <FileTextIcon size={18} />
        </ActionIcon>
      )}
    </Group>
  );
});

export default BottomMenu;

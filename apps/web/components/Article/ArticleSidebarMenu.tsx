
import React, { memo, useContext, useState } from "react";
import { Editor } from "@tiptap/react";
import { UnstyledButton, Tooltip, Stack } from "@mantine/core";
import { BiCopy, BiCheck } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { useRouter } from "next/router";
import { NotesContext } from "@/components/Home/components/NotesList";
import { NoteContext } from "@/components/Home/components/Note";
import { NotesContextValue, NoteContextType } from "@/types/Note";
import styles from "./article_sidebar_menu.module.scss";

type Props = {
  editor: Editor | null;
};

const ArticleSidebarMenu: React.FC<Props> = ({ editor }) => {
  const router = useRouter();
  const { deleteNote } = useContext(NotesContext) as NotesContextValue;
  const { fsId } = useContext(NoteContext) as NoteContextType;
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
    <div className={styles.sidebar_menu}>
      <Stack gap="sm">
        <Tooltip label="Back to Notes" position="left" withArrow>
          <UnstyledButton className={styles.menu_button} onClick={() => router.push("/notes")}>
            <FiHome size={20} />
          </UnstyledButton>
        </Tooltip>

        <Tooltip label={copying ? "Copied!" : "Copy Content"} position="left" withArrow>
          <UnstyledButton className={styles.menu_button} onClick={handleCopy}>
            {copying ? <BiCheck size={20} color="#40C057" /> : <BiCopy size={20} />}
          </UnstyledButton>
        </Tooltip>

        <Tooltip label="Delete Article" position="left" withArrow>
          <UnstyledButton className={styles.menu_button} onClick={handleDelete}>
            <MdOutlineDelete size={20} />
          </UnstyledButton>
        </Tooltip>
      </Stack>
    </div>
  );
};

export default memo(ArticleSidebarMenu);

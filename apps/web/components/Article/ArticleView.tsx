import React, { useEffect } from "react";
import type { Note, NotesContextValue } from "@/types/Note";
import useDeleteNote from "@/hooks/useDeleteNote";
import { NotesContext } from "@/components/Home/components/NotesList";
import ArticleTiptap from "./ArticleTiptap";
import { Box, Divider, TextInput } from "@mantine/core";
import styles from "./article_view.module.scss";
import { NoteProvider, useNoteContext } from "@/components/Home/components/NoteContext";

type ArticleViewProps = {
  note: Note;
};

const ArticleViewInner: React.FC = () => {
  const { noteTitle: note_title, setTitle, syncing, dirty } = useNoteContext();
  const { mutate: deleteMutate } = useDeleteNote({});

  const notesContextValue: NotesContextValue = {
    addingNote: false,
    addNote: () => {},
    updateNote: () => Promise.resolve({} as Note),
    deleteNote: deleteMutate,
  };

  return (
    <NotesContext.Provider value={notesContextValue}>
      <Box className={styles.article_container}>
        <Box className={styles.header}>
          <TextInput
            className={styles.title_input}
            variant="unstyled"
            size="xl"
            value={note_title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            placeholder="Untitled"
            aria-label="Article title"
          />
        </Box>
        {syncing && <span className={styles.saving}>Saving...</span>}
        <Box className={styles.divider} />
        <Box className={styles.editor_wrapper} style={{ flex: 1 }}>
          <ArticleTiptap />
        </Box>
      </Box>
    </NotesContext.Provider>
  );
};

const ArticleView: React.FC<ArticleViewProps> = ({ note }) => {
  return (
    <NoteProvider note={{ id: note.id, noteTitle: note.noteTitle, noteContent: note.noteContent, color: note.color }}>
      <ArticleViewInner />
    </NoteProvider>
  );
};

export default ArticleView;
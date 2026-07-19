import React, { useState, useEffect } from "react";
import type { Note, NotesContextValue, NoteContextType } from "@/types/Note";
import { updateNote } from "@/utils/supabase/db_operations";
import useDeleteNote from "@/hooks/useDeleteNote";
import { NotesContext } from "@/components/Home/components/NotesList";
import { NoteContext } from "@/components/Home/components/Note";
import ArticleTiptap from "./ArticleTiptap";
import { Box } from "@mantine/core";

type ArticleViewProps = {
  note: Note;
};

const ArticleView: React.FC<ArticleViewProps> = ({ note }) => {
  const [title, setTitle] = useState(note.noteTitle);
  const [color, setColor] = useState(note.color);
  const [editMode, setEditMode] = useState(true);
  const { mutate: deleteMutate } = useDeleteNote({});

  const notesContextValue: NotesContextValue = {
    addingNote: false,
    addNote: () => {},
    updateNote: updateNote,
    deleteNote: deleteMutate,
  };

  const noteContextValue: NoteContextType = {
    note_title: title,
    content: note.noteContent,
    editMode: editMode,
    fsId: String(note.id),
    color: color,
    setEditMode: setEditMode,
    setColor: (newColor: string) => {
      setColor(newColor);
      updateNote(note.id, { color: newColor });
    },
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (title !== note.noteTitle) {
        updateNote(note.id, { noteTitle: title });
      }
    }, 1000);
    return () => clearTimeout(handler);
  }, [title, note.id, note.noteTitle]);

  return (
    <NotesContext.Provider value={notesContextValue}>
      <NoteContext.Provider value={noteContextValue}>
        <Box
          style={{
            padding: "3rem 4rem",
            minHeight: "100vh",
            transition: "background-color 0.3s ease",
            maxWidth: "900px",
            margin: "0 auto",
            backgroundColor: color,
          }}
        >
          <Box style={{ marginBottom: "2rem" }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                fontSize: "2.5rem",
                fontWeight: 700,
                border: "none",
                background: "transparent",
                outline: "none",
                color: "var(--text-primary)",
              }}
              placeholder="Untitled"
            />
          </Box>
          <Box
            styles={{
              root: {
                "& .ProseMirror": {
                  minHeight: "60vh",
                  padding: 0,
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                },
              },
            }}
          >
            <ArticleTiptap />
          </Box>
        </Box>
      </NoteContext.Provider>
    </NotesContext.Provider>
  );
};

export default ArticleView;

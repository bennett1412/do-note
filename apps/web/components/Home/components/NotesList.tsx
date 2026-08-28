import type React from "react";
import { type MouseEventHandler, useState, createContext } from "react";
import Note from "./Note";
import { PlusIcon } from "@/utils/icons";
import { Loader } from "@mantine/core";
import type {
  DeleteMutation,
  Note as NoteType,
  NotesContextValue,
  UpdateNoteFn,
} from "@/types/Note";
import { Box, Button } from "@mantine/core";

export const NotesContext = createContext<NotesContextValue | undefined>(undefined);

type NoteListProps = {
  addingNote: boolean;
  notes?: NoteType[];
  addNote: MouseEventHandler;
  deleteNote: DeleteMutation;
  updateNote: UpdateNoteFn;
};

const NotesList: React.FC<NoteListProps> = ({
  addingNote,
  addNote,
  notes,
  updateNote,
  deleteNote,
}) => {
  const [_, setSelectedId] = useState<string | null>(null);
  return (
    <NotesContext.Provider value={{ addingNote, addNote, updateNote, deleteNote }}>
      <Box
        component="section"
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(18rem, 100%), 1fr))",
          padding: "1.5rem",
          justifyItems: "center",
          overflow: "visible",
        }}
      >
        {notes?.map((note) => {
          return (
            <Note
              key={note.id}
              title={note.noteTitle}
              content={note.noteContent}
              fsId={String(note.id)}
              color={note.color}
              setSelectedId={setSelectedId}
            />
          );
        })}

        <Button
          disabled={addingNote}
          onClick={addNote}
          variant="filled"
          radius="10px"
          style={{
            display: "flex",
            width: "4rem",
            height: "3rem",
            position: "fixed",
            justifyContent: "center",
            alignItems: "center",
            bottom: "10%",
            right: "5%",
            border: "1px solid var(--weak-border)",
            zIndex: 2,
          }}
        >
          {addingNote ? (
            <Loader size="sm" color="gray" />
          ) : (
            <PlusIcon size={25} style={{ color: "var(--color-surface-100, #0b0e0d)" }} />
          )}
        </Button>
      </Box>
    </NotesContext.Provider>
  );
};

export default NotesList;

import {
  useRef,
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import useUpdateNote from "@/hooks/useUpdateNote";
import useStore from "@/hooks/useStore";
import type { NoteContextType } from "@/types/Note";
import { useDebouncedCallback } from "@mantine/hooks";

const DEBOUNCE_TIME_MS = 3000;
export const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const useNoteContext = () => {
  const ctx = useContext(NoteContext);
  if (!ctx) throw new Error("useNoteContext must be used within NoteContext.Provider");
  return ctx;
};

type AutosaveNote = {
  id: number;
  noteTitle: string;
  noteContent: string;
  color: string;
};

export const NoteProvider = ({
  note: savedNote,
  children,
  defaultEditMode = false,
}: {
  note: AutosaveNote;
  children: ReactNode;
  defaultEditMode?: boolean;
}) => {
  const updateNoteMutation = useUpdateNote();
  const syncing = useStore((state) => state.syncing);
  const updateSync = useStore((state) => state.updateSync);
  const [note, setNote] = useState<AutosaveNote>(savedNote);

  const [editMode, setEditMode] = useState(defaultEditMode);

  // Mirror state into a ref so the debounced callback always reads the latest values
  const noteRef = useRef(note);
  noteRef.current = note;

  // Tracks the last content confirmed saved by the server. `setContent` is a
  // no-op when given this value, so echoing loaded content back (e.g. TipTap's
  // initial onUpdate) never triggers a spurious save. Only updated once the
  // PATCH has succeeded.
  const lastSavedContentRef = useRef(savedNote.noteContent);

  const saveNote = useDebouncedCallback(async () => {
    const latest = noteRef.current;
    try {
      await updateNoteMutation.mutateAsync({
        noteId: latest.id,
        data: {
          noteTitle: latest.noteTitle,
          noteContent: latest.noteContent,
          color: latest.color,
        },
      });
      lastSavedContentRef.current = latest.noteContent;
    } finally {
      updateSync(false);
    }
  }, DEBOUNCE_TIME_MS);

  const setTitle = useCallback(
    (next: string) => {
      setNote((prevNote) => ({ ...prevNote, noteTitle: next }));
      updateSync(true);
      saveNote();
    },
    [saveNote, updateSync],
  );

  const setContent = useCallback(
    (next: string) => {
      // Ignore changes that just re-echo the last server-confirmed content
      // (e.g. content loaded into the editor triggering onUpdate on mount).
      if (next === lastSavedContentRef.current) return;
      setNote((prevNote) => ({ ...prevNote, noteContent: next }));
      updateSync(true);
      saveNote();
    },
    [saveNote, updateSync],
  );

  const setColor = useCallback(
    (next: string) => {
      setNote((prevNote) => ({ ...prevNote, color: next }));
      updateSync(true);
      // Flush immediately for color changes so the UI updates right away
      saveNote.flush();
    },
    [saveNote, updateSync],
  );

  const contextValue = useMemo<NoteContextType>(
    () => ({
      noteTitle: note.noteTitle,
      content: note.noteContent,
      color: note.color,
      editMode,
      dirty: false,
      syncing,
      fsId: String(note.id),
      setEditMode,
      setColor,
      setTitle,
      setContent,
    }),
    [note.noteTitle, note.noteContent, note.color, editMode, syncing, note.id, setColor, setTitle, setContent],
  );

  return <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>;
};
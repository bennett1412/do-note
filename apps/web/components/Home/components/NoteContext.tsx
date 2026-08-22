import {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import useUpdateNote from "@/hooks/useUpdateNote";
import useStore from "@/hooks/useStore";
import type { NoteContextType } from "@/types/Note";

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

type PendingPatch = {
  noteTitle?: string;
  noteContent?: string;
  color?: string;
};

export const NoteProvider = ({
  note,
  children,
  defaultEditMode = false,
}: {
  note: AutosaveNote;
  children: ReactNode;
  defaultEditMode?: boolean;
}) => {
  const updateNoteMutation = useUpdateNote();
  const updateSync = useStore((state) => state.updateSync);

  const [note_title, setTitleState] = useState(note.noteTitle);
  const [content, setContentState] = useState(note.noteContent);
  const [color, setColorState] = useState(note.color);
  const [editMode, setEditMode] = useState(defaultEditMode);

  const pending = useRef<PendingPatch | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const flush = useCallback(async () => {
    clearTimer();
    const patch = pending.current;
    if (!patch) return;
    pending.current = null;
    try {
      await updateNoteMutation.mutateAsync({ noteId: note.id, data: patch });
    } finally {
      updateSync(false);
    }
  }, [clearTimer, updateNoteMutation, note.id]);

  const setTitle = useCallback(
    (next: string) => {
      updateSync(true);
      setTitleState(next);
      pending.current = { ...pending.current, noteTitle: next };
      clearTimer();
      timer.current = setTimeout(flush, 3000);
    },
    [flush, clearTimer, updateSync]
  );

  const setContent = useCallback(
    (next: string) => {
      updateSync(true);
      setContentState(next);
      pending.current = { ...pending.current, noteContent: next };
      clearTimer();
      timer.current = setTimeout(flush, 3000);
    },
    [flush, clearTimer, updateSync]
  );

  const setColor = useCallback(
    (next: string) => {
      updateSync(true);
      setColorState(next);
      pending.current = { ...pending.current, color: next };
      flush();
    },
    [flush, updateSync]
  );

  // Flush pending save on unmount (close the note).
  useEffect(() => {
    return () => {
      clearTimer();
      if (pending.current) {
        updateNoteMutation.mutate({ noteId: note.id, data: pending.current });
        pending.current = null;
      }
      updateSync(false);
    };
  }, [clearTimer, updateNoteMutation, note.id]);

  const contextValue = useMemo<NoteContextType>(
    () => ({
      note_title,
      content,
      color,
      editMode,
      dirty: false,
      syncing: false,
      fsId: String(note.id),
      setEditMode,
      setColor,
      setTitle,
      setContent,
    }),
    [note_title, content, color, editMode, note.id, setColor, setTitle, setContent]
  );

  return <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>;
};
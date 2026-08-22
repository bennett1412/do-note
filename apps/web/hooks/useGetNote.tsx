import { useQuery } from "@tanstack/react-query";
import { getNote } from "@/utils/notesApi";
import type { Note } from "@/types/Note";

const useGetNote = (noteId: number | null | undefined) => {
  return useQuery<Note, Error>(["note", noteId], () => getNote(noteId!), {
    enabled: !!noteId,
    refetchOnWindowFocus: false,
  });
};

export default useGetNote;

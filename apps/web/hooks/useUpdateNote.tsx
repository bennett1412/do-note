import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote } from "@/utils/notesApi";
import type { Note, NoteUpdate } from "@/types/Note";

const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, data }: { noteId: number; data: NoteUpdate }) =>
      updateNote(noteId, data),
    // Optimistic update: immediately reflect the change in the cache
    onMutate: async ({ noteId, data }) => {
      // Cancel any in-flight refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      // Snapshot previous value for rollback
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      // Optimistically update the cache
      queryClient.setQueryData<Note[]>(["notes"], (oldNotes) => {
        if (!oldNotes) return oldNotes;
        return oldNotes.map((note) =>
          note.id === noteId ? { ...note, ...data } : note,
        );
      });

      // Return snapshot for rollback
      return { previousNotes };
    },
    // Merge the server-confirmed note into the cache instead of refetching the
    // whole list. Avoids a full GET /api/notes after every save.
    onSuccess: (savedNote) => {
      queryClient.setQueryData<Note[]>(["notes"], (oldNotes) => {
        if (!oldNotes) return oldNotes;
        return oldNotes.map((note) =>
          note.id === savedNote.id ? savedNote : note,
        );
      });
    },
    // If mutation fails, roll back to the previous value
    onError: (_err, _vars, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
  });
};

export default useUpdateNote;

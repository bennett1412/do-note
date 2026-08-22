import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote } from "@/utils/notesApi";
import useStore from "./useStore";
import type { Note, NoteUpdate } from "@/types/Note";

const useUpdateNote = () => {
  const queryClient = useQueryClient();
  const updateSync = useStore((state) => state.updateSync);

  return useMutation({
    mutationFn: ({ noteId, data }: { noteId: number; data: NoteUpdate }) =>
      updateNote(noteId, data),
    // Optimistic update: immediately reflect the change in the cache
    onMutate: async ({ noteId, data }) => {
      updateSync(true);
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
    // If mutation fails, roll back to the previous value
    onError: (_err, _vars, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    // Always refetch after mutation completes (success or error) to sync with server
    onSettled: () => {
      updateSync(false);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export default useUpdateNote;
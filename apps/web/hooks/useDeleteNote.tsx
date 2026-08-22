import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/utils/notesApi";
import useStore from "./useStore";
import type { Note } from "@/types/Note";

const useDeleteNote = ({
  successCb,
  errorCb,
}: {
  successCb?: () => void;
  errorCb?: () => void;
}) => {
  const queryClient = useQueryClient();
  const updateSync = useStore((state) => state.updateSync);

  const deleteMutation = useMutation<void, Error, string, { previousNotes?: Note[] }>({
    mutationFn: (noteId: string) => deleteNote(Number(noteId)),
    // Optimistic: remove the note from cache immediately
    onMutate: async (deletedNoteId) => {
      updateSync(true);
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);
      queryClient.setQueryData<Note[]>(["notes"], (oldNotes) => {
        if (oldNotes) return oldNotes.filter((note) => note.id !== Number(deletedNoteId));
        return oldNotes;
      });
      return { previousNotes };
    },
    onSuccess: (_data, _deletedNoteId) => {
      if (successCb) successCb();
    },
    onError: (_err, _deletedNoteId, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
      if (errorCb) errorCb();
    },
    // Silently refetch in background to sync server state
    onSettled: () => {
      updateSync(false);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return deleteMutation;
};

export default useDeleteNote;

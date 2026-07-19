import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { deleteNote } from "@/utils/supabase/db_operations";
import type { Note } from "@/types/Note";

const useDeleteNote = ({
  successCb,
  errorCb,
}: {
  successCb?: () => void;
  errorCb?: () => void;
}): UseMutationResult<void, Error, string, void> => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<void, Error, string, void>(
    (noteId: string) => deleteNote(Number(noteId)),
    {
      onSuccess: (_, deletedNoteId) => {
        if (successCb) successCb();
        queryClient.setQueryData<Note[]>(["notes"], (oldNotes) => {
          if (oldNotes) return oldNotes.filter((note) => note.id !== Number(deletedNoteId));
          return oldNotes;
        });
      },
      onError: () => {
        if (errorCb) errorCb();
      },
    }
  );

  return deleteMutation;
};

export default useDeleteNote;

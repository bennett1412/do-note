import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { deleteNote } from "@/utils/supabase/db_operations";
import { DeleteNoteMutationParams, Note } from "@/types/Note";

const useDeleteNote = ({
  creatorId,
  successCb,
  errorCb,
}: DeleteNoteMutationParams): UseMutationResult<null, Error, string, void> => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<null, Error, string, void>(
    (noteId: string) => deleteNote(noteId),
    {
      // todo: add some check for verifying creatorid before deleting
      onSuccess: (_, deletedNoteId) => {
        if (successCb) successCb();
        queryClient.setQueryData<Note[]>(["notes", creatorId], (oldNotes) => {
          if (oldNotes) return oldNotes.filter((note) => note.id !== deletedNoteId);
          return oldNotes;
        });
      },
      onError: (error) => {
        console.error("Error deleting note:", error);
        if (errorCb) errorCb();
      },
    }
  );

  return deleteMutation;
};

export default useDeleteNote;

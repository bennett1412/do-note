import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../utils/firebase/firestore";
import { DeleteNoteMutationParams, Note } from "@/types/Note";

const useDeleteNote = ({
  creatorId,
  successCb,
  errorCb,
}: DeleteNoteMutationParams) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (data, deletedNoteId) => {
      if (successCb) successCb();
      queryClient.setQueryData(
        ["notes", creatorId],
        (oldNotes: Note[] | undefined) => {
          if (oldNotes)
            return oldNotes.filter((note) => note.id != deletedNoteId);
        }
      );
    },
    onError: () => {
      if (errorCb) errorCb();
    },
  });

  return deleteMutation;
};

export default useDeleteNote;

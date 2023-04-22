import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../utils/firebase/firestore";
import { DeleteNoteParamType, Note } from "@/types/Note";

const useDeleteNote = ({
  creatorId,
  successCb,
  errorCb,
}: DeleteNoteParamType) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (data, deletedNoteId) => {
      successCb();
      queryClient.setQueryData(
        ["notes", creatorId],
        (oldNotes: Note[] | undefined) => {
          if (oldNotes)
            return oldNotes.filter((note) => note.id != deletedNoteId);
        }
      );
    },
    onError: () => {
      errorCb();
    },
  });

  return deleteMutation;
};

export default useDeleteNote;

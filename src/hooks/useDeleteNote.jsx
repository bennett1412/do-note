import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../utils/firebase/firestore";

const useDeleteNote = ({ sucessCb, errorCb }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (data, deletedNoteId) => {
      sucessCb();
      queryClient.setQueryData(["notes"], (oldNotes) => {
        return oldNotes.filter((note) => note.id != deletedNoteId);
      });
    },
    onError: () => {
      errorCb();
    },
  });

  return deleteMutation;
};

export default useDeleteNote;

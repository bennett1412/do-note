import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNote } from "../utils/firebase/firestore";

const useAddNote = ({ creatorId, successCb, errorCb }) => {
  const queryClient = useQueryClient();
  const AddNoteMutation = useMutation({
    mutationFn: addNote,
    onSuccess: (data, variables) => {
      successCb();
      queryClient.setQueryData(["notes", creatorId], (oldNotes) => {
        return [
          { ...variables.newNote, id: data.id, active: true },
          ...oldNotes,
        ];
      });
    },
    onError: () => {
      errorCb();
    },
  });
  return AddNoteMutation;
};

export default useAddNote;

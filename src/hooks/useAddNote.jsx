import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNote } from "../utils/firebase/firestore";

const useAddNote = ({ successCb, errorCb }) => {
  const queryClient = useQueryClient();
  const AddNoteMutation = useMutation({
    mutationFn: addNote,
    onSuccess: (data, variables) => {
      successCb();
      queryClient.setQueryData(["notes"], (oldNotes) => [
        ...oldNotes,
        { ...variables, id: data.id, active: true },
      ]);
    },
    onError: () => {
      errorCb();
    },
  });
  return AddNoteMutation;
};

export default useAddNote;

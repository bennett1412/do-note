import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { addNote } from "../utils/firebase/firestore";
import { addNote } from "@/api-integ";
import { Note, AddNoteParams, AddNoteMutationParams } from "@/types/Note";

const useAddNote = ({
  creatorId,
  successCb,
  errorCb,
}: AddNoteMutationParams) => {
  const queryClient = useQueryClient();
  const AddNoteMutation = useMutation({
    mutationFn: addNote,
    onSuccess: (data: string, variables: AddNoteParams) => {
      if (successCb) successCb();
      queryClient.setQueryData(
        ["notes", creatorId],
        (oldNotes: Note[] | undefined) => {
          if (oldNotes) {
            return [
              { ...variables.newNote, id: data, active: true },
              ...oldNotes,
            ];
          }
        }
      );
    },
    onError: () => {
      if (errorCb) errorCb();
    },
  });
  return AddNoteMutation;
};

export default useAddNote;

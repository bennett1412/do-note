import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNote } from "../utils/firebase/firestore";
import { Note, AddNoteParams, AddNoteMutationParams } from "@/types/Note";

const useAddNote = ({
  creatorId,
  successCb,
  errorCb,
}: AddNoteMutationParams) => {
  const queryClient = useQueryClient();
  const AddNoteMutation = useMutation<string, Error, AddNoteParams>({
    mutationFn: addNote,
    onSuccess: (data: string, variables: AddNoteParams) => {
      successCb();
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
      errorCb();
    },
  });
  return AddNoteMutation;
};

export default useAddNote;

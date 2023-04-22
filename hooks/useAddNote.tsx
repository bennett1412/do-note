import {
  Mutation,
  MutationFunction,
  MutationKey,
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { addNote } from "../utils/firebase/firestore";
import { Note, addNoteParams } from "@/types/Note";

type cbFn = () => void;
type paramType = {
  creatorId: string;
  successCb: cbFn;
  errorCb: cbFn;
};

const useAddNote = ({ creatorId, successCb, errorCb }: paramType) => {
  const queryClient = useQueryClient();
  const AddNoteMutation = useMutation<
    string,
    Error,
    addNoteParams,
    "mutationFn"
  >({
    mutationFn: addNote,
    onSuccess: (data: Note, variables: addNoteParams) => {
      successCb();
      queryClient.setQueryData(
        ["notes", creatorId],
        (oldNotes: Note[]) => {
          return [
            { ...variables.newNote, id: data.id, active: true },
            ...oldNotes,
          ];
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

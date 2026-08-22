import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNote } from "@/utils/notesApi";
import useStore from "./useStore";
import type { Note, NoteCreate } from "@/types/Note";

const useAddNote = ({ successCb, errorCb }: { successCb?: () => void; errorCb?: () => void }) => {
  const queryClient = useQueryClient();
  const updateSync = useStore((state) => state.updateSync);
  const AddNoteMutation = useMutation({
    mutationFn: (data: NoteCreate) => addNote(data),
    onMutate: () => {
      updateSync(true);
    },
    onSuccess: (id: number, variables: NoteCreate) => {
      if (successCb) successCb();
      queryClient.setQueryData<Note[]>(["notes"], (oldNotes) => {
        if (oldNotes) {
          return [
            {
              id,
              noteTitle: variables.noteTitle,
              noteContent: variables.noteContent ?? "",
              color: variables.color ?? "#ffffff",
              isArticle: variables.isArticle ?? false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...oldNotes,
          ];
        }
        return oldNotes;
      });
    },
    onError: () => {
      if (errorCb) errorCb();
    },
    // Silently refetch in background to sync server state
    onSettled: () => {
      updateSync(false);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  return AddNoteMutation;
};

export default useAddNote;

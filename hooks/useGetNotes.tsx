import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../utils/firebase/firestore";
import { Note } from "@/types/Note";
interface NotesQueryResult {
  notes: Note[];
}
const useGetNotes = (creatorId: string) => {
  const notesQuery = useQuery({
    queryKey: ["notes", creatorId],
    queryFn: ({ queryKey }: { queryKey: string[] }) => getNotes(queryKey[1]),
  });
  return notesQuery;
};

export default useGetNotes;

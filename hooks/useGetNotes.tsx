import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../utils/firebase/firestore";

const useGetNotes = (creatorId: string) => {
  const notesQuery = useQuery({
    queryKey: ["notes", creatorId],
    queryFn: ({ queryKey }) => getNotes(queryKey[1]),
  });
  return notesQuery;
};

export default useGetNotes;

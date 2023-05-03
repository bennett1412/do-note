import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../utils/firebase/firestore";

const useGetNotes = (creatorId: string | null) => {
  const notesQuery = useQuery({
    queryKey: ["notes", creatorId],
    queryFn: () => getNotes(creatorId),
    enabled: !!creatorId,
  });
  return notesQuery;
};

export default useGetNotes;

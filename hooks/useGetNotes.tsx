import { useQuery } from "@tanstack/react-query";
// import { getNotes } from "../utils/firebase/firestore";
import { getNotes } from "@/api-integ";
const useGetNotes = (creatorId: string | null) => {
  const notesQuery = useQuery({
    queryKey: ["notes", creatorId],
    queryFn: () => getNotes(),
    enabled: !!creatorId,
  });
  return notesQuery;
};

export default useGetNotes;

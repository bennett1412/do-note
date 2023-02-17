import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../utils/firebase/firestore";

const useGetNotes = () => {
  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });
  return notesQuery;
};

export default useGetNotes;

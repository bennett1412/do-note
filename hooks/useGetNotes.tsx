import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../utils/supabase/db_operations";
import { toast } from "react-hot-toast";
const useGetNotes = (creatorId: string | null) => {
  const notesQuery = useQuery({
    queryKey: ["notes", creatorId],
    queryFn: () => getNotes(creatorId),
    enabled: !!creatorId,
    onError: () => {
      toast.error("Failed to fetch notes", {
        id: "note-fetch-error",
      });
    },
  });
  return notesQuery;
};

export default useGetNotes;

import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../utils/supabase/db_operations";
import { toast } from "react-hot-toast";

const useGetNotes = () => {
  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: () => getNotes(),
    onError: () => {
      toast.error("Failed to fetch notes", {
        id: "note-fetch-error",
      });
    },
  });
  return notesQuery;
};

export default useGetNotes;

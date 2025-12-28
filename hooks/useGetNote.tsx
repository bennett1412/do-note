
import { useQuery } from "@tanstack/react-query";
import { getNote } from "@/utils/supabase/db_operations";
import { Note } from "@/types/Note";

const useGetNote = (noteId: string | undefined | null) => {
	return useQuery<Note, Error>(
		["note", noteId],
		() => getNote(noteId!),
		{
			enabled: !!noteId,
			refetchOnWindowFocus: false,
		}
	);
};

export default useGetNote;

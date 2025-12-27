import type { Note, AddNoteParams, UpdateNoteFn } from "@/types/Note";
import { supabase } from "./init";

// * note related db operations

export const addNote = async (data: AddNoteParams): Promise<string> => {
	if (data.creatorId === null) {
		return Promise.reject(new Error("Invalid creatorId"));
	}
	try {
		const { note_content, note_title, color } = data.newNote;
		const { data: result, error } = await supabase
			.from("notes")
			.insert([
				{
					note_title,
					note_content,
					color,
					timestamp: new Date().toISOString(),
					creator: data.creatorId,
				},
			])
			.select()
			.single();

		if (error) {
			throw error;
		}

		const addedNote = result as Note;
		return addedNote.id;
	} catch (error) {
		// console.error("Error adding document: ", error);
		throw new Error("Failed to add note.");
	}
};

export const getNotes = async (creatorId: string | null): Promise<Note[]> => {
	if (creatorId === null || creatorId === "") {
		return Promise.reject(new Error("Invalid creatorId"));
	}
	try {
		const { data: notes, error } = await supabase
			.from("notes")
			.select("*")
			.eq("creator", creatorId)
			.order("timestamp", { ascending: false });

		if (error) {
			// console.log(error);
			throw new Error(error.message);
		}
		return notes as Note[];
	} catch (error) {
		// console.log(error);
		// console.log(error);
		throw new Error("Failed to fetch notes");
	}
};

export const updateNote: UpdateNoteFn = async (noteId, newNote) => {
	try {
		const { data, error } = await supabase
			.from("notes")
			.update({
				...newNote,
				timestamp: new Date().toISOString(),
			})
			.eq("id", noteId)
			.single();

		if (error) {
			throw error;
		}

		return data;
	} catch (error) {
		// console.log(error);
		throw new Error("Updation Failed");
	}
};

export const deleteNote = async (noteId: string) => {
	try {
		const { data, error } = await supabase
			.from("notes")
			.delete()
			.eq("id", noteId);

		if (error) {
			throw error;
		}

		return data;
	} catch (error) {
		// console.log(error);
		throw new Error("Deletion Failed");
	}
};

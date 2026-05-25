import type React from "react";
import { type MouseEventHandler, useState, createContext } from "react";
import Note from "./Note";
import { IoAddOutline } from "react-icons/io5";
import { Oval } from "react-loader-spinner";
import type { DeleteMutation, Note as NoteType, NotesContextValue, UpdateNoteFn } from "@/types/Note";
import { Box, Button } from "@mantine/core";

export const NotesContext = createContext<NotesContextValue | undefined>(undefined);

type NoteListProps = {
	addingNote: boolean;
	notes?: NoteType[];
	addNote: MouseEventHandler;
	deleteNote: DeleteMutation;
	updateNote: UpdateNoteFn;
};

const NotesList: React.FC<NoteListProps> = ({
	addingNote,
	addNote,
	notes,
	updateNote,
	deleteNote,
}) => {
	const [_, setSelectedId] = useState<string | null>(null);
	return (
		<NotesContext.Provider value={{ addingNote, addNote, updateNote, deleteNote }}>
			<Box
				component="section"
				style={{
					display: "grid",
					gap: "1.5rem",
					gridTemplateColumns: "repeat(auto-fill, minmax(min(18rem, 100%), 1fr))",
					padding: "1.5rem",
					justifyItems: "center",
					overflow: "visible",
				}}
			>
				{notes?.map((note) => {
					return (
						<Note
							key={note.id}
							active={note.active ?? false}
							title={note.note_title}
							content={note.note_content}
							fsId={note.id}
							color={note.color}
							setSelectedId={setSelectedId}
						/>
					);
				})}

				<Button
					disabled={addingNote}
					onClick={addNote}
					variant="filled"
					radius="10px"
					style={{
						display: "flex",
						width: "4rem",
						height: "3rem",
						position: "fixed",
						justifyContent: "center",
						alignItems: "center",
						bottom: "10%",
						right: "5%",
						border: "1px solid var(--weak-border)",
						zIndex: 2,
					}}
				>
					{addingNote ? (
						<Oval
							height={30}
							width={30}
							visible={true}
							ariaLabel="oval-loading"
							secondaryColor="gray"
							strokeWidth={2}
							strokeWidthSecondary={2}
						/>
					) : (
						<IoAddOutline size={25} color="var(--color-primary-100)" />
					)}
				</Button>
			</Box>
		</NotesContext.Provider>
	);
};

export default NotesList;

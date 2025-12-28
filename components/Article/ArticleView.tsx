
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Note, NotesContextValue, NoteContextType } from "@/types/Note";
import { updateNote, deleteNote } from "@/utils/supabase/db_operations";
import { NotesContext } from "@/components/Home/components/NotesList";
import { NoteContext } from "@/components/Home/components/Note";
import ArticleTiptap from "./ArticleTiptap";
import styles from "./article_view.module.scss";

type ArticleViewProps = {
	note: Note;
};

const ArticleView: React.FC<ArticleViewProps> = ({ note }) => {
	const router = useRouter();
	const [title, setTitle] = useState(note.note_title);
	const [color, setColor] = useState(note.color);
	const [editMode, setEditMode] = useState(true);

	const notesContextValue: NotesContextValue = {
		addingNote: false,
		addNote: () => {}, 
		updateNote: updateNote,
		deleteNote: deleteNote,
	};

	const noteContextValue: NoteContextType = {
		note_title: title,
		content: note.note_content,
		editMode: editMode,
		fsId: note.id,
		color: color,
		setEditMode: setEditMode,
		setColor: (newColor: string) => {
			setColor(newColor);
			updateNote(note.id, { color: newColor });
		},
	};
    
    useEffect(() => {
        const handler = setTimeout(() => {
            if (title !== note.note_title) {
                updateNote(note.id, { note_title: title });
            }
        }, 1000);
        return () => clearTimeout(handler);
    }, [title, note.id, note.note_title]);

	return (
		<NotesContext.Provider value={notesContextValue}>
			<NoteContext.Provider value={noteContextValue}>
				<div className={styles.article_container} style={{ '--note-bg': color } as React.CSSProperties}>
                    <div className={styles.header}>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.title_input}
                            placeholder="Untitled"
                        />
                    </div>
					<div className={styles.editor_wrapper}>
						<ArticleTiptap />
					</div>
				</div>
			</NoteContext.Provider>
		</NotesContext.Provider>
	);
};

export default ArticleView;

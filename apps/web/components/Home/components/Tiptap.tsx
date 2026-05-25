import React, { useState, useEffect, useContext } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import FloatingMenu from "./minorComponents/FloatingMenu";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Placeholder } from "@tiptap/extension-placeholder";
import FloatingMenuExtension from "@tiptap/extension-floating-menu";
import useStore from "../../../hooks/useStore";
import CustomImageExtension from "./extensions/resizableImage/ImageExtension";
import CopyToClipboardExtension from "./extensions/CopyToClipboard/CopyToClipboardExtension";
import { NoteContextType, NotesContextValue } from "@/types/Note";
import { CustomStyle } from "@/types/Styles";
import BottomMenu from "./BottomMenu";
import { NotesContext } from "./NotesList";
import { NoteContext } from "./Note";

type TiptapProps = {
	style?: CustomStyle;
};

const Tiptap: React.FC<TiptapProps> = ({ style }) => {
	const { updateNote } = useContext(NotesContext) as NotesContextValue;
	const { editMode, content, fsId } = useContext(NoteContext) as NoteContextType;
	const updateSync = useStore((state) => state.updateSync);
	const [noteContent, setNoteContent] = useState(content);
	const editor = useEditor({
		editorProps: {
			attributes: {
				class: "ProseMirror",
			},
		},
		immediatelyRender: false,
		extensions: [
			StarterKit,
			TaskList,
			TaskItem.configure({
				nested: true,
			}),
			Placeholder.configure({
				showOnlyWhenEditable: false,
			}),
			FloatingMenuExtension,
			CustomImageExtension,
			CopyToClipboardExtension,
		],
		editable: false,
		content: JSON.parse(noteContent),
		onUpdate: ({ editor }) => {
			setNoteContent(JSON.stringify(editor.getJSON()));
		},
	});

	useEffect(() => {
		if (editor && !editor.isDestroyed) {
			if (editMode) {
				editor.setEditable(true);
			} else {
				editor.setEditable(false);
			}
		}
	}, [editMode, editor]);

	// debounce logic to save notes
	useEffect(() => {
		if (noteContent !== content) updateSync(true);
		const handler = setTimeout(() => {
			if (editor && !editor.isDestroyed && noteContent !== content) {
				const syncNote = async () => {
					await updateNote(fsId, {
						note_content: JSON.stringify(editor.getJSON()),
					});
				};
				syncNote();
				updateSync(false);
			}
		}, 3000);
		return () => {
			clearTimeout(handler);
		};
	}, [noteContent, content, updateSync, editor, fsId, updateNote]);

	return (
		<>
			<FloatingMenu editor={editor} />
			<EditorContent style={style} className="tiptap-editor" editor={editor} />
			<BottomMenu editor={editor} />
		</>
	);
};

export default Tiptap;

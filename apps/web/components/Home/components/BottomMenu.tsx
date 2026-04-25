import {
	type EventHandler,
	type SyntheticEvent,
	memo,
	useContext,
	useState,
} from "react";
import { useRouter } from "next/router";
import styles from "../styles/note.module.scss";
import button from "@/components/Common/styles/button.module.scss";
import { FiEdit3, FiFileText } from "react-icons/fi";
// import { TbPinned } from "react-icons/tb";
import { BiCheck, BiCopy } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import ColorMenu from "@/components/Common/ColorMenu";
import { clsx } from "clsx";
import type { NoteContextType, NotesContextValue } from "@/types/Note";
import Button from "@/components/Common/Button";
import { NoteContext } from "./Note";
import { NotesContext } from "./NotesList";
import type { Editor } from "@tiptap/react";

type BottomMenuProps = {
	// setEditMode: (flag: boolean) => void;
	// active: boolean;
	// fsId: string;
	// setColor: (colorIndex: number) => void;
	// theme: string;
	// deleteNote: DeleteMutation;
	// isDeleting?: boolean;
	editor: Editor | null;
};

const BottomMenu = memo(function BottomMenu({
	editor,
}: BottomMenuProps): JSX.Element {
	const { deleteNote } = useContext(NotesContext) as NotesContextValue;
	const { editMode, fsId, setEditMode, setColor } = useContext(
		NoteContext,
	) as NoteContextType;
	const router = useRouter();
	// Safety check for router
	const pathname = router?.pathname || "";
	const isArticle = pathname.includes("/articles/");
	const [copying, setCopying] = useState<boolean>(false);
	const handleDelete: EventHandler<SyntheticEvent> = async (e) => {
		const confirm = window.confirm(
			"Are you sure you want to delete this note?",
		);
		if (confirm) {
			deleteNote(fsId);
		}
		e.stopPropagation();
	};

	const handleCopy: EventHandler<SyntheticEvent> = (e) => {
		setCopying(true);
		editor?.chain().copyToClipboard();
		setTimeout(() => {
			setCopying(false);
		}, 500);
		e.stopPropagation();
	};

	return (
		// todo: update theme change to css var change

		<div
			style={editMode ? { opacity: 1 } : {}}
			className={clsx(styles.toolbar, styles.dark_toolbar && true)}
		>
			{/* TODO: add it back after article */}
			{/* <ColorMenu setColor={setColor} /> */}
			<Button
				title="copy note content"
				onClick={handleCopy}
				variant="subtle"
				color="gray"
				style={copying ? { background: "green" } : {}}
				className={button.toolbar_button}
			>
				{copying ? (
					<BiCheck style={{ backgroundColor: "green" }} />
				) : (
					<BiCopy />
				)}
			</Button>
			<Button
				title="delete note"
				onClick={handleDelete}
				variant="subtle"
				color="gray"
				className={button.toolbar_button}
			>
				<MdOutlineDelete />
			</Button>
			{editMode && (
				<>
					{!isArticle && (
						<Button
							title="Convert to Article"
							onClick={async () => {
								if (window.confirm("Convert to long-form Article? This cannot be undone.")) {
									const { updateNote } = await import("@/utils/supabase/db_operations");
									await updateNote(fsId, { article: true });
									router.push(`/articles/${fsId}`);
								}
							}}
							variant="subtle"
							color="gray"
							className={button.toolbar_button}
						>
							<FiFileText />
						</Button>
					)}

				</>
			)}
		</div>
	);
});

export default BottomMenu;

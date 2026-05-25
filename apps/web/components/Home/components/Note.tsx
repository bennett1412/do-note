import type React from "react";
import { useRef, useEffect, useState, useContext, createContext } from "react";
import Tiptap from "./Tiptap";
import { IoClose } from "react-use/lib/react-use"; // wait, the original used IoClose from react-icons/io5, let's keep that!
import { IoClose as IoCloseIcon } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import type { NoteContextType, NotesContextValue } from "@/types/Note";
import { NotesContext } from "./NotesList";
import Backdrop from "./Backdrop";
import { ActionIcon } from "@mantine/core";

type NoteProps = {
	title: string;
	content: string;
	active: boolean;
	fsId: string;
	color: string;
	setSelectedId: (id: string | null) => void;
};

export const NoteContext = createContext<NoteContextType | undefined>(
	undefined,
);

const Note: React.FC<NoteProps> = ({
	title: note_title,
	content,
	active,
	fsId,
	color: noteColor,
	setSelectedId,
}) => {
	const { updateNote } = useContext(NotesContext) as NotesContextValue;
	const [editMode, setEditMode] = useState<boolean>(active);
	const [title, setTitle] = useState<string>(note_title);
	const [color, setColor] = useState<string>(
		noteColor ?? "var(--note-bg-dark-4)",
	);
	const ref = useRef<HTMLInputElement | null>(null);
	const noteRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const titleHandler = setTimeout(() => {
			if (title !== "" && title !== note_title) {
				updateNote(fsId, {
					note_title: title,
				});
			}
		}, 3000);
		return () => {
			clearTimeout(titleHandler);
		};
	}, [fsId, title, note_title, updateNote]);

	useEffect(() => {
		if (color !== noteColor) {
			updateNote(fsId, {
				color: color,
			});
		}
	}, [noteColor, color, fsId, updateNote]);

	const closeNote = () => {
		setEditMode(false);
		setSelectedId(null);
	};

	useEffect(() => {
		if (noteRef.current && editMode) noteRef.current.style.zIndex = "3";
	}, [editMode]);

	const handleClick = () => {
		if (!editMode) {
			setEditMode(true);
			setSelectedId(fsId);
		}
	};

	const isNoteDarkThemed = (color: string): boolean => {
		return /dark/i.test(color);
	};

	const handleAnimationComplete = () => {
		if (noteRef.current && editMode === false) {
			noteRef.current.style.zIndex = "0";
		}
	};

	const activeStyle: React.CSSProperties = editMode
		? {
				width: "70vw",
				height: "70vh",
				position: "fixed",
				margin: "auto",
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				boxShadow: "0px 0px 15px 5px rgba(0, 0, 0, 0.4)",
				maxWidth: "800px",
				maxHeight: "600px",
		  }
		: {
				boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.2)",
		  };

	return (
		<NoteContext.Provider
			value={{
				note_title,
				content,
				editMode,
				fsId,
				color,
				setEditMode,
				setColor,
			}}
		>
			<motion.div
				layout="position"
				style={{
					height: "15rem",
					width: "18rem",
					borderRadius: "10px",
					display: "flex",
					overflow: "visible",
				}}
			>
				<AnimatePresence
					initial={false}
					onExitComplete={() => null}
				>
					{editMode && <Backdrop key={fsId} onClick={closeNote} />}
					<motion.div
						ref={noteRef}
						layout
						style={{
							flex: 1,
							overflow: "hidden",
							border: isNoteDarkThemed(color)
								? "1px solid var(--color-surface-200, #232524)"
								: "1px solid var(--color-surface-200, #232524)",
							borderRadius: "10px",
							padding: "0.8rem",
							backgroundColor: color,
							color: isNoteDarkThemed(color)
								? "var(--color-primary-100, #eff2f1)"
								: "var(--color-surface-100, #0b0e0d)",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							transition: "background-color 0.2s, color 0.2s",
							fontFamily: '"Fira Mono", monospace',
							zIndex: 0,
							...activeStyle,
						}}
						whileHover={!editMode ? {
							boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
							transform: "scale(1.02)",
						} : {}}
						id={fsId}
						layoutId={fsId}
						onLayoutAnimationComplete={handleAnimationComplete}
						layoutDependency={editMode}
					>
						<motion.div
							style={{
								flexGrow: 1,
								overflowY: editMode ? "auto" : "hidden",
								position: "relative",
							}}
							layout="position"
							onClick={handleClick}
						>
							<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
								{(title !== "" || editMode) && (
									<input
										ref={ref}
										disabled={!editMode}
										defaultValue={title}
										placeholder="Enter Title"
										style={{
											fontSize: "1.25rem",
											fontWeight: 700,
											width: "100%",
											outline: "none",
											border: "none",
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
											marginBottom: "0.5rem",
											transition: "background-color 0.2s, color 0.2s",
											color: "inherit",
											background: "transparent",
										}}
										type="text"
										onChange={(e) => setTitle(e.target.value)}
									/>
								)}
								{editMode && (
									<ActionIcon
										onClick={(e) => {
											e.stopPropagation();
											closeNote();
										}}
										variant="subtle"
										color={isNoteDarkThemed(color) ? "white" : "gray"}
										radius="md"
										size="lg"
									>
										<IoCloseIcon size={24} />
									</ActionIcon>
								)}
							</div>
							<Tiptap />
						</motion.div>
					</motion.div>
				</AnimatePresence>
			</motion.div>
		</NoteContext.Provider>
	);
};

export default Note;

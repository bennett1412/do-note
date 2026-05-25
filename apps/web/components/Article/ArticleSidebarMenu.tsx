
import React, { memo, useContext, useState } from "react";
import { Editor } from "@tiptap/react";
import { UnstyledButton, Tooltip, Stack, Box } from "@mantine/core";
import { BiCopy, BiCheck } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { useRouter } from "next/router";
import { NotesContext } from "@/components/Home/components/NotesList";
import { NoteContext } from "@/components/Home/components/Note";
import { NotesContextValue, NoteContextType } from "@/types/Note";

type Props = {
	editor: Editor | null;
};

const ArticleSidebarMenu: React.FC<Props> = ({ editor }) => {
	const router = useRouter();
	const { deleteNote } = useContext(NotesContext) as NotesContextValue;
	const { fsId } = useContext(NoteContext) as NoteContextType;
	const [copying, setCopying] = useState(false);

	const handleCopy = () => {
		setCopying(true);
		editor?.chain().focus().copyToClipboard().run();
		setTimeout(() => setCopying(false), 2000);
	};

	const handleDelete = () => {
		if (window.confirm("Delete this article?")) {
			deleteNote(fsId);
			router.push("/notes");
		}
	};

	return (
		<Box
			pos="fixed"
			right={20}
			top="50%"
			p={8}
			bg="surface.1"
			style={{
				transform: "translateY(-50%)",
				zIndex: 100,
				border: "1px solid var(--color-surface-300)",
				borderRadius: "12px",
				boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
			}}
		>
			<Stack gap="xs">
				<Tooltip label="Back to Notes" position="left" withArrow>
					<UnstyledButton
						w={40}
						h={40}
						display="flex"
						c="var(--color-primary-100)"
						style={{
							alignItems: "center",
							justifyContent: "center",
							borderRadius: "8px",
							transition: "all 0.2s ease",
							cursor: "pointer",
						}}
						styles={{
							root: {
								"&:hover": {
									backgroundColor: "var(--color-surface-300)",
									transform: "scale(1.05)",
								},
							},
						}}
						onClick={() => router.push("/notes")}
					>
						<FiHome size={20} />
					</UnstyledButton>
				</Tooltip>

				<Tooltip label={copying ? "Copied!" : "Copy Content"} position="left" withArrow>
					<UnstyledButton
						w={40}
						h={40}
						display="flex"
						c="var(--color-primary-100)"
						style={{
							alignItems: "center",
							justifyContent: "center",
							borderRadius: "8px",
							transition: "all 0.2s ease",
							cursor: "pointer",
						}}
						styles={{
							root: {
								"&:hover": {
									backgroundColor: "var(--color-surface-300)",
									transform: "scale(1.05)",
								},
							},
						}}
						onClick={handleCopy}
					>
						{copying ? <BiCheck size={20} color="#40C057" /> : <BiCopy size={20} />}
					</UnstyledButton>
				</Tooltip>

				<Tooltip label="Delete Article" position="left" withArrow>
					<UnstyledButton
						w={40}
						h={40}
						display="flex"
						c="var(--color-primary-100)"
						style={{
							alignItems: "center",
							justifyContent: "center",
							borderRadius: "8px",
							transition: "all 0.2s ease",
							cursor: "pointer",
						}}
						styles={{
							root: {
								"&:hover": {
									backgroundColor: "var(--color-surface-300)",
									transform: "scale(1.05)",
								},
							},
						}}
						onClick={handleDelete}
					>
						<MdOutlineDelete size={20} />
					</UnstyledButton>
				</Tooltip>
			</Stack>
		</Box>
	);
};

export default memo(ArticleSidebarMenu);

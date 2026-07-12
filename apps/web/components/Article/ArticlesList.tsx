import React from "react";
import Link from "next/link";
import { Card, Text, Title, Stack, Group, Badge, SimpleGrid } from "@mantine/core";
import { Note as NoteType } from "@/types/Note";

type ArticlesListProps = {
  articles: NoteType[];
};

const ArticlesList: React.FC<ArticlesListProps> = ({ articles }) => {
	return (
		<SimpleGrid
			cols={{ base: 1, sm: 2, lg: 3 }}
			spacing="xl"
			p="xl"
		>
			{articles.map((article) => (
				<Link href={`/articles/${article.id}`} key={article.id} style={{ textDecoration: "none" }}>
					<Card
						shadow="sm"
						padding="lg"
						radius="md"
						withBorder
						bg="surface.1"
						style={{
							borderColor: "var(--color-surface-300)",
							transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
							cursor: "pointer",
						}}
						styles={{
							root: {
								"&:hover": {
									transform: "translateY(-5px)",
									boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
									backgroundColor: "var(--color-surface-300)",
								},
							},
						}}
					>
						<Stack gap="xs">
							<Title
								order={3}
								style={{ color: "var(--color-primary-100)" }}
							>
								{article.note_title || "Untitled Article"}
							</Title>
							<Text lineClamp={3} size="sm" c="dimmed">
								Content preview...
							</Text>
							<Group justify="space-between" mt="md">
								<Text size="xs" c="dimmed">
									{new Date(article.timestamp as unknown as string).toLocaleDateString()}
								</Text>
								<Badge variant="light" color="blue">Article</Badge>
							</Group>
						</Stack>
					</Card>
				</Link>
			))}
		</SimpleGrid>
	);
};

export default ArticlesList;

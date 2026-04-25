
import React from "react";
import Link from "next/link";
import { Card, Text, Title, Stack, Group, Badge } from "@mantine/core";
import { Note as NoteType } from "@/types/Note";
import styles from "./articles_list.module.scss";

type ArticlesListProps = {
  articles: NoteType[];
};

const ArticlesList: React.FC<ArticlesListProps> = ({ articles }) => {
  return (
    <div className={styles.articles_grid}>
      {articles.map((article) => (
        <Link href={`/articles/${article.id}`} key={article.id} style={{ textDecoration: 'none' }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder className={styles.article_card}>
            <Stack gap="xs">
              <Title order={3} className={styles.article_title}>
                {article.note_title || "Untitled Article"}
              </Title>
              <Text lineClamp={3} size="sm" c="dimmed">
                {/* We'd need to parse Tiptap JSON to show a plain text preview properly */}
                {/* For now, just showing a placeholder or the raw content if it's short */}
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
    </div>
  );
};

export default ArticlesList;

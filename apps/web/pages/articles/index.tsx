
import React from "react";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/utils/supabase/db_operations";
import { useSession } from "@/hooks/useSession";
import ArticlesList from "@/components/Article/ArticlesList";
import { DotsLoader } from "@/components/Common/Loader";
import { Center, Title, Stack, Container } from "@mantine/core";

const ArticlesIndex = () => {
    const { user } = useSession();
    const { data: articles, isLoading, error } = useQuery({
        queryKey: ["articles", user?.id],
        queryFn: () => getArticles(user?.id || null),
        enabled: !!user?.id,
    });

    if (isLoading) return <DotsLoader />;

    if (error) return (
        <Center h="100vh">
            <Title order={2} c="red">Error loading articles</Title>
        </Center>
    );

    return (
        <Container size="xl" py="xl">
            <Head>
                <title>My Articles | DoNote</title>
            </Head>
            <Stack gap="xl">
                <Title order={1} c="primary.0">My Articles</Title>
                {articles && articles.length > 0 ? (
                    <ArticlesList articles={articles} />
                ) : (
                    <Center py="xl">
                        <Title order={3} c="dimmed">No articles yet. Convert a note to an article to see it here!</Title>
                    </Center>
                )}
            </Stack>
        </Container>
    );
};

export default ArticlesIndex;

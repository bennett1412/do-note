
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import ArticleView from "@/components/Article/ArticleView";
import useGetNote from "@/hooks/useGetNote";
import { DotsLoader } from "@/components/Common/Loader";
import styles from "./styles/article_page.module.scss"; // Placeholder for page specific styles
import Head from "next/head";
import Button from "@/components/Common/Button";

const ArticlePage = () => {
    const router = useRouter();
    const { id } = router.query;
    
    // Ensure id is a string
    const noteId = typeof id === 'string' ? id : null;

    const { data: note, isLoading, error } = useGetNote(noteId);

    if (isLoading) {
        return (
            <div className={styles.loading_container}>
                <DotsLoader />
            </div>
        );
    }

    if (error || !note) {
        return (
            <div className={styles.error_container}>
                <h1>Note not found</h1>
                <Button onClick={() => router.push('/')}>Go Home</Button>
            </div>
        );
    }
    
    return (
        <>
            <Head>
                <title>{note.note_title || "Untitled Article"}</title>
            </Head>
            <ArticleView note={note} />
        </>
    );
};

export default ArticlePage;

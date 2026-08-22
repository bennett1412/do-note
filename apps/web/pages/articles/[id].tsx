import React from "react";
import { useRouter } from "next/router";
import ArticleView from "@/components/Article/ArticleView";
import useGetNote from "@/hooks/useGetNote";
import { DotsLoader } from "@/components/Common/Loader";
import styles from "./styles/article_page.module.scss";
import Head from "next/head";
import { Button } from "@mantine/core";

const ArticlePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const noteId = typeof id === "string" ? Number(id) : null;

  const { data: note, isLoading, error } = useGetNote(noteId);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Untitled Article</title>
        </Head>
        <DotsLoader />
      </>
    );
  }

  if (error || !note) {
    return (
      <div className={styles.error_container}>
        <h1>Note not found</h1>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{note.noteTitle || "Untitled Article"}</title>
      </Head>
      <ArticleView note={note} />
    </>
  );
};

export default ArticlePage;

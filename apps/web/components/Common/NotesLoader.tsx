import React from "react";
import ContentLoader from "react-content-loader";

const StickyNoteLoader: React.FC = () => (
  <ContentLoader
    speed={2}
    width={"80%"}
    height={"100%"}
    viewBox="0 0 35% 35%"
    backgroundColor="#f3f3f3"
    foregroundColor="#e0e0e0"
    // {...props}
  >
    <rect x="10" y="10" rx="3" ry="3" width="100%" height="15" />
    <rect x="10" y="35" rx="3" ry="3" width="100%" height="100" />
  </ContentLoader>
);

const NotesLoader = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(18rem, 100%), 1fr))",
        gap: "1rem",
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 9].map((i) => {
        return <StickyNoteLoader key={i} />;
      })}
    </div>
  );
};

export default NotesLoader;

import React from "react";
import "../../../../styles/home/tags.scss";
const Tags = ({ tags = ["books", "coding"] }) => {
  return (
    <div className="tag-container">
      {tags.map((tag, i) => {
        return <div key={i} className="tag-item">{tag}</div>;
      })}
    </div>
  );
};

export default Tags;

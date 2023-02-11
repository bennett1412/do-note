import React from "react";
import "../../../styles/home/tagbar.scss";
const Tagbar = () => {
  const tags = ["coding", "cooking", "books", "free time"];
  return (
    <section className="tagbar">
      <div className="tags-container">
        {tags.map((ele, i) => {
          return (
            <button key={i} className="tag-item">
              {ele}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Tagbar;

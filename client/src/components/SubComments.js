import { Fragment, useEffect, useState } from "react";

export default function SubComments({ subComments = [] }) {
  const [viewSubComments, setViewSubComments] = useState(false);

  const allSubComments = subComments.map((subComment) => {
    return subComment.id ? (
      <div key={subComment.id + "subCm"} className="subComment">
        {subComment.body}
      </div>
    ) : null;
  });


  const subCommentsRender = () => {
    if (allSubComments.length) {
      return viewSubComments ? (
        allSubComments
      ) : (
        <button onClick={() => setViewSubComments(true)}>View More</button>
      );
    }
    return null;
  };

  return <Fragment>{subCommentsRender()}</Fragment>;
}

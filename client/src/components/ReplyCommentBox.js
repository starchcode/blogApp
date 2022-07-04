import { useState } from "react";
import { useParams } from "react-router-dom";
import server from "../utils/server";

import Comment from "./Comment";

export default function ReplyCommentBox({
  setReplying,
  comment,
  subComments,
  setSubComments,
}) {
  const [body, setBody] = useState("");
  const params = useParams();


  const postComment = async () => {
    const response = await server.post("/comments", {
      post_id: params.postId,
      body: body,
      parent_comment_id: comment.id,
    });
    if (response.status === 201) {
      setReplying(false);
      setSubComments(
        subComments.concat([
          <Comment
            key={response.data.comment.id + "subcm"}
            isSub={true}
            comment={response.data.comment}
          />,
        ])
      );
    }
  };

  const saveHandler = () => {
    // console.log(comment.id, comment.body)
    if (!body) return null;

    postComment();
  };
  return (
    <div>
      <input
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button onClick={() => saveHandler()}>save</button>
      <button onClick={() => setReplying(false)}>cancel</button>
    </div>
  );
}

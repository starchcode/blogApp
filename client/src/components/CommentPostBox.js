import server from "../utils/server";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function CommentPostBox({
  setComments,
  comments,
}) {
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const params = useParams();

  const postComment = async () => {
    const response = await server.post("/comments", {
      post_id: params.postId,
      body: body,
    });
    if (response.status === 201) {
      setComments([response.data.comment].concat(comments));
    }
  };

  const submitHandle = (e) => {
    e.preventDefault();
    if (!body) {
      setError("Body is missing!");
    } else {
      setError(null);
      return postComment();
    }
  };

  return (
    <div>
      <form onSubmit={submitHandle}>
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button>Comment</button>
      </form>
    </div>
  );
}

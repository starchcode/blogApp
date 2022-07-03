import { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import server from "../utils/server";
import SubComments from "./SubComments";

export default function CommentBox() {
  const [comments, setComments] = useState(null);
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const fetchComments = async (pageNum) => {
    const getComments = await server.get(
      "/comments/" + params.postId + "?page=" + pageNum
    );
    setCommentsTotalPages(getComments.data.totalPages);
    console.log(comments);
    if (Array.isArray(comments)) {
      return setComments(comments.concat(getComments.data.comments));
    }
    setComments(getComments.data.comments);
  };

  useEffect(() => {
    fetchComments(currentPage).catch((e) => {
      console.log(e);
    });
  }, [currentPage]);

  const commentBoxRender = () => {
    if (comments === null) return "Loading...";
    if (commentsTotalPages === 0 ) return "There is no comments for this post!";

    return comments.map((comment) => {
      return (
        <div key={comment.id + "cm"} className="commentContainer">
          <div className="commentBox">
            {comment.body}
            {/* {subCommentsRender.length ? <div>view more</div> : null} */}
            {/* {subCommentsRender} */}
            <SubComments subComments={comment.subComments} />
          </div>
        </div>
      );
    });
  };

  const viewMoreComments = () => {
    const viewHandle = () => {
      currentPage < commentsTotalPages && setCurrentPage(currentPage + 1);
    };
    return (
      <div>
        <button onClick={viewHandle}>view more</button>
      </div>
    );
  };

  
  const postComment = async () => {
    const response = await server.post("/comments", {
      post_id: params.postId,
      body: body,
    });
    if (response.status === 201) {
      setCommentsTotalPages(commentsTotalPages || 1);
      setComments([response.data.comment].concat(comments));
    }
  };

  const commentPostBox = () => {
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
  };

  return (
    <Fragment>
      {commentBoxRender()}
      {commentsTotalPages > 1 &&
        currentPage < commentsTotalPages &&
        viewMoreComments()}
      {commentPostBox()}
    </Fragment>
  );
}

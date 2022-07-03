import { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import server from "../utils/server";
import CommentPostBox from "./CommentPostBox";
import SubComments from "./SubComments";
import ViewMoreBtn from "./ViewMoreBtn";

export default function CommentBox() {
  const [comments, setComments] = useState(null);
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const params = useParams();

  const fetchComments = async (pageNum) => {
    const getComments = await server.get(
      "/comments/" + params.postId + "?page=" + pageNum
    );
    setCommentsTotalPages(getComments.data.totalPages);
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



  
  return (
    <Fragment>
      {commentBoxRender()}
      {commentsTotalPages > 1 &&
        currentPage < commentsTotalPages &&
        <ViewMoreBtn currentPage={currentPage} commentsTotalPages={commentsTotalPages} setCurrentPage={setCurrentPage}/>}
      <CommentPostBox setComments={setComments} setCommentsTotalPages={setCommentsTotalPages} commentsTotalPages={commentsTotalPages} comments={comments}/>
    </Fragment>
  );
}

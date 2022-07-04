import { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import server from "../utils/server";
import CommentPostBox from "./CommentPostBox";
import ViewMoreBtn from "./ViewMoreBtn";
import Comment from "./Comment";
export default function CommentBox() {
  const [comments, setComments] = useState(null);
  const [commentsTotalPages, setCommentsTotalPages] = useState(1);
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
    // if (!commentsTotalPages) setCommentsTotalPages(1);
    setComments(getComments.data.comments);

  };

  useEffect(() => {
    fetchComments(currentPage).catch((e) => {
    });
  }, [currentPage]);


  const commentBoxRender = () => {
    if (comments === null) return "Loading...";
   
    return comments.map((comment) => {
      let allSubComments
      if(comment.subComments){
      allSubComments = comment.subComments.map((subComment) => {
      if(!subComment) return null;
        return  <Comment key={subComment.id + "subcm"} comment={subComment} isSub={true} />
      });
    }
      return (
      <Comment key={comment.id + "cm"} comment={comment} >
        {allSubComments}
      </Comment>
      );
    });
  };
console.log(commentsTotalPages);
  return (
    <Fragment>
      {commentBoxRender()}
      {commentsTotalPages > 1 && currentPage < commentsTotalPages && (
        <ViewMoreBtn
          currentPage={currentPage}
          commentsTotalPages={commentsTotalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
      <CommentPostBox
        setComments={setComments}
        comments={comments}
      />
    </Fragment>
  );
}

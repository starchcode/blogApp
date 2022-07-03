import { useState, useEffect, Fragment} from "react";
import { useParams } from "react-router-dom";
import server from "../utils/server";
import SubComments from "./SubComments";

export default function CommentBox () {
  const [comments, setComments] = useState(null);
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  let params = useParams();


  const fetchComments = async (pageNum) => {
    const getComments = await server.get("/comments/" + params.postId +"?page=" + pageNum );
    setCommentsTotalPages(getComments.data.totalPages);
    console.log(comments)
    if(Array.isArray(comments)){
     return setComments(comments.concat(getComments.data.comments));
    }
        setComments(getComments.data.comments);
  };

  useEffect(() => {
    fetchComments(currentPage).catch(e => {
        console.log(e)
    });
  }, [currentPage]);


  const commentBoxRender = () => {
    if (comments === null) return "Loading...";
    if (commentsTotalPages=== 0) return "There is no comments for this post!";

    return comments.map((comment) => {
      // const subCommentsRender = comment.subComments.map((subComment) => {
      //   return subComment.id ? (
      //     <div key={subComment.id + "subCm"} className="subComment">
      //       {subComment.body}
      //     </div>
      //   ) : null;
      // });



      return (
        <div key={comment.id + "cm"} className="commentContainer">
          <div className="commentBox">
            {comment.body}
            {/* {subCommentsRender.length ? <div>view more</div> : null} */}
            {/* {subCommentsRender} */}
            <SubComments subComments={comment.subComments}/>
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


  return (
    <Fragment>
      {commentBoxRender()}
      {commentsTotalPages > 1 && currentPage < commentsTotalPages && viewMoreComments()}
    </Fragment>
  );
};

// import "./styles.css";
import { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import server from "../utils/server";

export default function PostDetails({ posts }) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState("");
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



  const editHandle = () => {
    setEditing(true);
    setBody(body || thisPagePost.body);
  };

  const handleSave = () => {
    // 1 make an api call
    // 2 recieve response
    // 3A if successful nothing to be done
    //    setEditing to true
    setEditing(false);

    // 3A if unsuccessful setBody do not setEditing to False
    // show error message
    // setBody(body)
  };

  const bodyRender = (bodyContent) => {
    if (editing) {
      return (
        <textarea
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      );
    }
    return <p>{bodyContent}</p>;
  };

  const buttonsRender = () => {
    if (editing) {
      return (
        <Fragment>
          <button onClick={() => handleSave()}>Save</button>
          <button>Cancel</button>
        </Fragment>
      );
    }
    return <button onClick={() => editHandle()}>Edit</button>;
  };

  const commentBoxRender = () => {
    if (comments === null) return "There is no comments for this post!";

    return comments.map((comment) => {
      const subCommentsRender = comment.subComments.map((subComment) => {
        return subComment.id ? (
          <div key={subComment.id + "subCm"} className="subComment">
            {subComment.body}
          </div>
        ) : null;
      });

      return (
        <div key={comment.id + "cm"} className="commentContainer">
          <div className="commentBox">
            {comment.body}
            {subCommentsRender}
          </div>
        </div>
      );
    });
  };

  const viewMoreComments = () => {
    const viewHandle = () => {
      currentPage < commentsTotalPages && setCurrentPage(currentPage + 1);
    }
    return (
      <div>
        <button onClick={viewHandle}>view more</button>
      </div>
    )
  }

  if (posts === null) return <div>Loading...</div>;
  const thisPagePost = posts.find((post) => post.id == params.postId);
  if (!thisPagePost){
    console.log("Make a 'GET: /post/:postId' ensure it really does not exist!")
    return <div>such post does not exist</div>;
  } 
    

  return (
    <div className="dataContainer inDetail">
      <div className="postBox">
        <h1>{thisPagePost.title} </h1>
        {bodyRender(body || thisPagePost.body)}
      </div>
      {buttonsRender()}
      {commentBoxRender()}
      {commentsTotalPages > 1 && currentPage < commentsTotalPages && viewMoreComments()}
    </div>
  );
}

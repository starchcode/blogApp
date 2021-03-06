import CommentBtns from "./CommentBtns";
import { useEffect, useState } from "react";
import EditBtns from "./EditBtns";
import ReplyCommentBox from "./ReplyCommentBox";

export default function Comment({ comment, children, isSub }) {
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);
  const [body, setBody] = useState(comment.body);
  const [deleted, setDeleted] = useState(false);
  const [subComments, setSubComments] = useState(children || []);
  const [viewReplies, setViewReplies] = useState(false);


  const handleView = () => {
    if(subComments.length){
      <button onClick={()=> setViewReplies(true)}>view replies</button>
    }

  }
  useEffect(() => {
    if(subComments.length) console.log(subComments)
  })

  const editHandler = () => {
    setEditing(true);
  };

  if (deleted) return null;

  return (
    <div  className="commentContainer">
      <div className={isSub? "subComment": "commentBox"}>
        {!editing ? (
          body
        ) : (
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        )}

        {editing ? null : (
          <CommentBtns
            comment={comment}
            isSub={isSub}
            editHandler={editHandler}
            setDeleted={setDeleted}
            setReplying={setReplying}
          />
        )}
        {editing ? (
          <EditBtns
            body={body}
            comment={comment}
            setEditing={setEditing}
            setBody={setBody}
          />
        ) : null}
        {replying ? (
          <ReplyCommentBox
            setReplying={setReplying}
            comment={comment}
            setSubComments={setSubComments}
            subComments={subComments}
          />
        ) : null}
        {subComments.length && !viewReplies ? <button onClick={()=> setViewReplies(true)}>view replies</button> : subComments}
      </div>
    </div>
  );
}

import CommentBtns from "./CommentBtns";
import SubComments from "./SubComments";
import { useEffect, useState } from "react";
import server from "../utils/server";
import EditBtns from "./EditBtns";
import ReplyCommentBox from "./ReplyCommentBox";

export default function Comment({ comment }) {
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);
  const [body, setBody] = useState(comment.body);
  const [deleted, setDeleted] = useState(false);
  const [subComments, setSubComments] = useState(comment.subComments || []);

  const editHandler = () => {
    setEditing(true);
  };

  if (deleted) return null;
//   if(!comment) return null;
//   if(!subComments) return null;
  return (
    <div key={comment.id + "cm"} className="commentContainer">
      <div className="commentBox">
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
        {subComments.length ? <SubComments subComments={subComments} />: null}
      </div>
    </div>
  );
}

import server from "../utils/server";

export default function CommentBtns({
  editHandler,
  comment,
  setDeleted,
  setReplying,
  isSub,
}) {
  const deleteComment = async () => {
    const deletePost = await server.delete("/comments/" + comment.id);
    if (deletePost.status === 204) {
      setDeleted(true);
    }
  };

  return (
    <div className="cm-btns">
      {!isSub ? <button onClick={() => setReplying(true)}>Reply</button> : null}
      <button onClick={() => editHandler()}>Edit</button>
      <button onClick={() => deleteComment()}>Delete</button>
    </div>
  );
}

import server from "../utils/server";

export default function CommentBtns ({editHandler, comment, setDeleted, setReplying}) {

    const deleteComment = async () => {
        console.log("clicked")
        console.log(comment.id)
        const deletePost = await server.delete("/comments/" + comment.id);
        if (deletePost.status === 204) {
            setDeleted(true);
        }
      };


      
        return (
          <div className="cm-btns">
            <button onClick={() => setReplying(true)}>Reply</button>
            <button onClick={()=> editHandler()}>Edit</button>
            <button onClick={()=> deleteComment()}>Delete</button>
          </div>
        )

}
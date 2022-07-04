import { useState } from "react"
import { useParams } from "react-router-dom";
import server
 from "../utils/server";
export default function ReplyCommentBox ({ setReplying, comment, setSubComments, subComments }) {
const [body, setBody] = useState("")
const params = useParams();

const postComment = async () => {
    const response = await server.post("/comments", {
      post_id: params.postId,
      body: body,
      parent_comment_id: comment.id
    });
    if (response.status === 201) {
        setReplying(false);
        setSubComments(subComments.concat(response.data.comment));
    }
  };

const saveHandler = () => {
    console.log(comment.id)
    if(!body) return null;

    postComment();
}
    return(
        <div>
            <input type="text" value={body} onChange={(e) => setBody(e.target.value)}/>
            <button onClick={()=> saveHandler()}>save</button>
            <button onClick={()=> setReplying(false)}>cancel</button>
        </div>
    )
}
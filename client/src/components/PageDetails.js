// import "./styles.css";
import { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import server from "../utils/server";

export default function PostDetails({ posts }) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState("");
  const [comments, setComments] = useState({});
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);

  let params = useParams();

  // useEffect(() => {
  //   console.log(posts)
  //   let body = posts.length && thisPagePost.body; // to be taken from state!
  //   setBody(body);
  //   window.scrollTo(0, 0);
  // }, [posts]);

  useEffect(() => {
    const fetchData = async () => {
      const getComments = await server.get("/comments/" + params.postId);
      setComments(getComments.data.comments)
      setCommentsTotalPages(getComments.data.totalPages);
    }

    fetchData()
      .catch(console.error);
  }, []);

  const editHandle = () => {
    setEditing(true);
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


  if(!posts.length) return <div>Loading...</div>
  const thisPagePost = posts.find((post) => post.id == params.postId);
  if (!thisPagePost) return <div>such post does not exist</div>;

  return (
    <div className="dataContainer inDetail">
      <div className="postBox">
        <h1>{thisPagePost.title} </h1>
        {bodyRender(thisPagePost.body)}
      </div>
      {buttonsRender()}
    </div>
  );
}

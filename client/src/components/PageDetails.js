// import "./styles.css";
import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

export default function PostDetails({ posts }) {
  const [editing, setEditing] = useState(false);
  let params = useParams();
  let body = "body " + params.postId; // to be taken from state!
  const [editedBody, setEditedBody] = useState(body);
  const editHandle = () => {
    setEditing(true);
  };
  const handleSave = () => {
    // 1 make an api call
    // 2 recieve response
    // 3A if successful nothing to be done
    //    setEditing to true
    setEditing(false);

    // 3A if unsuccessful setEditedBody do not setEditing to False
    // show error message
    // setEditedBody(body)
  };

  const bodyRender = () => {
    if (editing) {
      return (
        <textarea
          type="text"
          value={editedBody}
          onChange={(e) => setEditedBody(e.target.value)}
        />
      );
    }
    return <p>{editedBody}</p>;
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

  if (!posts.find((post) => post.id == params.postId))
    return <div>such post does not exist</div>;

  return (
    <div className="dataContainer inDetail">
      <div className="postBox">
        <h1>Title {params.postId} </h1>
        {bodyRender()}
      </div>
        {buttonsRender()}
    </div>
  );
}

import { useState, useEffect } from "react";

export default function NewPostPage() {
  const [title, setTitle] = useState(null);
  const [body, setBody] = useState(null);
  const [error, setError] = useState(null);

  const changeHandler = (e) => {
    let targetState = e.target.id;
    let value = e.target.value;
    if (targetState === "title") {
      setTitle(value);
    } else if (targetState === "bodyInput") {
      setBody(value);
    }
  };
  const submitHandle = (e) => {
    e.preventDefault();
    if (!title || !body) {
        setError("Title or Body is missing!")
    }else{
        setError(null);
    }
    console.log(error)
    console.log("Submited", title, body);
  };

  return (
    <form onSubmit={submitHandle}>
      <div className="form">
        <div className="title">New Blog Post</div>
        <div className="subtitle">Use this form to post a blog!</div>
        <div className="input-container ic1">
          <input
            id="title"
            className="input"
            type="text"
            placeholder="What is the title?"
            onChange={changeHandler}
          />
          <div className="cut"></div>
          <label htmlFor="title" className="placeholder">
            Title
          </label>
        </div>
        <div className="input-container ic2">
          <label htmlFor="bodyInput" className="placeholder">
            Body
          </label>

          <textarea
            id="bodyInput"
            className="input"
            type="text"
            placeholder="Type your story here..."
            onChange={changeHandler}
          ></textarea>
          {/* <input id="lastname" className="input" type="text" placeholder=" " /> */}
          {/* <div className="cut"></div> */}
        </div>
        <button type="submit" className="submit">
          submit
        </button>
        {error ? <p style={{color: 'red'}}>{error}</p> : null }
      </div>
    </form>
  );
}

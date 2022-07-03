import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ fetchPosts, currentPage }) {
    const navigate = useNavigate();

    return(
      <Fragment>
        <button onClick={async() => {
          await fetchPosts(currentPage)
          navigate("/")
          }}>HOME</button>
        <button onClick={() => navigate("/newpostpage")}>New Post</button>
      </Fragment>
    ) 
  }
  
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    return(
      <Fragment>
        <button onClick={() => navigate("/")}>HOME</button>
        <button onClick={() => navigate("/newpostpage")}>New Post</button>
      </Fragment>
    ) 
  }
  
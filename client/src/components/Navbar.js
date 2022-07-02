import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    function clickHandler() {
      navigate("/");
    }
    return <button onClick={() => clickHandler()}>HOME</button>;
  }
  
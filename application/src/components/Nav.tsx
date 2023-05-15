import { NavLink } from "react-router-dom";
import Authenticate from "./Authenticate";
import { useAuth } from "../hooks/Auth";
import "../styles/Nav.css";

const Nav = () => {
  const { session } = useAuth();

  return (
    <header>
      <div className="nav-left">
        <NavLink to={"/"} className="nav-left-item">
          Learn Lounge
        </NavLink>
        {session && (
          <NavLink to={"/sets"} className="nav-left-item">
            Sets
          </NavLink>
        )}
      </div>
      <div className="nav-right">
        <Authenticate />
      </div>
    </header>
  );
};

export default Nav;

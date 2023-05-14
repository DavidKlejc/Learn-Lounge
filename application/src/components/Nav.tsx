import { NavLink } from "react-router-dom";
import Authenticate from "../pages/Authenticate";
import { useAuth } from "../hooks/Auth";

const Nav = () => {
  const { session } = useAuth();

  return (
    <div className="navbar">
      <NavLink to={"/"} className="nav-item">
        Home
      </NavLink>
      {session && (
        <NavLink to={"/sets"} className="nav-item">
          Sets
        </NavLink>
      )}
      <Authenticate />
    </div>
  );
};

export default Nav;

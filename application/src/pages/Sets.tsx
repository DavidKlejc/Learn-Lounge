import { Outlet } from "react-router-dom";
import Authenticate from "./Authenticate";

const Sets = () => {
  return (
    <>
      <h1>Sets page</h1>
      <Authenticate />
      <Outlet />
    </>
  );
};

export default Sets;

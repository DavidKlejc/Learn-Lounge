import { Link } from "react-router-dom";
import "../styles/AddSet.css";

const AddSet = () => {
  return (
    <Link to="/create-set" className="add-set-card">
      Add Study Set
    </Link>
  );
};

export default AddSet;

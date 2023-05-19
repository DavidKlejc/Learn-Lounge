import { useNavigate } from "react-router-dom";
import "../styles/StudySet.css";

const StudySet = ({ setId, setName }: { setId: number; setName: string }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/set/${setId}`);
  };

  return (
    <div className="study-set-card" onClick={handleClick}>
      {setName}
    </div>
  );
};

export default StudySet;

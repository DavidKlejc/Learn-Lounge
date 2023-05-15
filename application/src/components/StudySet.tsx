import "../styles/StudySet.css";

const StudySet = ({ setName }: { setName: string }) => {
  return <div className="study-set-card">{setName}</div>;
};

export default StudySet;

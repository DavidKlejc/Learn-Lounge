import "../styles/Flashcard.css";
import { useState } from "react";

const Flashcard = ({
  id,
  term,
  definition,
}: {
  id: number;
  term: string;
  definition: string;
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`flashcard ${isFlipped ? "flipped" : ""}`}
      onClick={handleClick}
    >
      <div className="front">{term}</div>
      <div className="back">{definition}</div>
    </div>
  );
};

export default Flashcard;

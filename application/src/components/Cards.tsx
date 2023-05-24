import { useEffect, useState } from "react";
import { IEditableFlashcard } from "../interfaces/IEditableFlashcard";
import Flashcard from "./Flashcard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowRight,
  faShuffle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../lib/api";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import "../styles/Cards.css";

const Cards = ({ flashcards }: { flashcards: IEditableFlashcard[] }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [setName, setSetName] = useState<string>("");
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);

  useEffect(() => {
    fetchSetName();
  }, []);

  const fetchSetName = async () => {
    const { data, error } = await supabase
      .from("sets")
      .select("name")
      .eq("id", id);

    if (data) {
      setSetName(data[0].name);
    } else {
      console.log(error);
    }
  };

  const deleteSet = async (setName: string) => {
    if (user) {
      const { data, error } = await supabase
        .from("sets")
        .delete()
        .eq("name", setName);

      if (error) {
        console.log(error);
      }
      navigate("/sets");
    }
  };

  const goToPreviousFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1);
    }
  };

  const goToNextFlashcard = () => {
    if (currentFlashcardIndex < flashcards.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
    }
  };

  return (
    <div className="flashcard-set-container">
      <div className="flashcards-container">
        <h2>{setName}</h2>
        {flashcards.length > 0 ? (
          <Flashcard
            id={flashcards[currentFlashcardIndex].id}
            term={flashcards[currentFlashcardIndex].term}
            definition={flashcards[currentFlashcardIndex].definition}
          />
        ) : (
          <p>No flashcards available.</p>
        )}
        <div className="flashcard-nav">
          <FontAwesomeIcon
            icon={faShuffle}
            size="xl"
            rotation={180}
            onClick={goToPreviousFlashcard}
            className="shuffle"
          />
          <div className="nav-buttons">
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              size="2xl"
              rotation={180}
              onClick={goToPreviousFlashcard}
              className="left-arrow"
            />
            <div className="flashcard-nav-index-container">
              {`${currentFlashcardIndex + 1} / ${flashcards.length}`}
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              size="2xl"
              onClick={goToNextFlashcard}
              className="right-arrow"
            />
          </div>
          <div className="remove-button-container">
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="remove-button"
              onClick={() => deleteSet(setName)}
              size="lg"
            />
          </div>
        </div>
        <div className="divider"></div>
      </div>
    </div>
  );
};

export default Cards;

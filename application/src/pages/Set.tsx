import "../styles/Set.css";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/api";
import Flashcard from "../components/Flashcard";
import { IEditableFlashcard } from "../interfaces/IEditableFlashcard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircleArrowRight,
  faPenToSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "react-textarea-autosize";
import { IFormData } from "../interfaces/IFormData";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";

const schema = z.object({
  setName: z.string().max(240).nonempty("Set name is required"),
  flashcards: z.array(
    z.object({
      term: z.string().max(240).nonempty("Term is required"),
      definition: z.string().max(240).nonempty("Definition is required"),
    })
  ),
});

const Set = () => {
  const { id } = useParams();
  const [setName, setSetName] = useState<string>("");
  const [flashcards, setFlashcards] = useState<IEditableFlashcard[]>([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);

  const {
    register,
    control,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      setName: setName,
      flashcards: flashcards.map(({ term, definition }) => ({
        term,
        definition,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray<IFormData>({
    control,
    name: "flashcards",
  });

  useEffect(() => {
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

    const fetchFlashcards = async () => {
      const { data, error } = await supabase
        .from("flashcards")
        .select("id, term, definition")
        .eq("setId", id);

      if (data) {
        const fetchedFlashcards: IEditableFlashcard[] = data.map(
          (flashcard: { id: number; term: string; definition: string }) => ({
            ...flashcard,
            editing: false,
          })
        );
        setFlashcards(fetchedFlashcards);
      } else {
        console.log(error);
      }
    };

    fetchSetName();
    fetchFlashcards();
  }, []);

  const setEditStatusOfFlashcard = (index: number) => {
    setFlashcards((prevState) =>
      prevState.map((flashcard, i) =>
        i === index ? { ...flashcard, editing: !flashcard.editing } : flashcard
      )
    );
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
    <main>
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
          <div className="divider"></div>

          <div className="edit-flashcards-container">
            {flashcards.map((flashcard, index) => (
              <div className="edit-flashcard" key={flashcard.id}>
                <div className="edit-flashcard-header">
                  {flashcards.length > 1 && (
                    <div className="index-container">{index + 1}</div>
                  )}
                  <div className="edit-and-delete-button-container">
                    {flashcards[index].editing ? (
                      <div className="edit-button-container">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          onClick={() => setEditStatusOfFlashcard(index)}
                        />
                      </div>
                    ) : (
                      <div className="save-button-container">
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          onClick={() => setEditStatusOfFlashcard(index)}
                        />
                      </div>
                    )}
                    {flashcards.length > 1 && (
                      <div className="remove-button-container">
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          className="remove-button"
                          onClick={() => remove(index)}
                          size="lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="header-divider"></div>
                <div className="term-and-definition-container">
                  <div className="edit-term-container">
                    <TextareaAutosize
                      {...register(`flashcards.${index}.term`)}
                      defaultValue={flashcards[index].term}
                      className={
                        flashcards[index].editing
                          ? "edit-term-active"
                          : "edit-term"
                      }
                      disabled={!flashcards[index].editing}
                    />
                    {errors?.flashcards && errors.flashcards[index] && (
                      <p>{errors?.flashcards[index]?.term?.message}</p>
                    )}
                  </div>
                  <div className="vertical-divider"></div>
                  <div className="edit-definition-container">
                    <TextareaAutosize
                      {...register(`flashcards.${index}.definition`)}
                      defaultValue={flashcards[index].definition}
                      className={
                        flashcards[index].editing
                          ? "edit-definition-active"
                          : "edit-definition"
                      }
                      disabled={!flashcards[index].editing}
                    />
                    {errors?.flashcards && errors.flashcards[index] && (
                      <p>{errors.flashcards[index]?.definition?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Set;

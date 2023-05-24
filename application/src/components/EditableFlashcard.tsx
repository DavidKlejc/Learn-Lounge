import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/EditableFlashcard.css";
import {
  faCheckCircle,
  faPenToSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IEditableFlashcard } from "../interfaces/IEditableFlashcard";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { supabase } from "../lib/api";
import { useAtom } from "jotai";
import { flashcardsAtom } from "../atoms/atoms";

const schema = z.object({
  term: z.string().max(240).nonempty("Term is required"),
  definition: z.string().max(240).nonempty("Definition is required"),
});

const EditableFlashcard = ({
  flashcardsLength,
  index,
  id,
  term,
  definition,
}: {
  flashcardsLength: number;
  index: number;
  id: number;
  term: string;
  definition: string;
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useAtom(flashcardsAtom);

  const form = useForm<IEditableFlashcard>({
    resolver: zodResolver(schema),
    defaultValues: {
      term: term,
      definition: definition,
    },
  });

  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;

  const deleteFlashcard = async (flashcardId: number) => {
    const { data, error } = await supabase
      .from("flashcards")
      .delete()
      .eq("id", flashcardId);

    if (data) {
      console.log("Flashcard deleted");
    }
  };

  const onSubmit: SubmitHandler<IEditableFlashcard> = async (data) => {
    if (flashcardsLength > 0) {
      await updateFlashcard(data, index, id);
      setEditing((prevState) => !prevState);
    }
  };

  const updateFlashcard = async (
    data: IEditableFlashcard,
    currentFlashcard: number,
    flashcardId: number
  ) => {
    try {
      await supabase
        .from("flashcards")
        .update({
          term: data.term,
          definition: data.definition,
        })
        .eq("id", flashcardId);

      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((flashcard) =>
          flashcard.id === flashcardId ? data : flashcard
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form>
        <div className="edit-flashcard" key={id}>
          <div className="edit-flashcard-header">
            <div className="index-container">{index + 1}</div>
            <div className="edit-and-delete-button-container">
              {editing ? (
                <div className="save-button-container">
                  <button type="submit" onClick={handleSubmit(onSubmit)}>
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </button>
                </div>
              ) : (
                <div className="edit-button-container">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => setEditing((prevState) => !prevState)}
                  />
                </div>
              )}
              {flashcardsLength > 1 ? (
                <div className="remove-button-container">
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="remove-button"
                    onClick={() => {
                      deleteFlashcard(id);
                    }}
                    size="lg"
                  />
                </div>
              ) : (
                <div className="remove-button-container">
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="remove-button-disabled"
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
                {...register("term")}
                defaultValue={term}
                className={editing ? "edit-term-active" : "edit-term"}
                disabled={!editing}
              />
              <p className="errors">{errors.term?.message}</p>
            </div>
            <div className="vertical-divider"></div>
            <div className="edit-definition-container">
              <TextareaAutosize
                {...register("definition")}
                defaultValue={definition}
                className={
                  editing ? "edit-definition-active" : "edit-definition"
                }
                disabled={!editing}
              />
              <p className="errors">{errors.definition?.message}</p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditableFlashcard;

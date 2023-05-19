import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IFormData } from "../interfaces/IFormData";
import "../styles/CreateSet.css";
import TextareaAutosize from "react-textarea-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/Auth";
import { supabase } from "../lib/api";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const schema = z.object({
  setName: z.string().max(240).nonempty("Set name is required"),
  flashcards: z.array(
    z.object({
      term: z.string().max(240).nonempty("Term is required"),
      definition: z.string().max(240).nonempty("Definition is required"),
    })
  ),
});

const CreateSet = () => {
  const [lastIndex, setLastIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      setName: "",
      flashcards: [{ term: "", definition: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray<IFormData>({
    control,
    name: "flashcards",
  });

  const onSubmit: SubmitHandler<IFormData> = async (data: IFormData) => {
    if (user) {
      const { data: setData, error } = await supabase
        .from("sets")
        .insert({ name: data.setName, userId: user.id })
        .select("id");

      if (error) {
        console.error(error);
      } else {
        const setId = setData[0].id;
        const flashcardData = data.flashcards.map((flashcard) => ({
          setId,
          term: flashcard.term,
          definition: flashcard.definition,
        }));

        setIsSubmitting(true);

        const { error: flashcardsError } = await supabase
          .from("flashcards")
          .insert(flashcardData);
        if (flashcardsError) {
          console.error(flashcardsError);
        } else {
          setIsSubmitting(false);
          navigate("/sets");
        }
      }
    }
  };

  useEffect(() => {
    if (fields.length > 0) {
      setLastIndex(fields.length - 1);
    }
  }, [fields]);

  // Allow ability to append a new flashcard using tab
  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    if (event.key === "Tab" && !event.shiftKey && index === lastIndex) {
      event.preventDefault();
      append({ term: "", definition: "" });
    }
  };

  return (
    <main>
      {!isSubmitting ? (
        <>
          <h2>Create a new study set</h2>
          <form
            className="create-study-set-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="enter-set-name-container">
              <input
                type="text"
                placeholder="Enter set name"
                className="enter-set-input"
                {...register("setName")}
              />
              {errors?.setName && <p>{errors.setName.message}</p>}
            </div>
            {fields.map((field, index) => (
              <>
                <div className="create-flashcard-header">
                  {fields.length > 1 ? (
                    <>
                      <div className="index-container">{index + 1}</div>
                      <div className="remove-button-container">
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          className="remove-button"
                          onClick={() => remove(index)}
                          size="lg"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="index-container">{index + 1}</div>
                      <div className="remove-button-container">
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          className="remove-button-disabled"
                          size="lg"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="create-flashcard" key={field.id}>
                  <div className="create-term-container">
                    <TextareaAutosize
                      {...register(`flashcards.${index}.term`)}
                      defaultValue={field.term}
                      placeholder="Enter term"
                      className="create-term"
                    />
                    {errors?.flashcards && errors.flashcards[index] && (
                      <p>{errors?.flashcards[index]?.term?.message}</p>
                    )}
                  </div>
                  <div className="create-definition-container">
                    <TextareaAutosize
                      {...register(`flashcards.${index}.definition`)}
                      placeholder="Enter definition"
                      defaultValue={field.definition}
                      className="create-definition"
                      onKeyDown={(event) => handleTabKeyDown(event, index)}
                    />
                    {errors?.flashcards && errors.flashcards[index] && (
                      <p>{errors.flashcards[index]?.definition?.message}</p>
                    )}
                  </div>
                </div>
              </>
            ))}
            <button
              className="add-flashcard-button"
              type="button"
              onClick={() => append({ term: "", definition: "" })}
            >
              Add Flashcard
            </button>
            <button
              className="create-set-button"
              type="submit"
              disabled={isSubmitting}
            >
              Create
            </button>
          </form>
        </>
      ) : (
        <Loading />
      )}
    </main>
  );
};

export default CreateSet;

import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IFormData } from "../interfaces/IFormData";
import "../styles/CreateSet.css";
import TextareaAutosize from "react-textarea-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

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

  const onSubmit: SubmitHandler<IFormData> = (data) => {
    console.log(data);
  };

  return (
    <main>
      <h2>Create a new study set</h2>
      <form className="create-study-set-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Enter set name"
          className="enter-set-input"
          {...register("setName")}
        />
        {errors?.setName && <p>{errors.setName.message}</p>}
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
              <TextareaAutosize
                {...register(`flashcards.${index}.term`)}
                defaultValue={field.term}
                placeholder="Enter term"
                className="create-term"
              />
              {errors?.flashcards && errors.flashcards[index] && (
                <p>{errors?.flashcards[index]?.term?.message}</p>
              )}
              <TextareaAutosize
                {...register(`flashcards.${index}.definition`)}
                placeholder="Enter definition"
                defaultValue={field.definition}
                className="create-definition"
              />
              {errors?.flashcards && errors.flashcards[index] && (
                <p>{errors.flashcards[index]?.definition?.message}</p>
              )}
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
        <button className="create-set-button" type="submit">
          Create
        </button>
      </form>
    </main>
  );
};

export default CreateSet;

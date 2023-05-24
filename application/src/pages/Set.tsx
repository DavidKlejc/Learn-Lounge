import "../styles/Set.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../lib/api";
import { useAuth } from "../hooks/Auth";
import EditableFlashcard from "../components/EditableFlashcard";
import Cards from "../components/Cards";
import { flashcardsAtom } from "../atoms/atoms";
import { useAtom } from "jotai";

const Set = () => {
  const { id } = useParams();
  const [flashcards, setFlashcards] = useAtom(flashcardsAtom);

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchFlashcards = async () => {
    const { data, error } = await supabase
      .from("flashcards")
      .select("id, term, definition")
      .eq("setId", id)
      .order("id");

    if (data) {
      setFlashcards(data);
    } else {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

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

  return (
    <main>
      <Cards flashcards={flashcards} />
      <div className="edit-flashcards-container">
        {flashcards.map((flashcard, index) => (
          <EditableFlashcard
            flashcardsLength={flashcards.length}
            index={index}
            id={flashcard.id}
            term={flashcard.term}
            definition={flashcard.definition}
          />
        ))}
      </div>
    </main>
  );
};

export default Set;

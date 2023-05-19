import { useEffect, useState } from "react";
import { supabase } from "../lib/api";
import StudySet from "../components/StudySet";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import AddSet from "../components/AddSet";
import "../styles/Sets.css";
import Loading from "../components/Loading";
import { ISet } from "../interfaces/ISet";

const Sets = () => {
  const [sets, setSets] = useState<ISet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSets();
  }, []);

  const fetchSets = async () => {
    if (user) {
      const { data: sets, error } = await supabase
        .from("sets")
        .select("*")
        .eq("userId", user.id);

      if (error) {
        console.error(error);
      } else {
        setSets(sets as ISet[]);
      }
      setLoading(false);
    }
  };

  return (
    <main>
      <h2>Your study sets:</h2>
      <div className="set-container">
        {loading ? (
          <div className="loading-container">
            <Loading />
          </div>
        ) : sets.length ? (
          <>
            {sets.map((set) => (
              <StudySet setId={set.id} setName={set.name} />
            ))}
            <AddSet />
          </>
        ) : null}
      </div>
      <Outlet />
    </main>
  );
};

export default Sets;

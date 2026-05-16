import Day from "./Day";
import { useState, useEffect, useContext } from "react";
import { DateTime } from "luxon";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../SendData/fbConfig";
import { ThemeContext } from "../../App";

const DB_FIRE = import.meta.env.VITE_DB_FIRE;

export default function DayList({ month, day, year, data, onDataLoaded, onRefresh }) {
  const [inputs] = useState({
    a: "", b: "", c: "", d: "", e: "", f: "", g: "", h: "", i: "", j: "",
    nA: "", nB: "", nC: "", nD: "", nE: "", nF: "", nG: "", nH: "", nI: "", nJ: "",
    uno: "", dos: "", tres: "", nUno: "", nDos: "", nTres: "",
    bsf: "", mp: "", efInicial: "", efFinal: "",
  });

  const [on, setOn] = useState(false);
  const [getDay, setGetDay] = useState({ ...inputs });
  const [hasData, setHasData] = useState(false);
  const {} = useContext(ThemeContext);

  // Sincronizar el estado local con la data que viene por props (global)
  useEffect(() => {
    if (data) {
      setGetDay({ ...data });
      setHasData(true);
    } else {
      setGetDay({ ...inputs });
      setHasData(false);
    }
  }, [data, inputs]);

  // Carga inicial si no hay data (fallback)
  useEffect(() => {
    if (!DB_FIRE || data) return;
    const ref = doc(db, DB_FIRE, DateTime.local(year, month, day).toLocaleString(DateTime.DATE_FULL));
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        const snapData = snap.data();
        if (onDataLoaded) onDataLoaded(day, snapData);
      }
    });
  }, [DB_FIRE, year, month, day, data, onDataLoaded]);

  return (
    <div className="day-wrapper">
      <button
        onClick={() => { setOn(true); }}
        className={`dayListButton ${hasData ? 'has-data' : ''}`}
      >
        {day}
        {hasData && <span className="indicator"></span>}
      </button>

      {on && (
        <Day
          day={day}
          month={month}
          year={year}
          inputs={getDay}
          setInputs={setGetDay}
          on={on}
          setOn={setOn}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
}

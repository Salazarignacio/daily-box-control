import Day from "./Day";
import { useState, useEffect, useContext } from "react";
import { DateTime } from "luxon";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../SendData/fbConfig";
import { ThemeContext } from "../../App";

const DB_FIRE = import.meta.env.VITE_DB_FIRE;

export default function DayList({ month, day, year, onDataLoaded, onRefresh }) {
  const [inputs] = useState({
    a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0,
    nA: "", nB: "", nC: "", nD: "", nE: "", nF: "", nG: "", nH: "", nI: "", nJ: "",
    uno: 0, dos: 0, tres: 0, nUno: "", nDos: "", nTres: "",
    bsf: 0, mp: 0, efInicial: 0, efFinal: 0,
  });

  const [on, setOn] = useState(false);
  const [getDay, setGetDay] = useState({ ...inputs });
  const [hasData, setHasData] = useState(false);
  const { setOff } = useContext(ThemeContext);

  useEffect(() => {
    if (!DB_FIRE) return;
    const ref = doc(db, DB_FIRE, DateTime.local(year, month, day).toLocaleString(DateTime.DATE_FULL));
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setGetDay({ ...data });
        setHasData(true);
        if (onDataLoaded) onDataLoaded(day, data);
      } else {
        setGetDay({ ...inputs });
        setHasData(false);
      }
    });
  }, [DB_FIRE, year, month, day]);

  return (
    <div className="day-wrapper">
      <button
        onClick={() => { setOn(true); setOff(true); }}
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

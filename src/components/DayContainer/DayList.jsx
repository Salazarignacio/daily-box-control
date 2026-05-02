import Day from "./Day";
import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../SendData/fbConfig";
import { useContext } from "react";
import { ThemeContext } from "../../App";

const DB_FIRE = import.meta.env.VITE_DB_FIRE;

export default function DayList({ month, dayName, day, year }) {
  const [inputs, setInputs] = useState({
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    g: 0,
    h: 0,
    i: 0,
    j: 0,
    nA: "",
    nB: "",
    nC: "",
    nE: "",
    nF: "",
    nG: "",
    nH: "",
    nI: "",
    nJ: "",
    uno: 0,
    dos: 0,
    tres: 0,
    nUno: "",
    nDos: "",
    nTres: "",
    bsf: 0,
    mp: 0,
    efInicial: 0,
    efFinal: 0,
  });

  const [on, setOn] = useState(false);
  const [getDay, setGetDay] = useState("");
  const theme = useContext(ThemeContext)
const {off, setOff} = theme
  useEffect(() => {
    if (!DB_FIRE) {
      console.warn("VITE_DB_FIRE is not defined. Firebase sync is disabled.");
      setGetDay({ ...inputs });
      return;
    }

    const ref = doc(
      db,
      DB_FIRE,
      DateTime.local(year, month, day).toLocaleString(DateTime.DATE_FULL)
    );
    getDoc(ref).then((snapShot) => {
      if (snapShot.exists()) {
        setGetDay({ ...snapShot.data() });
      } else setGetDay({ ...inputs });
    });
  }, [DB_FIRE, year, month, day]);

  return (
    <>
      <div>
        <div className="Day">
          <div>
            <div
              onClick={() => {
                setOn(true);
                setOff(true)
              }}
              className={"dayListButton"}
            >
              {DateTime.local(year, month, day).day.toLocaleString(DateTime)}
            </div>
          </div>

          {on && (
            <Day
              day={day}
              month={month}
              year={year}
              inputs={getDay}
              setInputs={setGetDay}
              on={on}
              setOn={setOn}
            />
          )}
        </div>
      </div>
    </>
  );
}

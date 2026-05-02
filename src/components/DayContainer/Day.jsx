import { DateTime } from "luxon";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../SendData/fbConfig";

const DB_FIRE = import.meta.env.VITE_DB_FIRE;
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycby_htbCw5Xwu4ImASMEicwTg440_rkN9EiMnLyogQ7f4zEZYWBiTxDSAj9vr80UJFqd5g/exec";

export default function Day({
  month,
  day,
  year,
  inputs,
  setInputs,
  setOn,
}) {
  
  const subtotal = {
    subtotal1:
      parseInt(inputs.a) +
      parseInt(inputs.b) +
      parseInt(inputs.c) +
      parseInt(inputs.d) +
      parseInt(inputs.e) +
      parseInt(inputs.f) +
      parseInt(inputs.g) +
      parseInt(inputs.h) +
      parseInt(inputs.i) +
      parseInt(inputs.j),
    subtotal2:
      parseInt(inputs.uno) + parseInt(inputs.dos) + parseInt(inputs.tres),
  };
  const suma =
    parseInt(inputs.efFinal) +
    parseInt(subtotal.subtotal1) +
    parseInt(inputs.mp) +
    parseInt(inputs.bsf);
  const total = {
    ventas: suma - parseFloat(inputs.efInicial),
    gastos: parseFloat(subtotal.subtotal1) + parseFloat(subtotal.subtotal2),
  };
  const today = DateTime.local(year, month, day).toLocaleString(
    DateTime.DATE_FULL,
  );
  const handleInput = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };
  const dt = DateTime.local(year, month, day);
  const {
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    i,
    j,
    uno,
    dos,
    tres,
    efInicial,
    efFinal,
    nA,
    mp,
    bsf
  } = inputs;

  const sendToSheets = async (ventas, gastos) => {
    const data = {
      fecha: today,
      efInicial: parseFloat(efInicial) || 0,
      efFinal: parseFloat(efFinal) || 0,
      ventas: ventas,
      gastos: gastos
    };

    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error al enviar a Sheets:", error);
    }
  };

  const sendDay = () => {
    const daySale = {
      ...inputs,
    };
    
    if (DB_FIRE) {
        const docRef = doc(db, DB_FIRE, today);
        setDoc(docRef, daySale);
    }
    
    sendToSheets(total.ventas, total.gastos);
    alert("Datos guardados correctamente");
  };

  return (
    <div className="days">
      <div onClick={() => setOn(false)} className="dayActive">
        x
      </div>
      <p className="mb-3 date">
        {dt.toLocaleString(DateTime.DATE_HUGE).toUpperCase()}
      </p>
      <div className="headerDay date mb-2">
        <div>
          <label style={{ marginRight: "13px" }}>Efectivo Inicial</label>
          <input
            className="number"
            name="efInicial"
            value={efInicial}
            onChange={(event) => handleInput(event)}
            type="number"
          />
        </div>
        <div>
          <label style={{ marginRight: "13px" }}>Efectivo Final</label>
          <input
            className="number"
            name={"efFinal"}
            value={efFinal}
            onChange={(event) => handleInput(event)}
          />
        </div>
      </div>
      <div className="gastosContainer mb-3">
        <div className="date">
          <p>Gastos en Efectivo</p>
          <ul>
            <li>
              <input
                type="text"
                name="nA"
                value={nA}
                onChange={(event) => handleInput(event)}
                className="text"
              />
              <input
                className="number"
                name={"a"}
                value={a}
                type="number"
                onChange={(event) => handleInput(event)}
              />
            </li>
            <li>
              <input
                type="text"
                name="nB"
                value={inputs.nB}
                onChange={(event) => handleInput(event)}
                className="text"
              />
              <input
                className="number"
                name={"b"}
                value={b}
                onChange={(event) => handleInput(event)}
                type="number"
              />
            </li>
            <li>
              <input
                type="text"
                name="nC"
                value={inputs.nC}
                onChange={(event) => handleInput(event)}
                className="text"
              />
              <input
                className="number"
                name={"c"}
                value={c}
                type="number"
                onChange={(event) => handleInput(event)}
              />
            </li>
            <li>
              <input
                type="text"
                name="nD"
                value={inputs.nD}
                onChange={(event) => handleInput(event)}
                className="text"
              />
              <input
                className="number"
                name={"d"}
                type="number"
                value={d}
                onChange={(event) => handleInput(event)}
              />
            </li>
            <li>
              <input
                type="text"
                name="nE"
                value={inputs.nE}
                onChange={(event) => handleInput(event)}
                className="text"
              />
              <input
                className="number"
                name={"e"}
                type="number"
                value={e}
                onChange={(event) => handleInput(event)}
              />
            </li>
            <li>
              <input
                type="text"
                name="nF"
                value={inputs.nF}
                onChange={(event) => handleInput(event)}
                className="text"
              />
              <input
                className="number"
                name={"f"}
                type="number"
                value={f}
                onChange={(event) => handleInput(event)}
              />
            </li>
            <li>
              <input
                type="text"
                name="nG"
                value={inputs.nG}
                onChange={(event) => handleInput(event)}
                className="text"
              />
              <input
                className="number"
                name={"g"}
                type="number"
                value={g}
                onChange={(event) => handleInput(event)}
              />
            </li>
            <li>
              <input
                type="text"
                name="nH"
                value={inputs.nH}
                onChange={(event) => handleInput(event)}
                className="text"
              />
              <input
                className="number"
                name={"h"}
                type="number"
                value={h}
                onChange={(event) => handleInput(event)}
              />
            </li>
            <li>
              <input
                type="text"
                name="nI"
                value={inputs.nI}
                onChange={(event) => handleInput(event)}
                className="text"
              />
              <input
                className="number"
                name={"i"}
                type="number"
                value={i}
                onChange={(event) => handleInput(event)}
              />
            </li>
            <li>
              <input
                type="text"
                name="nJ"
                value={inputs.nJ}
                onChange={(event) => handleInput(event)}
                className="text"
              />
              <input
                className="number"
                name={"j"}
                type="number"
                value={j}
                onChange={(event) => handleInput(event)}
              />
            </li>
          </ul>
        </div>
        <div className="date">
          <p>Gastos Transferencia / MP</p>
          <ul>
            <li>
              <input
                type="text"
                name="nUno"
                value={inputs.nUno}
                onChange={(event) => handleInput(event)}
                className="text"
              />
              <input
                className="number"
                name={"uno"}
                value={uno}
                type="number"
                onChange={(event) => handleInput(event)}
              />
            </li>
            <li>
              <input
                type="text"
                name="nDos"
                value={inputs.nDos}
                onChange={(event) => handleInput(event)}
                className="text"
              />
              <input
                className="number"
                name={"dos"}
                value={dos}
                type="number"
                onChange={(event) => handleInput(event)}
              />
            </li>
            <li>
              <input
                type="text"
                name="nTres"
                value={inputs.nTres}
                onChange={(event) => handleInput(event)}
                className="text"
              />
              <input
                className="number"
                name={"tres"}
                value={tres}
                type="number"
                onChange={(event) => handleInput(event)}
              />
            </li>
          </ul>
          <div style={{ marginTop: "20px" }}>
            <p>Ventas Digitales</p>
            <ul>
              <li>
                <input type="text" value="Mercado Pago" readOnly className="text" />
                <input
                  className="number"
                  name="mp"
                  value={mp}
                  onChange={(event) => handleInput(event)}
                  type="number"
                />
              </li>
              <li>
                <input type="text" value="Billetera Sta Fe" readOnly className="text" />
                <input
                  className="number"
                  name="bsf"
                  value={bsf}
                  onChange={(event) => handleInput(event)}
                  type="number"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footerDay date">
        <div className="totales">
          <p>VENTAS: {total.ventas.toLocaleString()}</p>
          <p>GASTOS: {total.gastos.toLocaleString()}</p>
        </div>
        <button onClick={sendDay} className="btn-send">
          GUARDAR DIA
        </button>
      </div>
    </div>
  );
}

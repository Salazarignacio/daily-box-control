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
  
  const getNum = (val) => parseFloat(val) || 0;

  const subtotal = {
    subtotal1:
      getNum(inputs.a) + getNum(inputs.b) + getNum(inputs.c) + getNum(inputs.d) +
      getNum(inputs.e) + getNum(inputs.f) + getNum(inputs.g) + getNum(inputs.h) +
      getNum(inputs.i) + getNum(inputs.j),
    subtotal2:
      getNum(inputs.uno) + getNum(inputs.dos) + getNum(inputs.tres),
  };

  const suma =
    getNum(inputs.efFinal) +
    subtotal.subtotal1 +
    getNum(inputs.mp) +
    getNum(inputs.bsf);

  const total = {
    ventas: suma - getNum(inputs.efInicial),
    gastos: subtotal.subtotal1 + subtotal.subtotal2,
  };

  const dt = DateTime.local(year, month, day);
  const today = dt.toLocaleString(DateTime.DATE_FULL);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const sendToSheets = async (ventas, gastos) => {
    const data = {
      fecha: today,
      efInicial: getNum(inputs.efInicial),
      efFinal: getNum(inputs.efFinal),
      ventas: ventas,
      gastos: gastos
    };

    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error al enviar a Sheets:", error);
    }
  };

  const sendDay = () => {
    if (DB_FIRE) {
        setDoc(doc(db, DB_FIRE, today), { ...inputs });
    }
    sendToSheets(total.ventas, total.gastos);
    alert("✨ Datos sincronizados correctamente");
  };

  return (
    <div className="days">
      <div>
        <div onClick={() => setOn(false)} className="dayActive">✕</div>
        
        <p className="date">
          {dt.toLocaleString(DateTime.DATE_HUGE).toUpperCase()}
        </p>
        
        <div className="headerDay">
          <div>
            <label>Efectivo Inicial</label>
            <input
              className="number"
              name="efInicial"
              value={inputs.efInicial}
              onChange={handleInput}
              type="number"
              placeholder="$ 0"
            />
          </div>
          <div>
            <label>Efectivo Final</label>
            <input
              className="number"
              name="efFinal"
              value={inputs.efFinal}
              onChange={handleInput}
              type="number"
              placeholder="$ 0"
            />
          </div>
        </div>

        <div className="gastosContainer">
          {/* SECCIÓN 1: GASTOS EFECTIVO */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <p>💸 <strong>Gastos en Efectivo</strong></p>
            <ul>
              {[
                {n: 'nA', v: 'a'}, {n: 'nB', v: 'b'}, {n: 'nC', v: 'c'},
                {n: 'nD', v: 'd'}, {n: 'nE', v: 'e'}, {n: 'nF', v: 'f'},
                {n: 'nG', v: 'g'}, {n: 'nH', v: 'h'}, {n: 'nI', v: 'i'},
                {n: 'nJ', v: 'j'}
              ].map((item, idx) => (
                <li key={idx} style={{ flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Gasto {idx + 1}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      name={item.n}
                      value={inputs[item.n]}
                      onChange={handleInput}
                      className="text"
                      placeholder="Detalle (ej: Arcor)"
                      style={{ flex: '2' }}
                    />
                    <input
                      className="number"
                      name={item.v}
                      value={inputs[item.v]}
                      type="number"
                      onChange={handleInput}
                      placeholder="$ 0"
                      style={{ flex: '1' }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* SECCIÓN 2: GASTOS DIGITALES */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '1.5rem' }}>
              <p><strong>💳 Gastos Digitales</strong></p>
              <ul>
                {[
                  {n: 'nUno', v: 'uno', label: 'Gasto Digital 1'},
                  {n: 'nDos', v: 'dos', label: 'Gasto Digital 2'},
                  {n: 'nTres', v: 'tres', label: 'Gasto Digital 3'}
                ].map((item, idx) => (
                  <li key={idx} style={{ flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {item.label}
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        name={item.n}
                        value={inputs[item.n]}
                        onChange={handleInput}
                        className="text"
                        placeholder="Detalle"
                        style={{ flex: '2' }}
                      />
                      <input
                        className="number"
                        name={item.v}
                        value={inputs[item.v]}
                        type="number"
                        onChange={handleInput}
                        placeholder="$ 0"
                        style={{ flex: '1' }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* SECCIÓN 3: VENTAS DIGITALES */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: '1.5rem' }}>
              <p><strong>💰 Ventas Digitales</strong></p>
              <ul>
                <li style={{ flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>
                    Mercado Pago
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" value="Ventas MP" readOnly className="text" style={{ flex: '2', fontWeight: '600', background: '#fff' }} />
                    <input className="number" name="mp" value={inputs.mp} type="number" onChange={handleInput} placeholder="$ 0" style={{ flex: '1', background: '#fff' }} />
                  </div>
                </li>
                <li style={{ flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>
                    Pago Digital
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" value="Ventas Digital" readOnly className="text" style={{ flex: '2', fontWeight: '600', background: '#fff' }} />
                    <input className="number" name="bsf" value={inputs.bsf} type="number" onChange={handleInput} placeholder="$ 0" style={{ flex: '1', background: '#fff' }} />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="totales">
          <p>VENTAS DEL DÍA <span>${total.ventas.toLocaleString()}</span></p>
          <p>GASTOS TOTALES <span>${total.gastos.toLocaleString()}</span></p>
        </div>

        <button onClick={sendDay} className="btn-send">
          GUARDAR Y SINCRONIZAR
        </button>
      </div>
    </div>
  );
}

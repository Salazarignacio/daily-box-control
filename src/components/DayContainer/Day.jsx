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

  // --- LÓGICA DINÁMICA ---

  // 1. GASTOS EFECTIVO
  const addCashGasto = () => {
    const current = inputs.cashExpenses || [
      { n: inputs.nA || '', v: inputs.a || 0 }, { n: inputs.nB || '', v: inputs.b || 0 },
      { n: inputs.nC || '', v: inputs.c || 0 }, { n: inputs.nD || '', v: inputs.d || 0 },
      { n: inputs.nE || '', v: inputs.e || 0 }, { n: inputs.nF || '', v: inputs.f || 0 },
      { n: inputs.nG || '', v: inputs.g || 0 }, { n: inputs.nH || '', v: inputs.h || 0 },
      { n: inputs.nI || '', v: inputs.i || 0 }, { n: inputs.nJ || '', v: inputs.j || 0 }
    ];
    setInputs({ ...inputs, cashExpenses: [...current, { n: '', v: 0 }] });
  };

  // 2. GASTOS DIGITALES
  const addDigitalGasto = () => {
    const current = inputs.digitalExpenses || [
      { n: inputs.nUno || '', v: inputs.uno || 0 },
      { n: inputs.nDos || '', v: inputs.dos || 0 },
      { n: inputs.nTres || '', v: inputs.tres || 0 }
    ];
    setInputs({ ...inputs, digitalExpenses: [...current, { n: '', v: 0 }] });
  };

  // 3. VENTAS DIGITALES
  const addDigitalSale = () => {
    const current = inputs.digitalSales || [
      { n: 'Mercado Pago', v: inputs.mp || 0, readOnly: true },
      { n: 'Pago Digital', v: inputs.bsf || 0, readOnly: true }
    ];
    setInputs({ ...inputs, digitalSales: [...current, { n: '', v: 0 }] });
  };

  const handleDynamicInput = (listName, index, field, value) => {
    const newList = [...(inputs[listName])];
    newList[index][field] = field === 'v' ? getNum(value) : value;
    setInputs({ ...inputs, [listName]: newList });
  };

  // Inicialización de listas para el render
  const cashList = inputs.cashExpenses || [
    {n:'nA',v:'a'},{n:'nB',v:'b'},{n:'nC',v:'c'},{n:'nD',v:'d'},{n:'nE',v:'e'},
    {n:'nF',v:'f'},{n:'nG',v:'g'},{n:'nH',v:'h'},{n:'nI',v:'i'},{n:'nJ',v:'j'}
  ].map(i => ({ n: inputs[i.n] || '', v: inputs[i.v] || 0 }));

  const digitalExpList = inputs.digitalExpenses || [
    {n:'nUno',v:'uno'},{n:'nDos',v:'dos'},{n:'nTres',v:'tres'}
  ].map(i => ({ n: inputs[i.n] || '', v: inputs[i.v] || 0 }));

  const digitalSalesList = inputs.digitalSales || [
    { n: 'Mercado Pago', v: inputs.mp || 0, readOnly: true },
    { n: 'Pago Digital', v: inputs.bsf || 0, readOnly: true }
  ];

  // --- CÁLCULOS ---
  const subtotal1 = cashList.reduce((acc, curr) => acc + getNum(curr.v), 0);
  const subtotal2 = digitalExpList.reduce((acc, curr) => acc + getNum(curr.v), 0);
  const subtotalSales = digitalSalesList.reduce((acc, curr) => acc + getNum(curr.v), 0);

  const total = {
    ventas: (getNum(inputs.efFinal) + subtotal1 + subtotalSales) - getNum(inputs.efInicial),
    gastos: subtotal1 + subtotal2,
  };

  const dt = DateTime.local(year, month, day);
  const today = dt.toLocaleString(DateTime.DATE_FULL);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  // Función para evitar que el scroll cambie los números
  const preventScroll = (e) => {
    e.target.blur();
  };

  const sendToSheets = async (ventas, gastos) => {
    const data = { fecha: today, efInicial: getNum(inputs.efInicial), efFinal: getNum(inputs.efFinal), ventas, gastos };
    try {
      await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } catch (error) { console.error("Error Sheets:", error); }
  };

  const sendDay = () => {
    if (DB_FIRE) setDoc(doc(db, DB_FIRE, today), { ...inputs });
    sendToSheets(total.ventas, total.gastos);
    alert("✨ Sincronización exitosa");
  };

  return (
    <div className="days">
      <div>
        <div onClick={() => setOn(false)} className="dayActive">✕</div>
        <p className="date">{dt.toLocaleString(DateTime.DATE_HUGE).toUpperCase()}</p>
        
        <div className="headerDay">
          <div><label>Efectivo Inicial</label><input className="number" name="efInicial" value={inputs.efInicial} onChange={handleInput} type="number" placeholder="$ 0"/></div>
          <div><label>Efectivo Final</label><input className="number" name="efFinal" value={inputs.efFinal} onChange={handleInput} type="number" placeholder="$ 0"/></div>
        </div>

        <div className="gastosContainer">
          {/* SECCIÓN 1: GASTOS EFECTIVO */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ margin: 0 }}>💸 <strong>Gastos en Efectivo</strong></p>
              <button onClick={addCashGasto} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '2rem', height: '2rem', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
            </div>
            <ul>
              {cashList.map((item, idx) => (
                <li key={idx} style={{ flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gasto {idx + 1}</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" value={item.n} onChange={(e) => {
                      const newList = [...cashList]; newList[idx].n = e.target.value; setInputs({...inputs, cashExpenses: newList});
                    }} className="text" placeholder="Detalle" style={{ flex: '2' }} />
                    <input className="number" type="number" onWheel={preventScroll} 
 value={item.v} onChange={(e) => {
                      const newList = [...cashList]; newList[idx].v = getNum(e.target.value); setInputs({...inputs, cashExpenses: newList});
                    }} placeholder="$ 0" style={{ flex: '1' }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* SECCIÓN 2: GASTOS DIGITALES */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ margin: 0 }}>💳 <strong>Gastos Digitales</strong></p>
                <button onClick={addDigitalGasto} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '2rem', height: '2rem', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
              </div>
              <ul>
                {digitalExpList.map((item, idx) => (
                  <li key={idx} style={{ flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gasto Digital {idx + 1}</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" value={item.n} onChange={(e) => {
                        const newList = [...digitalExpList]; newList[idx].n = e.target.value; setInputs({...inputs, digitalExpenses: newList});
                      }} className="text" placeholder="Detalle" style={{ flex: '2' }} />
                      <input className="number" type="number" onWheel={preventScroll} 
 value={item.v} onChange={(e) => {
                        const newList = [...digitalExpList]; newList[idx].v = getNum(e.target.value); setInputs({...inputs, digitalExpenses: newList});
                      }} placeholder="$ 0" style={{ flex: '1' }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* SECCIÓN 3: VENTAS DIGITALES */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ margin: 0 }}>💰 <strong>Ventas Digitales</strong></p>
                <button onClick={addDigitalSale} style={{ background: '#166534', color: 'white', border: 'none', borderRadius: '50%', width: '2rem', height: '2rem', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
              </div>
              <ul>
                {digitalSalesList.map((item, idx) => (
                  <li key={idx} style={{ flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>{item.readOnly ? item.n : `Venta Extra ${idx - 1}`}</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" value={item.n} readOnly={item.readOnly} onChange={(e) => {
                        const newList = [...digitalSalesList]; newList[idx].n = e.target.value; setInputs({...inputs, digitalSales: newList});
                      }} className="text" style={{ flex: '2', fontWeight: '600', background: item.readOnly ? '#f1f5f9' : '#fff' }} />
                      <input className="number" type="number" onWheel={preventScroll} 
 value={item.v} onChange={(e) => {
                        const newList = [...digitalSalesList]; newList[idx].v = getNum(e.target.value); setInputs({...inputs, digitalSales: newList});
                      }} placeholder="$ 0" style={{ flex: '1', background: '#fff' }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="totales">
          <p>VENTAS DEL DÍA <span>${total.ventas.toLocaleString()}</span></p>
          <p>GASTOS TOTALES <span>${total.gastos.toLocaleString()}</span></p>
        </div>
        <button onClick={sendDay} className="btn-send">GUARDAR Y SINCRONIZAR</button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../SendData/fbConfig";
import { formatNumber, parseNumber, getNum } from "../../utils/format";

const DB_FIRE = import.meta.env.VITE_DB_FIRE;
const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

export default function Day({
  month,
  day,
  year,
  inputs,
  setInputs,
  setOn,
  onRefresh,
}) {
  const [loading, setLoading] = useState(false);

  // Traspaso de saldo inteligente
  useEffect(() => {
    if (getNum(inputs.efInicial) === 0 && DB_FIRE) {
      const yesterday = DateTime.local(year, month, day).minus({ days: 1 }).toLocaleString(DateTime.DATE_FULL);
      const ref = doc(db, DB_FIRE, yesterday);
      getDoc(ref).then((snap) => {
        if (snap.exists()) {
          const yesterdayData = snap.data();
          if (yesterdayData.efFinal) {
            setInputs(prev => ({ ...prev, efInicial: formatNumber(yesterdayData.efFinal) }));
          }
        }
      });
    }
  }, []);

  // --- LÓGICA DE LISTAS MINIMALISTAS ---
  // Si no hay datos, empezamos con 1 fila vacía para gastos y 0 extras para ventas
  const cashList = inputs.cashExpenses || [{ n: '', v: '' }];
  const digitalExpList = inputs.digitalExpenses || [{ n: '', v: '' }];
  const digitalSalesList = inputs.digitalSales || [
    { n: 'Mercado Pago', v: inputs.mp || '', readOnly: true },
    { n: 'Pago Digital', v: inputs.bsf || '', readOnly: true }
  ];

  const updateState = (key, newList) => {
    setInputs(prev => ({ ...prev, [key]: newList }));
  };

  const addRow = (key, list, defaultItem = { n: '', v: '' }) => {
    updateState(key, [...list, defaultItem]);
  };

  const removeRow = (key, list, index) => {
    if (list.length <= 1 && key !== 'digitalSales') return; // Mantener al menos uno en gastos
    const newList = list.filter((_, i) => i !== index);
    updateState(key, newList);
  };

  const handleDynamicChange = (key, list, index, field, value) => {
    const newList = [...list];
    newList[index][field] = value;
    updateState(key, newList);
  };

  const handleBlur = (key, list, index, field, value) => {
    const newList = [...list];
    if (field === 'v') {
      const num = parseNumber(value);
      newList[index][field] = num !== 0 ? formatNumber(num) : '';
      updateState(key, newList);
    }
  };

  const handleInputChange = (field, value) => {
    setInputs({ ...inputs, [field]: value });
  };

  const handleInputBlur = (field, value) => {
    const num = parseNumber(value);
    setInputs({ ...inputs, [field]: num !== 0 ? formatNumber(num) : '' });
  };

  // --- CÁLCULOS ---
  const sub1 = cashList.reduce((acc, curr) => acc + getNum(curr.v), 0);
  const sub2 = digitalExpList.reduce((acc, curr) => acc + getNum(curr.v), 0);
  const subSales = digitalSalesList.reduce((acc, curr) => acc + getNum(curr.v), 0);

  const total = {
    ventas: (getNum(inputs.efFinal) + sub1 + subSales) - getNum(inputs.efInicial),
    gastos: sub1 + sub2,
  };

  const dt = DateTime.local(year, month, day);
  const today = dt.toLocaleString(DateTime.DATE_FULL);

  const sendDay = async () => {
    setLoading(true);
    // Filtramos filas totalmente vacías antes de guardar y convertimos a número para la DB
    const cleanCash = cashList.filter(i => i.n || getNum(i.v) > 0).map(i => ({...i, v: getNum(i.v)}));
    const cleanDigExp = digitalExpList.filter(i => i.n || getNum(i.v) > 0).map(i => ({...i, v: getNum(i.v)}));
    const cleanSales = digitalSalesList.filter(i => i.n || getNum(i.v) > 0).map(i => ({...i, v: getNum(i.v)}));

    const finalData = { 
        ...inputs, 
        efInicial: getNum(inputs.efInicial),
        efFinal: getNum(inputs.efFinal),
        cashExpenses: cleanCash, 
        digitalExpenses: cleanDigExp, 
        digitalSales: cleanSales 
    };

    try {
      if (DB_FIRE) {
        await setDoc(doc(db, DB_FIRE, today), finalData);
        if (onRefresh) onRefresh(day);
      }
      
      const monthName = dt.monthLong.charAt(0).toUpperCase() + dt.monthLong.slice(1);
      const sheetData = { 
        fecha: today, 
        month: monthName, 
        year: year, 
        efInicial: getNum(inputs.efInicial), 
        efFinal: getNum(inputs.efFinal), 
        ventas: total.ventas, 
        gastos: total.gastos 
      };
      
      await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sheetData) });
      
      alert("🚀 Sincronización Exitosa");
      setOn(false);
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const preventScroll = (e) => e.target.blur();

  return (
    <div className="days">
      <div>
        <div className="modal-header">
          <p className="date">{dt.toLocaleString(DateTime.DATE_HUGE).toUpperCase()}</p>
          <div onClick={() => setOn(false)} className="dayActive">✕</div>
        </div>
        
        <div className="modal-content-body">
          <div className="headerDay">
            <div className="input-group">
              <label>Efectivo Inicial</label>
              <div className="currency-input">
                <input className="number" value={inputs.efInicial || ''} onChange={(e) => handleInputChange('efInicial', e.target.value)} onBlur={(e) => handleInputBlur('efInicial', e.target.value)} type="text" placeholder="0" />
              </div>
            </div>
            <div className="input-group">
              <label>Efectivo Final</label>
              <div className="currency-input">
                <input className="number" value={inputs.efFinal || ''} onChange={(e) => handleInputChange('efFinal', e.target.value)} onBlur={(e) => handleInputBlur('efFinal', e.target.value)} type="text" placeholder="0" />
              </div>
            </div>
          </div>

          <div className="gastosContainer">
            {/* SECCIÓN 1: EFECTIVO */}
              <div className="section-card cash">
                <div className="section-header">
                  <p>💸 <strong>Gastos Efectivo</strong></p>
                  <button onClick={() => addRow('cashExpenses', cashList)} className="btn-add">+</button>
                </div>
                <ul>
                  {cashList.map((item, idx) => (
                    <li key={idx} className="dynamic-row">
                      <div className="row-inputs">
                        <input type="text" value={item.n} onChange={(e) => handleDynamicChange('cashExpenses', cashList, idx, 'n', e.target.value)} className="text" placeholder="Detalle" />
                        <div className="currency-input">
                          <input className="number" type="text" value={item.v || ''} onChange={(e) => handleDynamicChange('cashExpenses', cashList, idx, 'v', e.target.value)} onBlur={(e) => handleBlur('cashExpenses', cashList, idx, 'v', e.target.value)} placeholder="0" />
                        </div>
                        <button onClick={() => removeRow('cashExpenses', cashList, idx)} className="btn-remove">🗑️</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="vertical-stack">
                {/* SECCIÓN 2: GASTOS DIGITALES */}
                <div className="section-card digital-exp">
                  <div className="section-header">
                    <p>💳 <strong>Gastos Digitales</strong></p>
                    <button onClick={() => addRow('digitalExpenses', digitalExpList)} className="btn-add">+</button>
                  </div>
                  <ul>
                    {digitalExpList.map((item, idx) => (
                      <li key={idx} className="dynamic-row">
                        <div className="row-inputs">
                          <input type="text" value={item.n} onChange={(e) => handleDynamicChange('digitalExpenses', digitalExpList, idx, 'n', e.target.value)} className="text" placeholder="Detalle" />
                          <div className="currency-input">
                            <input className="number" type="text" value={item.v || ''} onChange={(e) => handleDynamicChange('digitalExpenses', digitalExpList, idx, 'v', e.target.value)} onBlur={(e) => handleBlur('digitalExpenses', digitalExpList, idx, 'v', e.target.value)} placeholder="0" />
                          </div>
                          <button onClick={() => removeRow('digitalExpenses', digitalExpList, idx)} className="btn-remove">🗑️</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SECCIÓN 3: VENTAS DIGITALES */}
                <div className="section-card sales-card">
                  <div className="section-header">
                    <p>💰 <strong>Ventas Digitales</strong></p>
                    <button onClick={() => addRow('digitalSales', digitalSalesList)} className="btn-add green">+</button>
                  </div>
                <ul>
                  {digitalSalesList.map((item, idx) => (
                    <li key={idx} className="dynamic-row">
                      <div className="row-inputs">
                        <input type="text" value={item.n} readOnly={item.readOnly} onChange={(e) => handleDynamicChange('digitalSales', digitalSalesList, idx, 'n', e.target.value)} className="text" />
                        <div className="currency-input">
                          <input className="number" type="text" value={item.v || ''} onChange={(e) => handleDynamicChange('digitalSales', digitalSalesList, idx, 'v', e.target.value)} onBlur={(e) => handleBlur('digitalSales', digitalSalesList, idx, 'v', e.target.value)} placeholder="0" />
                        </div>
                        {!item.readOnly && <button onClick={() => removeRow('digitalSales', digitalSalesList, idx)} className="btn-remove">🗑️</button>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="totales">
            <p>VENTAS <span>${formatNumber(total.ventas)}</span></p>
            <p>GASTOS <span>${formatNumber(total.gastos)}</span></p>
          </div>
          <button onClick={sendDay} className="btn-send" disabled={loading}>
            {loading ? "SINCRONIZANDO..." : "GUARDAR Y SINCRONIZAR"}
          </button>
        </div>
      </div>
    </div>
  );
}

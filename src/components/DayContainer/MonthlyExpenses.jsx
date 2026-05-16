import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../SendData/fbConfig";
import { formatNumber, parseNumber, getNum } from "../../utils/format";

const DB_FIRE = import.meta.env.VITE_DB_FIRE;
const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

export default function MonthlyExpenses({ monthName, year, onClose, onRefresh }) {
  const [expenses, setExpenses] = useState([{ n: '', v: '' }]);
  const [loading, setLoading] = useState(false);
  const docId = `${monthName} ${year}_FIXED`;

  useEffect(() => {
    if (DB_FIRE) {
      const ref = doc(db, DB_FIRE, docId);
      getDoc(ref).then((snap) => {
        if (snap.exists()) {
          const data = snap.data().expenses || [{ n: '', v: '' }];
          const formattedData = data.map(item => ({
            ...item,
            v: item.v ? formatNumber(item.v) : ''
          }));
          setExpenses(formattedData);
        }
      });
    }
  }, []);

  const addRow = () => setExpenses([...expenses, { n: '', v: '' }]);
  
  const removeRow = (index) => {
    if (expenses.length <= 1) return;
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newList = [...expenses];
    newList[index][field] = value;
    setExpenses(newList);
  };

  const handleBlur = (index, field, value) => {
    if (field === 'v') {
      const newList = [...expenses];
      const num = parseNumber(value);
      newList[index][field] = num !== 0 ? formatNumber(num) : '';
      setExpenses(newList);
    }
  };

  const totalFixed = expenses.reduce((acc, curr) => acc + getNum(curr.v), 0);

  const saveMonthly = async () => {
    setLoading(true);
    try {
      const cleanExpenses = expenses
        .filter(i => i.n || getNum(i.v) > 0)
        .map(i => ({ ...i, v: getNum(i.v) }));

      if (DB_FIRE) {
        await setDoc(doc(db, DB_FIRE, docId), { expenses: cleanExpenses });
      }

      if (GOOGLE_SHEETS_URL) {
        const data = { 
            type: 'monthly_fixed',
            month: monthName, 
            year: year, 
            expenses: cleanExpenses,
            total: expenses.reduce((acc, curr) => acc + getNum(curr.v), 0)
        };
        await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      }

      alert("📋 Gastos mensuales actualizados");
      if (onRefresh) onRefresh();
      onClose();
    } catch (e) {
      alert("❌ Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="days">
      <div>
        <div className="modal-header">
          <p className="date">GASTOS FIJOS: {monthName.toUpperCase()}</p>
          <div onClick={onClose} className="dayActive">✕</div>
        </div>
        
        <div className="modal-content-body">
          <div className="section-card">
            <div className="section-header">
              <p>🏢 <strong>Impuestos y Servicios</strong></p>
              <button onClick={addRow} className="btn-add">+</button>
            </div>
            <ul>
              {expenses.map((item, idx) => (
                <li key={idx} className="dynamic-row">
                  <label className="row-label">Gasto Fijo {idx + 1}</label>
                  <div className="row-inputs">
                    <input type="text" value={item.n} onChange={(e) => handleChange(idx, 'n', e.target.value)} className="text" placeholder="Ej: Luz, Alquiler..." />
                    <div className="currency-input">
                      <input className="number" type="text" value={item.v || ''} onChange={(e) => handleChange(idx, 'v', e.target.value)} onBlur={(e) => handleBlur(idx, 'v', e.target.value)} placeholder="0" />
                    </div>
                    <button onClick={() => removeRow(idx)} className="btn-remove">🗑️</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="totales">
            <p>TOTAL FIJOS <span>${formatNumber(totalFixed)}</span></p>
          </div>
          
          <button onClick={saveMonthly} className="btn-send" disabled={loading}>
            {loading ? "GUARDANDO..." : "GUARDAR GASTOS DEL MES"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

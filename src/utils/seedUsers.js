import { db } from '../components/SendData/fbConfig';
import { doc, setDoc } from 'firebase/firestore';

/**
 * UTILIDAD TEMPORAL PARA CREAR ROLES DE PRUEBA
 * 1. Crea los usuarios manualmente en Firebase Console > Authentication
 * 2. Copia los UID aquí
 * 3. Llama a esta función una vez desde App.jsx o un botón temporal
 */
export const seedTestUsers = async (adminUid, clientUid) => {
  try {
    if (adminUid) {
      await setDoc(doc(db, 'users', adminUid), {
        role: 'ADMIN',
        email: 'admin@test.com', // Opcional, solo informativo
        createdAt: new Date()
      });
      console.log("Rol ADMIN asignado correctamente al UID:", adminUid);
    }

    if (clientUid) {
      await setDoc(doc(db, 'users', clientUid), {
        role: 'CLIENT',
        email: 'client@test.com', // Opcional, solo informativo
        createdAt: new Date()
      });
      console.log("Rol CLIENT asignado correctamente al UID:", clientUid);
    }
    
    console.log("Usuarios de prueba configurados en Firestore. Ya puedes borrar esta llamada.");
  } catch (error) {
    console.error("Error al configurar usuarios:", error);
  }
};

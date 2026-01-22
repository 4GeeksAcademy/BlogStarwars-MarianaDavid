// StoreLocal.jsx - Sistema de almacenamiento local
export const StoreLocal = {
  // Guardar datos en localStorage
  save: (key, dataToSave) => {
    try {
      localStorage.setItem(key, JSON.stringify(dataToSave));
      console.log("💾 Guardado en StoreLocal:", key);
      return true;
    } catch (error) {
      console.log("😢 No se pudo guardar:", error);
      return false;
    }
  },

  // Leer datos de localStorage
  read: (key) => {
    try {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.log("😢 No se pudo leer:", error);
      return null;
    }
  },

  // Borrar datos específicos
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      console.log("🗑️ Borrado de StoreLocal:", key);
      return true;
    } catch (error) {
      console.log("😢 No se pudo borrar:", error);
      return false;
    }
  },

  // Limpiar todo el almacenamiento
  clear: () => {
    try {
      localStorage.clear();
      console.log("✨ Todo limpio en StoreLocal!");
      return true;
    } catch (error) {
      console.log("😢 No se pudo limpiar:", error);
      return false;
    }
  }
};
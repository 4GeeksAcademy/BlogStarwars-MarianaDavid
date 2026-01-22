import React, { createContext, useState, useEffect, useContext } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  // Cargar favoritos desde localStorage al iniciar
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('starWarsFavorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Guardar en localStorage cuando cambian los favoritos
  useEffect(() => {
    localStorage.setItem('starWarsFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (item) => {
    if (!item || !item.id || !item.name || !item.type) {
      console.error("Invalid favorite item:", item);
      return;
    }

    setFavorites((prev) => {
      // Evitar duplicados
      if (!prev.some((fav) => fav.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const isFavorite = (id) => {
    return favorites.some((item) => item.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        totalFavorites: favorites.length // Valor calculado añadido
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook personalizado con validación
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
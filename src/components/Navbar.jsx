import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useFavorites } from "../context/FavoritesContext";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { favorites, removeFavorite } = useFavorites();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  return (
    <nav className="navbar navbar-light bg-black">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <h1 className="starwars-logo">STAR WARS</h1>
        </Link>

        <div className="dropdown ml-auto" ref={dropdownRef}>
          <button
            className="btn btn-outline-warning dropdown-toggle" // Cambiado a warning para mejor visibilidad
            onClick={toggleDropdown}
            aria-expanded={isOpen}
          >
            Favoritos ({favorites.length})
          </button>

          <div 
            className={`dropdown-menu dropdown-menu-end ${isOpen ? "show" : ""}`}
            style={{
              display: isOpen ? "block" : "none", // Aseguramos que se oculte
              maxHeight: "300px",
              overflowY: "auto"
            }}
          >
            {favorites.length === 0 ? (
              <span className="dropdown-item">No hay favoritos</span>
            ) : (
              favorites.map((item) => (
                <div 
                  key={item.id} 
                  className="dropdown-item d-flex justify-content-between align-items-center"
                  style={{ minWidth: "200px" }}
                >
                  <span>{item.name}</span>
                  <button
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(item.id);
                    }}
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
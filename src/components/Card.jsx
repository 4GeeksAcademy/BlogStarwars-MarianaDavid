import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export const Card = ({ id, name, type }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(id);

  const getImageUrl = () => {
    const baseUrl =
      "https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img";

    const categoryMap = {
      character: "characters",
      characters: "characters",
      people: "characters",

      planet: "planets",
      planets: "planets",

      starship: "starships",
      starships: "starships",
    };

    const normalizedType = String(type || "").toLowerCase();
    const category = categoryMap[normalizedType];

    return category
      ? `${baseUrl}/${category}/${id}.jpg`
      : `${baseUrl}/placeholder.jpg`;
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const item = { id, name, type: String(type || "").toLowerCase() };
    favorite ? removeFavorite(id) : addFavorite(item);
  };

  return (
    <div className="card">
      <img
        src={getImageUrl()}
        alt={name}
        className="card-img-top"
        onError={(e) => {
          e.target.src =
            "https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/placeholder.jpg";
          e.target.style.objectFit = "cover";
        }}
        style={{
          height: "200px",
          objectFit: "cover",
          backgroundColor: "#333",
        }}
      />

      <div className="card-body">
        <h5 className="card-title">{name}</h5>

        <div className="card-buttons">
          <Link
            to={`/${String(type || "").toLowerCase()}/${id}`}
            className="btn btn-primary"
            onClick={(e) => {
              const t = String(type || "").toLowerCase();
              if (!["character", "planet", "starship"].includes(t)) {
                e.preventDefault();
                window.location.href = "/not-found";
              }
            }}
          >
            Details
          </Link>

          <button
            className={`heart-btn ${favorite ? "text-danger" : "text-white"}`}
            onClick={handleFavoriteClick}
            style={{
              fontSize: "1.2rem",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  );
};

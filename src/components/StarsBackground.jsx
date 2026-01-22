import React, { useEffect } from "react"; // Corrige el typo aquí
import "./StarsBackground.css";

export const StarsBackground = () => {
  useEffect(() => {
    const createStars = () => {
      const starsContainer = document.querySelector(".stars");
      if (starsContainer) {
        starsContainer.innerHTML = "";
        for (let i = 0; i < 200; i++) {
          const star = document.createElement("div");
          star.className = "star";
          star.style.width = `${Math.random() * 3}px`;
          star.style.height = star.style.width;
          star.style.left = `${Math.random() * 100}vw`;
          star.style.top = `${Math.random() * 100}vh`;
          star.style.animationDelay = `${Math.random() * 5}s`;
          starsContainer.appendChild(star);
        }
      }
    };
    createStars();
  }, []);

  return <div className="stars"></div>;
};
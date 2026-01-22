import React, { useState, useEffect, useRef } from "react";
import { Card } from "../components/Card";
import { StarsBackground } from "../components/StarsBackground";
import { StoreLocal } from "../components/StoreLocal";
import "./Home.css";

export const Home = () => {
  const [characters, setCharacters] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [starships, setStarships] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const charsRef = useRef(null);
  const planetsRef = useRef(null);
  const shipsRef = useRef(null);
  const animationId = useRef(null);

  // Fetch para personajes CON StoreLocal
  const fetchCharacters = async () => {
    const storedCharacters = StoreLocal.read('starwars_characters');
    
    if (storedCharacters) {
      console.log("⭐ ¡Usando personajes de StoreLocal!");
      setCharacters(storedCharacters);
      return;
    }

    try {
      console.log("🌍 Buscando personajes en internet...");
      const response = await fetch("https://www.swapi.tech/api/people");
      if (!response.ok) throw new Error("Error en la respuesta de la API");
      
      const data = await response.json();
      StoreLocal.save('starwars_characters', data.results);
      setCharacters(data.results);
    } catch (error) {
      console.error("Error fetching characters:", error);
      const backupData = StoreLocal.read('backup_characters');
      if (backupData) {
        console.log("🆘 Usando datos de respaldo para personajes");
        setCharacters(backupData);
      }
    }
  };

  // Fetch para planetas CON StoreLocal
  const fetchPlanets = async () => {
    const storedPlanets = StoreLocal.read('starwars_planets');
    
    if (storedPlanets) {
      console.log("⭐ ¡Usando planetas de StoreLocal!");
      setPlanets(storedPlanets);
      return;
    }

    try {
      console.log("🌍 Buscando planetas en internet...");
      const response = await fetch("https://www.swapi.tech/api/planets");
      if (!response.ok) throw new Error("Error en la respuesta de la API");
      
      const data = await response.json();
      StoreLocal.save('starwars_planets', data.results);
      setPlanets(data.results);
    } catch (error) {
      console.error("Error fetching planets:", error);
      const backupData = StoreLocal.read('backup_planets');
      if (backupData) {
        console.log("🆘 Usando datos de respaldo para planetas");
        setPlanets(backupData);
      }
    }
  };

  // Fetch para naves CON StoreLocal
  const fetchStarships = async () => {
    const storedStarships = StoreLocal.read('starwars_starships');
    
    if (storedStarships) {
      console.log("⭐ ¡Usando naves de StoreLocal!");
      setStarships(storedStarships);
      return;
    }

    try {
      console.log("🌍 Buscando naves en internet...");
      const response = await fetch("https://www.swapi.tech/api/starships");
      if (!response.ok) throw new Error("Error en la respuesta de la API");
      
      const data = await response.json();
      StoreLocal.save('starwars_starships', data.results);
      setStarships(data.results);
    } catch (error) {
      console.error("Error fetching starships:", error);
      const backupData = StoreLocal.read('backup_starships');
      if (backupData) {
        console.log("🆘 Usando datos de respaldo para naves");
        setStarships(backupData);
      }
    }
  };

  // Animación de carruseles
  const animate = () => {
    [charsRef, planetsRef, shipsRef].forEach(ref => {
      if (ref.current) {
        ref.current.scrollLeft += 0.5;
        if (ref.current.scrollLeft >= (ref.current.scrollWidth / 2)) {
          ref.current.scrollLeft = 0;
        }
      }
    });
    animationId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId.current);
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([fetchCharacters(), fetchPlanets(), fetchStarships()]);
      setLoading(false);
    };
    loadAllData();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="home-container">
      <StarsBackground />
      
      <h2 className="section-title">Characters</h2>
      <div ref={charsRef} className="card-carousel">
        <div className="card-track">
          {[...characters, ...characters].map((character, index) => (
            <Card key={`${character.uid}-${index}`} id={character.uid} name={character.name} type="character" />
          ))}
        </div>
      </div>

      <h2 className="section-title">Planets</h2>
      <div ref={planetsRef} className="card-carousel">
        <div className="card-track">
          {[...planets, ...planets].map((planet, index) => (
            <Card key={`${planet.uid}-${index}`} id={planet.uid} name={planet.name} type="planet" />
          ))}
        </div>
      </div>

      <h2 className="section-title">Starships</h2>
      <div ref={shipsRef} className="card-carousel">
        <div className="card-track">
          {[...starships, ...starships].map((starship, index) => (
            <Card key={`${starship.uid}-${index}`} id={starship.uid} name={starship.name} type="starship" />
          ))}
        </div>
      </div>
    </div>
  );
};
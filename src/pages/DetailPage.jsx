import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { StoreLocal } from "../components/StoreLocal";
import "./DetailPage.css";

// Texto para cuando NO hay descripción real
const loremIpsum = `No hay descripción disponible.`;

// Helpers para valores faltantes
const pretty = (v) => {
  if (v === null || v === undefined) return "No disponible";
  const s = String(v).trim();
  return s.length ? s : "No disponible";
};

const isMissing = (v) => pretty(v) === "No disponible";

const SWAPI_ENDPOINT = {
  character: "people",
  planet: "planets",
  starship: "starships",
};

const IMG_FOLDER = {
  character: "characters",
  planet: "planets",
  starship: "starships",
};

export const DetailPage = () => {
  const { type, id } = useLoaderData();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const storeKey = `starwars_${type}_${id}`;

      // Cache
      const stored = StoreLocal.read(storeKey);
      if (stored) {
        setData(stored);
        setLoading(false);
        return;
      }

      try {
        const endpoint = SWAPI_ENDPOINT[type];
        if (!endpoint) throw new Error(`Tipo inválido: ${type}`);

        const url = `https://www.swapi.tech/api/${endpoint}/${id}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`SWAPI error ${resp.status}`);

        const json = await resp.json();

        // SWAPI.tech suele venir: { result: { properties: {...} } }
        const props = json?.result?.properties;
        if (!props || !props.name) {
          throw new Error("Respuesta inesperada de SWAPI.tech");
        }

        const finalData = {
          ...props,
          // SWAPI casi nunca trae description; dejamos vacío y lo manejamos en render
          description: props.description || "",
        };

        StoreLocal.save(storeKey, finalData);
        setData(finalData);
      } catch (err) {
        setError(err?.message || "Error desconocido");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  if (error) {
    return (
      <div className="detail-page">
        <div className="detail-content">
          <div className="error-message">
            <h2>No pude cargar este elemento</h2>
            <p>
              <strong>Type:</strong> {type} — <strong>ID:</strong> {id}
            </p>
            <p>
              <strong>Error:</strong> {error}
            </p>
            <button className="back-button" onClick={() => navigate(-1)}>
              ← Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="error-message">Data not available</div>;

  // Detectar si viene incompleto (2+ campos faltantes)
  const missingCount =
    (type === "character"
      ? [data?.gender, data?.hair_color, data?.eye_color, data?.birth_year]
      : type === "planet"
      ? [data?.climate, data?.terrain, data?.population]
      : type === "starship"
      ? [data?.model, data?.manufacturer, data?.cost_in_credits]
      : []
    ).filter(isMissing).length;

  const isIncomplete = missingCount >= 2;

  return (
    <div className="detail-page">
      <div className="detail-content">
        <div className="detail-image-container">
          <img
            src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/${IMG_FOLDER[type]}/${id}.jpg`}
            alt={data.name}
            className="detail-image"
            onError={(e) => {
              e.target.src =
                "https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/placeholder.jpg";
            }}
          />
        </div>

        <div className="detail-info-container">
          {isIncomplete && (
            <div className="alert alert-warning" role="alert">
              Este elemento tiene información incompleta en la API.
            </div>
          )}

          <h1>{data.name}</h1>

          <div className="detail-description">
            <h3>Descripción</h3>
            <p>
              {pretty(data.description) !== "No disponible"
                ? data.description
                : loremIpsum}
            </p>
          </div>

          <div className="detail-specs">
            <h3>Especificaciones</h3>

            {type === "character" && (
              <div className="specs-grid">
                <div className="spec-item">
                  <strong>Género:</strong>{" "}
                  <span className={isMissing(data.gender) ? "text-muted" : ""}>
                    {pretty(data.gender)}
                  </span>
                </div>
                <div className="spec-item">
                  <strong>Color de pelo:</strong>{" "}
                  <span
                    className={isMissing(data.hair_color) ? "text-muted" : ""}
                  >
                    {pretty(data.hair_color)}
                  </span>
                </div>
                <div className="spec-item">
                  <strong>Color de ojos:</strong>{" "}
                  <span
                    className={isMissing(data.eye_color) ? "text-muted" : ""}
                  >
                    {pretty(data.eye_color)}
                  </span>
                </div>
                <div className="spec-item">
                  <strong>Año de nacimiento:</strong>{" "}
                  <span
                    className={isMissing(data.birth_year) ? "text-muted" : ""}
                  >
                    {pretty(data.birth_year)}
                  </span>
                </div>
              </div>
            )}

            {type === "planet" && (
              <div className="specs-grid">
                <div className="spec-item">
                  <strong>Clima:</strong>{" "}
                  <span className={isMissing(data.climate) ? "text-muted" : ""}>
                    {pretty(data.climate)}
                  </span>
                </div>
                <div className="spec-item">
                  <strong>Terreno:</strong>{" "}
                  <span className={isMissing(data.terrain) ? "text-muted" : ""}>
                    {pretty(data.terrain)}
                  </span>
                </div>
                <div className="spec-item">
                  <strong>Población:</strong>{" "}
                  <span
                    className={isMissing(data.population) ? "text-muted" : ""}
                  >
                    {pretty(data.population)}
                  </span>
                </div>
              </div>
            )}

            {type === "starship" && (
              <div className="specs-grid">
                <div className="spec-item">
                  <strong>Modelo:</strong>{" "}
                  <span className={isMissing(data.model) ? "text-muted" : ""}>
                    {pretty(data.model)}
                  </span>
                </div>
                <div className="spec-item">
                  <strong>Fabricante:</strong>{" "}
                  <span
                    className={isMissing(data.manufacturer) ? "text-muted" : ""}
                  >
                    {pretty(data.manufacturer)}
                  </span>
                </div>
                <div className="spec-item">
                  <strong>Costo:</strong>{" "}
                  <span
                    className={
                      isMissing(data.cost_in_credits) ? "text-muted" : ""
                    }
                  >
                    {pretty(data.cost_in_credits)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>
        ← Volver al Inicio
      </button>
    </div>
  );
};

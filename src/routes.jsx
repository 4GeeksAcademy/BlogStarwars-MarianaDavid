import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { DetailPage } from "./pages/DetailPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Ruta principal */}
      <Route index element={<Home />} />

      {/* Rutas específicas */}
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />

      {/* Ruta dinámica */}
      <Route
        path="/:type/:id"
        element={<DetailPage />}
        loader={async ({ params }) => {
          const validTypes = ["character", "planet", "starship"];
          const normalizedType = (params.type || "").toLowerCase();
          const normalizedId = String(params.id || "").trim();

          if (!validTypes.includes(normalizedType)) {
            throw new Response("Not Found", { status: 404 });
          }

          if (!/^\d+$/.test(normalizedId)) {
            throw new Response("Not Found", { status: 404 });
          }

          return {
            type: normalizedType,
            id: normalizedId,
          };
        }}
      />
    </Route>
  )
);

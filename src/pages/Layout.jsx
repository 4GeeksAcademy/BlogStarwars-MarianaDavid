import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { StarsBackground } from "../components/StarsBackground";
import { FavoritesProvider } from "../context/FavoritesContext"; // Importa el Provider

export const Layout = () => {
    return (
        <FavoritesProvider> {/* Envuelve todo con el provider de favoritos */}
            <ScrollToTop>
                <StarsBackground />
                <Navbar />
                <main className="main-content"> {/* Contenedor semántico para el contenido */}
                    <Outlet />
                </main>
                <Footer />
            </ScrollToTop>
        </FavoritesProvider>
    );
};
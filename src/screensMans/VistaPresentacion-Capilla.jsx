import React, { useState, useEffect } from "react";
import ScreenMan from "../components/ScreenMan";
import { useSearchParams } from "react-router-dom";
import { getChapelProfile } from "../services/publicChurchService";
import "../utils/VistaPresentacion-Capilla.css";
import "../utils/Estilos-Generales-1.css";

const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

const options = [
    { href: "/capilla", label: "Bienvenida" }
];

const getImageUrl = (filename) => {
    if (!filename) return '';
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
        return filename;
    }
    return `${API_URL}/api/static/uploads/${filename}`;
};

export default function VistaPresentacion() {
    const [searchParams] = useSearchParams();
    const chapelId = searchParams.get('id');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await getChapelProfile(chapelId);
                setProfileData(response.data);
                setError(null);
            } catch (err) {
                console.error("Error al cargar el perfil:", err);
                setError(err.message || "Error al cargar el perfil de la capilla");
            } finally {
                setLoading(false);
            }
        };

        if (chapelId) {
            fetchProfile();
        }
    }, [chapelId]);

    if (loading) {
        return (
            <ScreenMan title="Capillas" options={options}>
                <main className="main-content vp-main-content">
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        Cargando...
                    </div>
                </main>
            </ScreenMan>
        );
    }

    if (error) {
        return (
            <ScreenMan title="Capillas" options={options}>
                <main className="main-content vp-main-content">
                    <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
                        {error}
                    </div>
                </main>
            </ScreenMan>
        );
    }

    if (!profileData) {
        return (
            <ScreenMan title="Capillas" options={options}>
                <main className="main-content vp-main-content">
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        No se encontró información de la capilla
                    </div>
                </main>
            </ScreenMan>
        );
    }

    return (
        <ScreenMan title="Capillas" options={options}>
            <main className="main-content vp-main-content">
                <section
                    className="chapel-header vp-chapel-header"
                    style={{
                        backgroundImage: `url(${getImageUrl(profileData.cover_photo)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="vp-header-overlay">
                        <div>
                            {profileData.profile_photo && (
                                <img src={getImageUrl(profileData.profile_photo)} alt="Chapel Profile" />
                            )}
                        </div>
                        <h2 className="vp-chapel-title">
                            {profileData.parish_name && `${profileData.parish_name} - `}
                            {profileData.chapel_name}
                        </h2>
                    </div>
                </section>

                <div className="details-and-events-container vp-details-and-events">
                    <section className="chapel-details vp-chapel-details">
                        <div className="vp-contact-list">
                            <div><strong>Dirección:</strong> {profileData.address || 'No disponible'}</div>
                            <div><strong>Correo:</strong> {profileData.email || 'No disponible'}</div>
                            <div><strong>Teléfono:</strong> {profileData.phone || 'No disponible'}</div>
                            <div><strong>Coordenadas:</strong> {profileData.coordinates || 'No disponible'}</div>
                            <div><strong>Estado:</strong> {profileData.active ? "Activa" : "Inactiva"}</div>
                        </div>
                    </section>

                    <aside className="events-section vp-events-section">
                        <h3>Eventos</h3>
                        <div className="vp-event-cards">
                            {profileData.events && profileData.events.length > 0 ? (
                                profileData.events.map(event => (
                                    <div className="event-card vp-event-card" key={event.event_variant_id} style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                                        <div>
                                            <h4>{event.variant_name || event.event_name}</h4>
                                            <p className="event-type">{event.variant_type}</p>
                                            <p className="event-details">{event.variant_description}</p>
                                        </div>
                                        <div className="vp-event-card-btn-row">
                                            <button className="mlap-home-reserve-btn">Reservar</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay eventos disponibles en este momento</p>
                            )}
                        </div>
                    </aside>
                </div>
            </main>
        </ScreenMan>
    );
}

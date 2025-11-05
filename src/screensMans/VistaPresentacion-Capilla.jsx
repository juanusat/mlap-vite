import React, { useState, useEffect } from "react";
import ScreenMan from "../components/ScreenMan";
import { useSearchParams, useNavigate } from "react-router-dom";
import MyMapContainer from '../components/MyMapContainer';
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
    const navigate = useNavigate();
    const chapelId = searchParams.get('id');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleReserve = (eventVariantId) => {
        navigate(`/man-reservas/reservar?eventId=${eventVariantId}`);
    };

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

    useEffect(() => {
        if (profileData && profileData.primary_color && profileData.secondary_color) {
            let styleElement = document.getElementById('parish-colors-style');
            
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'parish-colors-style';
                document.head.appendChild(styleElement);
            }
            
            styleElement.textContent = `
                :root {
                    --parent-parish-color-primary: ${profileData.primary_color};
                    --parent-parish-color-secondary: ${profileData.secondary_color};
                }
            `;
        }

        return () => {
            const styleElement = document.getElementById('parish-colors-style');
            if (styleElement) {
                styleElement.remove();
            }
        };
    }, [profileData]);

    // Determine tipo internally (no debug logs)
    useEffect(() => {
        if (!profileData) return;
        try {
            const typeCandidates = [
                profileData.type,
                profileData.location_type,
                profileData.locationType,
                profileData.kind,
                profileData.type_name,
                profileData.category
            ];
            const foundType = typeCandidates.find(v => typeof v === 'string' && v.trim().length > 0);

            // Detect chapel_base / parish indicator if backend provides it (many variants)
            const chapelBaseCandidates = [
                profileData.chapel_base,
                profileData.chapelBase,
                profileData.is_chapel_base,
                profileData.isChapelBase,
                profileData.parish_base,
                profileData.parishBase
            ];
            const chapelBaseRaw = chapelBaseCandidates.find(v => v !== undefined && v !== null);

            let tipoDetected;
            if (chapelBaseRaw !== undefined) {
                // Interpret various representations (boolean, number, string).
                let isParish = false;
                if (typeof chapelBaseRaw === 'boolean') {
                    isParish = !!chapelBaseRaw;
                } else if (typeof chapelBaseRaw === 'number') {
                    isParish = chapelBaseRaw === 1;
                } else if (typeof chapelBaseRaw === 'string') {
                    isParish = ['1', 'true', 'yes', 'si'].includes(chapelBaseRaw.toLowerCase());
                }
                tipoDetected = isParish ? 'parroquia' : 'capilla';
            } else {
                // Fallback heuristics when backend doesn't provide chapel_base
                tipoDetected = (foundType && (foundType.toLowerCase().includes('parro') || foundType.toLowerCase().includes('parish'))) ? 'parroquia' :
                    (profileData.is_parish || profileData.is_parroquia || profileData.isParish || profileData.parish === true) ? 'parroquia' : 'capilla';
            }
        } catch (e) {
            // swallow errors silently (no debug logging required)
        }
    }, [profileData]);

    // Intentar extraer coordenadas en formato usable para el mapa
    let chapelLocation = null;
    if (profileData) {
        try {
            let lat = null;
            let lng = null;
            const coords = profileData.coordinates || profileData.coordinates_text || profileData.coords;
            if (coords && typeof coords === 'string' && coords.includes(',')) {
                const parts = coords.split(',').map(s => s.trim());
                lat = parseFloat(parts[0]);
                lng = parseFloat(parts[1]);
            } else if (profileData.latitude && profileData.longitude) {
                lat = parseFloat(profileData.latitude);
                lng = parseFloat(profileData.longitude);
            } else if (profileData.latitud && profileData.longitud) {
                lat = parseFloat(profileData.latitud);
                lng = parseFloat(profileData.longitud);
            } else if (profileData.location && profileData.location.lat && profileData.location.lng) {
                lat = parseFloat(profileData.location.lat);
                lng = parseFloat(profileData.location.lng);
            }

            if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
                // Determinar si el profile corresponde a una parroquia o capilla
                let tipo = 'capilla';

                // First, prefer an explicit chapel_base/parish_base flag if backend provides it
                const chapelBaseCandidates = [
                    profileData.chapel_base,
                    profileData.chapelBase,
                    profileData.is_chapel_base,
                    profileData.isChapelBase,
                    profileData.parish_base,
                    profileData.parishBase
                ];
                const chapelBaseRaw = chapelBaseCandidates.find(v => v !== undefined && v !== null);

                if (chapelBaseRaw !== undefined) {
                    let isParish = false;
                    if (typeof chapelBaseRaw === 'boolean') {
                        isParish = !!chapelBaseRaw;
                    } else if (typeof chapelBaseRaw === 'number') {
                        isParish = chapelBaseRaw === 1;
                    } else if (typeof chapelBaseRaw === 'string') {
                        isParish = ['1', 'true', 'yes', 'si'].includes(chapelBaseRaw.toLowerCase());
                    }
                    tipo = isParish ? 'parroquia' : 'capilla';
                } else {
                    const typeCandidates = [
                        profileData.type,
                        profileData.location_type,
                        profileData.locationType,
                        profileData.kind,
                        profileData.type_name,
                        profileData.category
                    ];

                    const foundType = typeCandidates.find(v => typeof v === 'string' && v.trim().length > 0);
                    if (foundType) {
                        tipo = foundType.toLowerCase() === 'parroquia' || foundType.toLowerCase() === 'parish' ? 'parroquia' : 'capilla';
                    } else if (profileData.is_parish || profileData.is_parroquia || profileData.isParish || profileData.parish === true) {
                        tipo = (profileData.is_parish || profileData.is_parroquia || profileData.isParish) ? 'parroquia' : 'capilla';
                    } else if (profileData.entity && profileData.entity.type) {
                        tipo = ('' + profileData.entity.type).toLowerCase() === 'parroquia' ? 'parroquia' : 'capilla';
                    }
                }

                chapelLocation = {
                    id: chapelId || profileData.id || 0,
                    nombre: profileData.chapel_name || profileData.name || profileData.parish_name || '',
                    latitud: lat,
                    longitud: lng,
                    tipo: tipo
                };
            }
        } catch (e) {
            chapelLocation = null;
        }
    }

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
                        <div className="vp-chapel-profile-photo">
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
                            {chapelLocation ? (
                                <div style={{ width: '100%' }}>
                                    <MyMapContainer
                                        locations={[chapelLocation]}
                                        mapCenter={{ latitud: chapelLocation.latitud, longitud: chapelLocation.longitud }}
                                        initialCenter={[chapelLocation.latitud, chapelLocation.longitud]}
                                        initialZoom={15}
                                        interactive={false}
                                        mapHeight={'500px'}
                                    />
                                </div>
                            ) : (
                                <div><strong>Coordenadas:</strong> {profileData.coordinates || 'No disponible'}</div>
                            )}
                            
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
                                            <button 
                                                className="mlap-home-reserve-btn"
                                                onClick={() => handleReserve(event.event_variant_id)}
                                            >
                                                Reservar
                                            </button>
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

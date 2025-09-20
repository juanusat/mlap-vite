import React from "react";
import ScreenMan from "../components/ScreenMan";
import { useParams } from "react-router-dom";
import "../utils/VistaPresentacion-Capilla.css";
import "../utils/Estilos-Generales-1.css";

// Simulación de datos de la tabla parish y chapel
const parishData = {
    id: 3,
    name: "Parroquia Santa María"
};

const chapelData = {
    id: 5,
    parish_id: 3,
    name: "Capilla San Juan",
    coordinates: "-6.7712, -79.8406",
    address: "Algarrobos 222, Chiclayo 14008",
    email: "capilla.sanjuan@ejemplo.com",
    phone: "965 783 222",
    profile_photo: "",
    cover_photo: "https://arquitecturapanamericana.com/wp-content/uploads/2016/03/REMODELACI%C3%93N-DE-LA-PARROQUIA-NUESTRA-SE%C3%91ORA-DE-LA-CONSOLACI%C3%93N.FOTO-SELECCIONADA.006.jpg",
    active: true,
    created_at: "2024-01-01 10:00:00",
    updated_at: "2024-09-20 09:00:00"
};

// Simulación de eventos
const events = [
    {
        id: 1,
        name: "Matrimonio Privado",
        type: "Privado",
        details: "Ceremonia privada para los novios y familiares cercanos."
    },
    {
        id: 2,
        name: "Matrimonio Comunitario",
        type: "Comunitario - Hasta 15 personas",
        details: "Ceremonia comunitaria para varios matrimonios."
    }
];

const options = [
    { href: "/capilla", label: "Bienvenida" }
];

export default function VistaPresentacion() {
    // const { parroquia, capilla } = useParams();

    return (
        <ScreenMan title="Capillas" options={options}>
            <main className="main-content vp-main-content">
                <section
                    className="chapel-header vp-chapel-header"
                    style={{
                        backgroundImage: `url(${chapelData.cover_photo})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "relative",
                    }}
                >
                    <div className="vp-header-overlay">
                        <h2 className="vp-chapel-title">
                            {parishData.name} - {chapelData.name}
                        </h2>
                    </div>
                </section>

                <div className="details-and-events-container vp-details-and-events">
                    <section className="chapel-details vp-chapel-details">
                        <div className="vp-contact-list">
                            <div><strong>Dirección:</strong> {chapelData.address}</div>
                            <div><strong>Correo:</strong> {chapelData.email}</div>
                            <div><strong>Teléfono:</strong> {chapelData.phone}</div>
                            <div><strong>Coordenadas:</strong> {chapelData.coordinates}</div>
                            <div><strong>Estado:</strong> {chapelData.active ? "Activa" : "Inactiva"}</div>
                        </div>
                    </section>

                    <aside className="events-section vp-events-section">
                        <h3>Eventos</h3>
                        <div className="vp-event-cards">
                            {events.map(event => (
                                <div className="event-card vp-event-card" key={event.id} style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                                    <div>
                                        <h4>{event.name}</h4>
                                        <p className="event-type">{event.type}</p>
                                        <p className="event-details">{event.details}</p>
                                    </div>
                                    <div className="vp-event-card-btn-row">
                                        <button className="mlap-home-reserve-btn">Reservar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </main>
        </ScreenMan>
    );
}
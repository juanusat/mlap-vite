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
    profile_photo: "data:image/jpeg;base64,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",
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
                        <div>
                            <img src={chapelData.profile_photo} alt="Chapel Profile" />
                        </div>
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
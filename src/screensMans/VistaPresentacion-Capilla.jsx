
import React from "react";
import ScreenMan from "../components/ScreenMan";
import { useParams } from "react-router-dom";


import "../utils/VistaPresentacion-Capilla.css";
import "../utils/Estilos-Generales-1.css";

const options = [
    { href: "/capilla", label: "Bienvenida" }
];

export default function VistaPresentacion() {
    const { parroquia, capilla } = useParams();
    const nombreCapilla = capilla || "Capilla número cinco";
    const nombreParroquia = parroquia || "parroquia número tres";
    const direccion = "Algarrobos 222, Chiclayo 14008";
    const contacto = "965 783 222";
    const horario = "Lunes - Domingo 2pm - 3pm";
    const bgImage = "https://arquitecturapanamericana.com/wp-content/uploads/2016/03/REMODELACI%C3%93N-DE-LA-PARROQUIA-NUESTRA-SE%C3%91ORA-DE-LA-CONSOLACI%C3%93N.FOTO-SELECCIONADA.006.jpg";

    return (
        <ScreenMan title="Capillas" options={options}>
            <main className="main-content vp-main-content">
                <section
                    className="chapel-header vp-chapel-header"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "relative",
                    }}
                >
                    <div className="vp-header-overlay">
                        <h2 className="vp-chapel-title">{`${nombreCapilla} de la ${nombreParroquia}`}</h2>
                    </div>
                </section>

                <div className="details-and-events-container vp-details-and-events">
                    <section className="chapel-details vp-chapel-details">
                        <p>Nuestra parroquia, ubicada en el corazón de nuestra comunidad, es un lugar de encuentro, fe y servicio. Más que un edificio, somos una familia de creyentes dedicada a vivir el Evangelio y a compartir su mensaje con todos.</p>
                        <p>Somos un refugio para quienes buscan consuelo, un faro de esperanza para quienes se sienten perdidos y una fuente de fortaleza para quienes enfrentan desafíos. A través de la oración, el estudio de la Biblia y el servicio a los demás, nos esforzamos por crear un espacio donde todos se sientan bienvenidos, valorados y amados.</p>
                        <ul className="contact-list vp-contact-list">
                            <li><strong>Dirección:</strong> {direccion}</li>
                            <li><strong>Contacto:</strong> {contacto}</li>
                            <li><strong>Horario:</strong> {horario}</li>
                        </ul>
                    </section>

                    <aside className="events-section vp-events-section">
                        <h3>Eventos</h3>
                        <div className="vp-event-cards">
                            <div className="event-card vp-event-card">
                                <h4>Matrimonio</h4>
                                <p className="event-type">Privado</p>
                                <p className="event-details">deascasdna sdjian djianmk asjinui asdijasdas deascasdna sdjian djianmk asjinui asdijasdas</p>
                                <MyButtonCenteredSides>
                                    <button className="mlap-home-reserve-btn" onClick={scrollToSearch}>Reservar</button>
                                </MyButtonCenteredSides>
                            </div>
                            <div className="event-card vp-event-card">
                                <h4>Matrimonio</h4>
                                <p className="event-type">Comunitario - Hasta 15 personas</p>
                                <p className="event-details">deascasdna sdjian djianmk asjinui asdijasdas deascasdna sdjian djianmk asjinui asdijasdas</p>
                                <MyButtonCenteredSides>
                                    <button className="mlap-home-reserve-btn" onClick={scrollToSearch}>Reservar ahora</button>
                                </MyButtonCenteredSides>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </ScreenMan>
    );
}

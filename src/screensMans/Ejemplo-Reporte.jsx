/**
 * =============================================================================
 * COMPONENTE DE EJEMPLO: PANTALLA DE REPORTE
 * =============================================================================
 * 
 * Este componente sirve como plantilla de referencia para crear reportes
 * en el sistema MLAP. Incluye todos los elementos comunes que debe tener
 * un reporte funcional.
 * 
 * CARACTERÍSTICAS PRINCIPALES:
 * - Filtros dinámicos para seleccionar entidades (capillas, parroquias, etc.)
 * - Carga de datos desde el backend mediante services
 * - Visualización con gráficos (usando componentes de charts)
 * - Resumen de datos con tarjetas informativas
 * - Totales calculados automáticamente
 * - Control de permisos integrado
 * - Manejo de estados de carga y errores
 * 
 * =============================================================================
 */

import React, { useState, useEffect } from 'react';
// Componente de gráfico de barras agrupadas
import GroupedBarChart from '../components/charts/GroupedBarChart';
// Servicios para consultar datos del backend
import { getReservationsByChapel } from '../services/reportService';
import { searchChapels } from '../services/chapelService';
// Hook personalizado para verificar permisos del usuario
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../utils/permissions';
// Componente para mostrar mensaje cuando no hay permisos
import NoPermissionMessage from '../components/NoPermissionMessage';
// Estilos específicos del reporte
import "../utils/ActosLiturgicos-Reporte01.css";

/**
 * =============================================================================
 * COMPONENTE PRINCIPAL: EjemploReporte
 * =============================================================================
 * 
 * Este componente gestiona toda la lógica de un reporte con múltiples capillas.
 * Permite seleccionar capillas, cargar sus datos y visualizarlos en un gráfico
 * con su respectivo resumen.
 */
export default function EjemploReporte() {
    // =========================================================================
    // ESTADOS DEL COMPONENTE
    // =========================================================================
    
    /**
     * selectedChapels: Array de nombres de capillas seleccionadas
     * Ejemplo: ['Capilla San José', 'Capilla Santa María']
     */
    const [selectedChapels, setSelectedChapels] = useState([]);
    
    /**
     * reportData: Array de objetos con datos procesados para el reporte
     * Estructura de cada objeto:
     * {
     *   capilla: 'Nombre de la capilla',
     *   resumenEventos: { 'Evento1': cantidad, 'Evento2': cantidad },
     *   totalReservas: number
     * }
     */
    const [reportData, setReportData] = useState([]);
    
    /**
     * isLoading: Booleano que indica si se están cargando datos
     * Se usa para mostrar spinners y deshabilitar botones
     */
    const [isLoading, setIsLoading] = useState(false);
    
    /**
     * availableChapels: Lista de todas las capillas disponibles
     * Se obtiene del backend al iniciar el componente
     */
    const [availableChapels, setAvailableChapels] = useState([]);
    
    /**
     * totals: Objeto con totales calculados del reporte
     * Se actualiza automáticamente cuando cambia reportData
     */
    const [totals, setTotals] = useState({
        totalReservas: 0
    });

    // =========================================================================
    // VERIFICACIÓN DE PERMISOS
    // =========================================================================
    
    /**
     * Hook personalizado que verifica si el usuario tiene el permiso necesario
     * para ver este reporte. Si no tiene permiso, se muestra un mensaje.
     */
    const { hasPermission } = usePermissions();
    const canRead = hasPermission(PERMISSIONS.ACTOS_LITURGICOS_REP01);

    // =========================================================================
    // FUNCIÓN: calculateTotals
    // =========================================================================
    
    /**
     * Calcula los totales de todas las reservas en el reporte.
     * Recorre todos los datos y suma las cantidades de cada evento.
     * 
     * Esta función se ejecuta automáticamente cada vez que cambia reportData
     * gracias al useEffect más abajo.
     */
    const calculateTotals = () => {
        let totalReservas = 0;
        
        // Recorrer cada capilla en el reporte
        reportData.forEach(item => {
            // Si tiene eventos resumidos
            if (item.resumenEventos) {
                // Sumar todas las cantidades de eventos
                Object.values(item.resumenEventos).forEach(val => {
                    totalReservas += Number(val);
                });
            }
        });
        
        // Actualizar el estado con el nuevo total
        setTotals({
            totalReservas
        });
    };

    // =========================================================================
    // EFFECT: Inicialización del componente
    // =========================================================================
    
    /**
     * Este useEffect se ejecuta UNA SOLA VEZ cuando el componente se monta.
     * - Establece el título de la página
     * - Carga la lista de capillas disponibles si el usuario tiene permisos
     */
    useEffect(() => {
        document.title = "MLAP | Ejemplo de Reporte";
        
        // Solo cargar datos si el usuario tiene permiso
        if (canRead) {
            loadAvailableChapels();
        }
    }, [canRead]); // Se ejecuta cuando cambia canRead

    // =========================================================================
    // EFFECT: Cálculo automático de totales
    // =========================================================================
    
    /**
     * Este useEffect recalcula los totales cada vez que cambian los datos
     * del reporte. Es como un "Excel automático" que actualiza las sumas.
     */
    useEffect(() => {
        calculateTotals();
    }, [reportData]); // Se ejecuta cuando cambia reportData

    // =========================================================================
    // VALIDACIÓN DE PERMISOS
    // =========================================================================
    
    /**
     * Si el usuario NO tiene permiso, mostrar mensaje y detener ejecución.
     * Esto previene que usuarios sin autorización vean información sensible.
     */
    if (!canRead) {
        return <NoPermissionMessage />;
    }

    // =========================================================================
    // FUNCIÓN: loadAvailableChapels
    // =========================================================================
    
    /**
     * Carga la lista de todas las capillas disponibles desde el backend.
     * Esta lista se usa para poblar el select de selección de capillas.
     * 
     * @async
     * @returns {Promise<void>}
     */
    const loadAvailableChapels = async () => {
        try {
            // Llamar al servicio que consulta el backend
            // Parámetros: (página, límite, término de búsqueda)
            const response = await searchChapels(1, 100, '');
            
            // Actualizar el estado con las capillas obtenidas
            setAvailableChapels(response.data || []);
        } catch (error) {
            // En caso de error, mostrarlo en consola
            console.error('Error al cargar capillas:', error);
        }
    };

    // =========================================================================
    // FUNCIÓN: addChapel
    // =========================================================================
    
    /**
     * Agrega una capilla al reporte.
     * - Verifica que no esté ya seleccionada
     * - Carga los datos de reservas de esa capilla
     * - Procesa los datos para el gráfico
     * - Actualiza los estados correspondientes
     * 
     * @async
     * @param {string} chapelName - Nombre de la capilla a agregar
     * @returns {Promise<void>}
     */
    const addChapel = async (chapelName) => {
        // Validación: no agregar capillas vacías o duplicadas
        if (!chapelName || selectedChapels.includes(chapelName)) {
            return;
        }

        // Activar indicador de carga
        setIsLoading(true);
        
        try {
            // =====================================================================
            // PASO 1: Obtener datos del backend
            // =====================================================================
            const response = await getReservationsByChapel(chapelName);
            const stats = response.data.statistics;
            
            // Variable para contar total de reservas
            let totalReservasCapilla = 0;
            
            // Log de debug para verificar datos
            stats.forEach(s => {
                const cantidad = Number(s.count) || 0;
                totalReservasCapilla += cantidad;
                console.log(`Capilla: ${chapelName} | Estado: ${s.status} | Cantidad: ${cantidad}`);
            });
            console.log(`Total de reservas obtenidas para capilla ${chapelName}: ${totalReservasCapilla}`);

            // =====================================================================
            // PASO 2: Filtrar solo reservas con estado FULFILLED
            // =====================================================================
            // FULFILLED = reservas completadas y cumplidas
            const fulfilledStats = stats.filter(s => s.status === 'FULFILLED');
            
            // =====================================================================
            // PASO 3: Agrupar reservas por evento base
            // =====================================================================
            const resumenPorEvento = {};
            
            fulfilledStats.forEach(s => {
                // Verificar que tenga array de reservas
                if (s.reservations && Array.isArray(s.reservations)) {
                    s.reservations.forEach(r => {
                        // Obtener nombre del evento base (Misa, Bautismo, etc.)
                        const eventoBase = r.event_base_name || 'Evento';
                        
                        // Incrementar contador de ese evento
                        resumenPorEvento[eventoBase] = (resumenPorEvento[eventoBase] || 0) + 1;
                        
                        // Log de cada reserva procesada
                        console.log(`Reserva FULFILLED | Usuario: ${r.user_id} | Beneficiario: ${r.beneficiary_full_name} | Evento base: ${eventoBase}`);
                    });
                }
            });

            // =====================================================================
            // PASO 4: Calcular total de reservas FULFILLED
            // =====================================================================
            const totalFulfilledCapilla = Object.values(resumenPorEvento)
                .reduce((sum, val) => sum + Number(val), 0);

            // =====================================================================
            // PASO 5: Crear objeto con estructura para el gráfico
            // =====================================================================
            const chapelData = {
                capilla: chapelName,                    // Nombre de la capilla
                resumenEventos: resumenPorEvento,       // Objeto con eventos y cantidades
                totalReservas: totalFulfilledCapilla    // Total de esta capilla
            };

            // =====================================================================
            // PASO 6: Actualizar estados del componente
            // =====================================================================
            // Agregar datos al reporte (mantiene los anteriores con spread operator)
            setReportData(prev => [...prev, chapelData]);
            
            // Agregar nombre a la lista de seleccionados
            setSelectedChapels(prev => [...prev, chapelName]);
            
        } catch (error) {
            // Manejo de errores: mostrar en consola y alertar al usuario
            console.error('Error al cargar datos de capilla:', error);
            alert(`Error al cargar datos de ${chapelName}: ${error.message}`);
        } finally {
            // Siempre desactivar indicador de carga (éxito o error)
            setIsLoading(false);
        }
    };

    // =========================================================================
    // FUNCIÓN: removeChapel
    // =========================================================================
    
    /**
     * Elimina una capilla del reporte.
     * Filtra los arrays de datos y seleccionados para remover la capilla.
     * 
     * @param {string} chapelName - Nombre de la capilla a remover
     * @returns {void}
     */
    const removeChapel = (chapelName) => {
        // Filtrar reportData: mantener solo las capillas que NO sean la removida
        setReportData(prev => prev.filter(item => item.capilla !== chapelName));
        
        // Filtrar selectedChapels: mantener solo los nombres que NO sean el removido
        setSelectedChapels(prev => prev.filter(name => name !== chapelName));
    };

    // =========================================================================
    // PREPARACIÓN DE DATOS PARA EL GRÁFICO
    // =========================================================================
    
    /**
     * Extraer nombres de capillas del reportData para pasarlos al componente
     * GroupedBarChart como categorías del eje X.
     */
    const capillas = reportData.map(item => item.capilla);

    // =========================================================================
    // RENDERIZADO DEL COMPONENTE
    // =========================================================================
    
    return (
        <>
            {/* Contenedor principal del módulo */}
            <div className="content-module only-this">
                {/* Título de la pantalla */}
                <h2 className='title-screen'>Ejemplo de Reporte: Reservas por Capilla</h2>
                
                {/* Contenedor de la aplicación */}
                <div className='app-container'>
                    <div className="reporte01-container">

                        {/* =======================================================
                            SECCIÓN: CONTROLES DE FILTROS
                            ======================================================= */}
                        <div className="filter-controls-ALR1">
                            
                            {/* Selector de capillas */}
                            <div className="chapel-selector">
                                <label htmlFor="chapel-select">Seleccionar Capilla:</label>
                                <select
                                    id="chapel-select"
                                    onChange={(e) => addChapel(e.target.value)}
                                    value="" // Siempre vacío para poder seleccionar la misma capilla múltiples veces
                                    disabled={isLoading} // Deshabilitar mientras carga
                                >
                                    <option value="">-- Seleccione una capilla --</option>
                                    {/* Filtrar capillas: mostrar solo las NO seleccionadas */}
                                    {availableChapels
                                        .filter(chapel => !selectedChapels.includes(chapel.name))
                                        .map(chapel => (
                                            <option key={chapel.id} value={chapel.name}>
                                                {chapel.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Lista de capillas seleccionadas (solo si hay alguna) */}
                            {selectedChapels.length > 0 && (
                                <div className="selected-chapels">
                                    <h4>Capillas Seleccionadas:</h4>
                                    <ul>
                                        {selectedChapels.map(chapelName => (
                                            <li key={chapelName}>
                                                <span>{chapelName}</span>
                                                {/* Botón para remover capilla */}
                                                <button
                                                    onClick={() => removeChapel(chapelName)}
                                                    className="remove-chapel-btn"
                                                    disabled={isLoading}
                                                >
                                                    ×
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* =======================================================
                            MENSAJE: CARGANDO DATOS
                            ======================================================= */}
                        {isLoading && (
                            <div className="loading-message">
                                <p>Cargando datos...</p>
                            </div>
                        )}

                        {/* =======================================================
                            MENSAJE: SIN DATOS
                            ======================================================= */}
                        {!isLoading && reportData.length === 0 && (
                            <div className="empty-message">
                                <p>Seleccione una o más capillas para generar el reporte.</p>
                            </div>
                        )}

                        {/* =======================================================
                            SECCIÓN: GRÁFICO Y RESUMEN
                            Solo se muestra si hay datos y no está cargando
                            ======================================================= */}
                        {!isLoading && reportData.length > 0 && (
                            <div className="chart-summary-wrapper">
                                
                                {/* Sección del gráfico */}
                                <div className="chart-section">
                                    {/* 
                                        Componente GroupedBarChart:
                                        - data: array de objetos con estructura {capilla, resumenEventos, totalReservas}
                                        - categories: array de nombres de capillas (para eje X)
                                    */}
                                    <GroupedBarChart
                                        data={reportData}
                                        categories={capillas}
                                    />
                                </div>

                                {/* Sección del resumen lateral */}
                                <div className="summary-section">
                                    <h3 className="summary-title">Resumen por Capilla</h3>
                                    
                                    {/* Contenedor de tarjetas de resumen */}
                                    <div className="summary-cards-container">
                                        {/* Mapear cada capilla del reporte */}
                                        {reportData.map((item) => (
                                            <div className="summary-card-content" key={item.capilla}>
                                                {/* Nombre de la capilla */}
                                                <h4 className="summary-card-title">{item.capilla}</h4>
                                                
                                                {/* Si no tiene reservas, mostrar mensaje */}
                                                {item.totalReservas === 0 ? (
                                                    <div className="summary-item">
                                                        <div className="summary-content">
                                                            <span className="summary-label" style={{ fontStyle: 'italic', color: '#999' }}>
                                                                Sin reservas
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* Si tiene reservas, listar cada evento con su cantidad */
                                                    item.resumenEventos && Object.entries(item.resumenEventos).map(([evento, cantidad]) => (
                                                        <div className="summary-item" key={evento}>
                                                            {/* Indicador visual (punto de color) */}
                                                            <div className="summary-indicator"></div>
                                                            <div className="summary-content">
                                                                {/* Nombre del evento */}
                                                                <span className="summary-label">{evento}</span>
                                                                {/* Cantidad de reservas */}
                                                                <span className="summary-value">{cantidad}</span>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Línea divisora */}
                                    <div className="summary-divider"></div>
                                    
                                    {/* Total general de todas las capillas */}
                                    <div className="summary-total">
                                        <span className="total-label">Total de Reservas</span>
                                        <span className="total-value">{totals.totalReservas}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

/**
 * =============================================================================
 * NOTAS DE USO Y PERSONALIZACIÓN
 * =============================================================================
 * 
 * Para adaptar este componente a otro tipo de reporte:
 * 
 * 1. CAMBIAR EL SERVICIO:
 *    - Reemplazar getReservationsByChapel() por tu servicio específico
 *    - Adaptar la estructura de datos que devuelve el backend
 * 
 * 2. AJUSTAR LOS FILTROS:
 *    - Cambiar searchChapels() por otro selector (parroquias, usuarios, etc.)
 *    - Modificar el estado selectedChapels según tu entidad
 * 
 * 3. PERSONALIZAR EL PROCESAMIENTO:
 *    - En addChapel(), ajustar cómo se agrupan y calculan los datos
 *    - Modificar resumenEventos según tus métricas
 * 
 * 4. ACTUALIZAR PERMISOS:
 *    - Cambiar PERMISSIONS.ACTOS_LITURGICOS_REP01 por el permiso correcto
 * 
 * 5. MODIFICAR ESTILOS:
 *    - Importar tu propio archivo CSS
 *    - Mantener la estructura de clases para consistencia
 * 
 * 6. CAMBIAR COMPONENTE DE GRÁFICO:
 *    - Si necesitas otro tipo de gráfico (líneas, pie, etc.)
 *    - Reemplazar GroupedBarChart por el componente apropiado
 * 
 * 7. ACTUALIZAR TÍTULO:
 *    - Cambiar document.title y el <h2> del renderizado
 * 
 * =============================================================================
 */

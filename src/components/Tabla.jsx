import React, { useState } from 'react';
import MyButtonShortAction from "../components/MyButtonShortAction";
import './Tabla.css';

const DynamicTable = ({ columns, data, itemsPerPage = 10, gridColumnsLayout = '', columnLeftAlignIndex = [] }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState(null);
    const tableColumns = [...columns];

    const alignmentClasses = {
        Left: "align-left"
    };

    // Lógica para ordenar los datos
    const sortedData = [...data];
    if (sortConfig !== null) {
        sortedData.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        
        // Muestra el arreglo ordenado en la consola
        console.log("Arreglo ordenado:", sortedData);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    // Nueva función para manejar el clic en la cabecera
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        // Muestra el ID de la columna por la que se ordena
        console.log("Ordenando por columna:", key);
        setSortConfig({ key, direction });
        setCurrentPage(1); // Opcional: regresar a la primera página al ordenar
    };

    return (
        <div>
            <div
                className="grid-container"
                style={{ gridTemplateColumns: gridColumnsLayout }}
            >
                {tableColumns.map((column, colIndex) => {
                    return (
                        <div
                            className={`grid-header grid-cell-${column.key}`}
                            key={column.key}
                            onClick={() => handleSort(column.key)}
                        >
                            {column.header}
                            {sortConfig && sortConfig.key === column.key && (
                                <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                            )}
                        </div>
                    );
                })}

                {/* Filas de la tabla */}
                {currentItems.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        {tableColumns.map((column, colIndex) => {
                            const isTargetColumn = columnLeftAlignIndex.includes(colIndex + 1);
                            const alignClass = isTargetColumn ? alignmentClasses.Left : "";

                            return (
                                <div
                                    className={`grid-table-cell ${rowIndex % 2 === 1 ? "row-par" : "row-impar"} ${alignClass}`}
                                    key={column.key}
                                >
                                    {column.accessor(row)}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>

            {/* Paginación */}
            {data.length > itemsPerPage && (
                <div className="pagination">
                    <MyButtonShortAction
                        type="back"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        title='Atrás'
                    />
                    <span>Página {currentPage} de {totalPages}</span>
                    <MyButtonShortAction
                        type="next"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        title='Siguiente'
                    />
                </div>
            )}
        </div>
    );
};

export default DynamicTable;
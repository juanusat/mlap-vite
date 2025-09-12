import React, { useState } from 'react';
import MyButtonShortAction from "../components2/MyButtonShortAction";
import './Tabla.css';

// Ahora, columnLeftAlignIndex es un arreglo vacío por defecto
const DynamicTable = ({ columns, data, itemsPerPage = 10, gridColumnsLayout = '', columnLeftAlignIndex = [] }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const tableColumns = [...columns];

    const alignmentClasses = {
        Left: "align-left"
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
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
                        >
                            {column.header}
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
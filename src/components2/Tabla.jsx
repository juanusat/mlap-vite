import React, { useState } from 'react';
import MyButtonShortAction from "../components2/MyButtonShortAction";
import './Tabla.css';

const DynamicTable = ({ columns, data, itemsPerPage = 10, gridColumnsLayout = '', columnAlign = null }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const tableColumns = [...columns];
    const ghostColumnStart = { key: 'ghost-start', header: '', accessor: () => null };
    const ghostColumnEnd = { key: 'ghost-end', header: '', accessor: () => null };

    tableColumns.splice(0, 0, ghostColumnStart);
    tableColumns.splice(tableColumns.length, 0, ghostColumnEnd);

    const alignmentClasses = {
        Left: "align-left",
        Center: "align-center",
        Right: "align-right"
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
                {/* Encabezados de la tabla, usando las columnas modificadas */}
                {tableColumns.map((column, colIndex) => {
                    const isTargetColumn = columnAlign && colIndex + 1 === columnAlign.column;
                    const alignClass = isTargetColumn ? alignmentClasses[columnAlign.align] : "";
                    return (
                        <div
                            className={`grid-header grid-cell-${column.key} ${alignClass}`}
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
                            const isTargetColumn = columnAlign && colIndex + 1 === columnAlign.column;
                            const alignClass = isTargetColumn ? alignmentClasses[columnAlign.align] : "";

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
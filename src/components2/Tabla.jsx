import React, { useState } from 'react';
import MyButtonShortAction from "../components2/MyButtonShortAction";
import './Tabla.css';

// Example of a reusable table component
const DynamicTable = ({ columns, data, itemsPerPage = 4 }) => {

    const [currentPage, setCurrentPage] = useState(1);
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
        <div className="table-container">
            <table className="dynamic-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column) => (
                                <td key={column.key}>
                                    {column.accessor(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length > itemsPerPage && (
                <div className="pagination">
                    <MyButtonShortAction type="back" onClick={handlePrevPage} disabled={currentPage === 1} />
                    <span>Página {currentPage} de {totalPages}</span>
                    <MyButtonShortAction type="next" onClick={handleNextPage} disabled={currentPage === totalPages} />
                </div>
            )}
        </div>
    );
};

export default DynamicTable;
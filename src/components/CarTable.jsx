import React from "react";

function CarTable({ cars, onSort, onEdit, onDelete }) {
    return (
        <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
            <thead>
            <tr>
                <th onClick={() => onSort("brand")}>Brand ⬍</th>
                <th onClick={() => onSort("model")}>Model ⬍</th>
                <th onClick={() => onSort("color")}>Color ⬍</th>
                <th onClick={() => onSort("modelYear")}>Year ⬍</th>
                <th onClick={() => onSort("price")}>Price ⬍</th>
                <th>Actions</th>
            </tr>
            </thead>

            <tbody>
            {cars.map(car => (
                <tr key={car.id}>
                    <td>{car.brand}</td>
                    <td>{car.model}</td>
                    <td>{car.color}</td>
                    <td>{car.modelYear}</td>
                    <td>{car.price}</td>
                    <td>
                        <button onClick={() => onEdit(car)}>Edit</button>
                        <button onClick={() => onDelete(car.id)}>Delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default CarTable;

import React, { useState, useEffect } from "react";

function CarForm({ selectedCar, onSave, onCancel }) {
    const [car, setCar] = useState({
        brand: "",
        model: "",
        color: "",
        registrationNumber: "",
        modelYear: "",
        price: ""
    });

    useEffect(() => {
        if (selectedCar) {
            setCar(selectedCar);
        }
    }, [selectedCar]);

    function handleChange(e) {
        setCar({ ...car, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSave(car);
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <h3>{selectedCar ? "Edit Car" : "Create Car"}</h3>

            <input name="brand" placeholder="Brand" value={car.brand} onChange={handleChange} />
            <input name="model" placeholder="Model" value={car.model} onChange={handleChange} />
            <input name="color" placeholder="Color" value={car.color} onChange={handleChange} />
            <input name="registrationNumber" placeholder="Reg Number" value={car.registrationNumber} onChange={handleChange} />
            <input name="modelYear" placeholder="Year" value={car.modelYear} onChange={handleChange} />
            <input name="price" placeholder="Price" value={car.price} onChange={handleChange} />

            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
}

export default CarForm;

// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Login from "./Login";
import Register from "./Register";
import { api, CARS_BASE, clearJwt, getJwt } from "./api";

const API_URL = "/cars";

function App() {
    // const [isAuth, setIsAuth] = useState(!!getJwt());
    // const [showRegister, setShowRegister] = useState(false);

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sortField, setSortField] = useState("brand");
    const [sortDirection, setSortDirection] = useState("asc");

    const [showForm, setShowForm] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [formData, setFormData] = useState({
        brand: "", model: "", color: "",
        registrationNumber: "", modelYear: "", price: "",
    });

    // ------- auth gate -------
    // if (!isAuth) {
    //     return showRegister ? (
    //         <Register goToLogin={() => setShowRegister(false)} />
    //     ) : (
    //         <Login onLogin={() => setIsAuth(true)} goToRegister={() => setShowRegister(true)} />
    //     );
    // }

    // ------- data ------
    const fetchCars = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get(API_URL); // Authorization добавится interceptor-ом
            setCars(data);
        } catch (e) {
            console.error(e);
            if (e?.response?.status === 401) {
                // токен истёк/невалиден
                clearJwt();
                setIsAuth(false);
                return;
            }
            setError("Failed to load cars");
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     if (isAuth) fetchCars();
    // }, [isAuth]);

    useEffect(() => {
        fetchCars();
    }, []);



    // ------- sorting ------
    const toggleSort = (field) => {
        if (sortField === field) setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortField(field); setSortDirection("asc"); }
    };

    const sortedCars = useMemo(() => {
        const arr = [...cars];
        arr.sort((a, b) => {
            const av = a?.[sortField], bv = b?.[sortField];
            if (av == null) return 1;
            if (bv == null) return -1;
            if (typeof av === "number" && typeof bv === "number") {
                return sortDirection === "asc" ? av - bv : bv - av;
            }
            const as = String(av).toLowerCase();
            const bs = String(bv).toLowerCase();
            if (as < bs) return sortDirection === "asc" ? -1 : 1;
            if (as > bs) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
        return arr;
    }, [cars, sortField, sortDirection]);

    const sortArrow = (field) => (sortField === field ? (sortDirection === "asc" ? " ▲" : " ▼") : "");

    // ------- form ------
    const openCreateForm = () => {
        setEditingCar(null);
        setFormData({ brand: "", model: "", color: "", registrationNumber: "", modelYear: "", price: "" });
        setShowForm(true);
    };
    const openEditForm = (car) => {
        setEditingCar(car);
        setFormData({
            brand: car.brand || "",
            model: car.model || "",
            color: car.color || "",
            registrationNumber: car.registrationNumber || "",
            modelYear: car.modelYear || "",
            price: car.price || "",
        });
        setShowForm(true);
    };
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const body = {
            ...formData,
            modelYear: formData.modelYear ? Number(formData.modelYear) : null,
            price: formData.price ? Number(formData.price) : null,
        };
        const isEdit = !!editingCar;
        try {
            if (isEdit) {
                await api.put(`${API_URL}/${editingCar.id}`, body);
            } else {
                await api.post(API_URL, body);
            }
            setShowForm(false);
            setEditingCar(null);
            fetchCars();
        } catch (err) {
            console.error(err);
            setError("Failed to save car");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this car?")) return;
        try {
            await api.delete(`${API_URL}/${id}`);
            fetchCars();
        } catch (err) {
            console.error(err);
            setError("Failed to delete car");
        }
    };

    const handleLogout = () => {
        clearJwt();
        setIsAuth(false);
    };

    // ------- UI -------
    return (
        <div style={{ padding: "40px", fontFamily: "system-ui" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <h1>Car Management</h1>
                {/*<Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>*/}
            </Stack>

            <Button variant="contained" color="primary" onClick={openCreateForm} sx={{ mb: 2 }}>
                Create Car
            </Button>

            {showForm && (
                <form
                    onSubmit={handleFormSubmit}
                    style={{ marginBottom: "24px", padding: "16px", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "700px" }}
                >
                    <h2 style={{ marginTop: 0 }}>{editingCar ? "Edit Car" : "Create Car"}</h2>
                    <Stack spacing={2} direction="row" flexWrap="wrap">
                        <TextField label="Brand" name="brand" value={formData.brand} onChange={handleFormChange} required sx={{ minWidth: "45%" }} />
                        <TextField label="Model" name="model" value={formData.model} onChange={handleFormChange} required sx={{ minWidth: "45%" }} />
                        <TextField label="Color" name="color" value={formData.color} onChange={handleFormChange} sx={{ minWidth: "45%" }} />
                        <TextField label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleFormChange} sx={{ minWidth: "45%" }} />
                        <TextField label="Model Year" type="number" name="modelYear" value={formData.modelYear} onChange={handleFormChange} sx={{ minWidth: "45%" }} />
                        <TextField label="Price" type="number" name="price" value={formData.price} onChange={handleFormChange} sx={{ minWidth: "45%" }} />
                    </Stack>
                    <Stack direction="row" spacing={2} mt={2}>
                        <Button type="submit" variant="contained" color="success">Save</Button>
                        <Button variant="outlined" onClick={() => { setShowForm(false); setEditingCar(null); }}>Cancel</Button>
                    </Stack>
                </form>
            )}

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <table style={{ borderCollapse: "collapse", width: "100%", minWidth: "800px" }}>
                    <thead>
                    <tr>
                        <Th onClick={() => toggleSort("brand")}>Brand{sortArrow("brand")}</Th>
                        <Th onClick={() => toggleSort("model")}>Model{sortArrow("model")}</Th>
                        <Th onClick={() => toggleSort("color")}>Color{sortArrow("color")}</Th>
                        <Th onClick={() => toggleSort("registrationNumber")}>Reg. Number{sortArrow("registrationNumber")}</Th>
                        <Th onClick={() => toggleSort("modelYear")}>Year{sortArrow("modelYear")}</Th>
                        <Th onClick={() => toggleSort("price")}>Price{sortArrow("price")}</Th>
                        <Th>Actions</Th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedCars.map((car) => (
                        <tr key={car.id}>
                            <Td>{car.brand}</Td>
                            <Td>{car.model}</Td>
                            <Td>{car.color}</Td>
                            <Td>{car.registrationNumber}</Td>
                            <Td>{car.modelYear}</Td>
                            <Td>{car.price}</Td>
                            <Td>
                                <Stack direction="row" spacing={1}>
                                    <Tooltip title="Edit car">
                                        <IconButton aria-label="edit" size="small" onClick={() => openEditForm(car)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete car">
                                        <IconButton aria-label="delete" size="small" onClick={() => handleDelete(car.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function Th({ children, onClick }) {
    return (
        <th
            onClick={onClick}
            style={{ borderBottom: "2px solid #ddd", padding: "8px 12px", textAlign: "left", cursor: onClick ? "pointer" : "default", userSelect: "none" }}
        >
            {children}
        </th>
    );
}
function Td({ children }) {
    return <td style={{ borderBottom: "1px solid #eee", padding: "8px 12px" }}>{children}</td>;
}

export default App;

const API_URL = "http://localhost:8080/cars";

export async function getCars() {
    const res = await fetch(API_URL);
    return res.json();
}

export async function createCar(car) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(car)
    });
    return res.json();
}

export async function updateCar(id, car) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(car)
    });
    return res.json();
}

export async function deleteCar(id) {
    return fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

import { api } from "../api";

export async function getCars() {
    const { data } = await api.get("/cars");
    return data;
}

export async function createCar(car) {
    const { data } = await api.post("/cars", car);
    return data;
}

export async function updateCar(id, car) {
    const { data } = await api.put(`/cars/${id}`, car);
    return data;
}

export async function deleteCar(id) {
    await api.delete(`/cars/${id}`);
}

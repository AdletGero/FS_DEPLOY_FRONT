// src/Register.jsx
import { useState } from "react";
import axios from "axios";
import { AUTH_BASE } from "./api";
import {
    Paper, Stack, TextField, Button, Typography,
    Snackbar, Alert
} from "@mui/material";

export default function Register({ goToLogin }) {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [okOpen, setOkOpen] = useState(false);
    const [errOpen, setErrOpen] = useState(false);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrOpen(false);
        try {
            // твой бэк: POST /auth/registration, тело { username, email, password }
            await axios.post(`${AUTH_BASE}/registration`, form, {
                headers: { "Content-Type": "application/json" },
            });
            setOkOpen(true);
            setTimeout(() => goToLogin(), 1200);
        } catch (e) {
            console.error(e);
            setErrOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: "100vh", bgcolor: "#f6f7fb" }}>
            <Paper sx={{ p: 4, width: 340 }}>
                <Typography variant="h5" mb={2} textAlign="center">Register</Typography>
                <form onSubmit={onSubmit}>
                    <TextField fullWidth label="Username" name="username" value={form.username} onChange={onChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Email" name="email" value={form.email} onChange={onChange} sx={{ mb: 2 }} />
                    <TextField fullWidth type="password" label="Password" name="password" value={form.password} onChange={onChange} sx={{ mb: 2 }} />
                    <Button fullWidth variant="contained" type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Sign up"}
                    </Button>
                </form>

                <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={goToLogin}>
                    Already have an account? Login
                </Button>
            </Paper>

            <Snackbar open={okOpen} autoHideDuration={2000} onClose={() => setOkOpen(false)}>
                <Alert severity="success" sx={{ width: "100%" }}>Registration successful</Alert>
            </Snackbar>
            <Snackbar open={errOpen} autoHideDuration={3000} onClose={() => setErrOpen(false)}>
                <Alert severity="error" sx={{ width: "100%" }}>
                    Registration failed. Username or email may be taken.
                </Alert>
            </Snackbar>
        </Stack>
    );
}

// src/Login.jsx
import { useState } from "react";
import axios from "axios";
import { AUTH_BASE, setJwt } from "./api";
import {
    Paper, Stack, TextField, Button, Typography,
    Snackbar, Alert
} from "@mui/material";

export default function Login({ onLogin, goToRegister }) {
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
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
            // твой бэк: POST /auth/login, тело { username, password }
            const res = await axios.post(`${AUTH_BASE}/login`, form, {
                headers: { "Content-Type": "application/json" },
            });

            // Бэк может вернуть токен в ТЕЛЕ (JwtAuthenticationResponse) или в HEADER
            const headerAuth = res.headers?.authorization;            // "Bearer <...>" (если так сделано)
            const bodyToken = res.data?.token || res.data?.jwt || res.data; // {token: "..."} или просто строка

            let jwt = "";
            if (headerAuth && headerAuth.toLowerCase().startsWith("bearer ")) {
                jwt = headerAuth.slice(7);
            } else if (typeof bodyToken === "string") {
                jwt = bodyToken;
            } else if (typeof bodyToken === "object" && bodyToken) {
                // на случай { token: "..." }
                jwt = bodyToken.token || bodyToken.jwt || "";
            }

            if (!jwt) throw new Error("No JWT received");

            setJwt(jwt);
            onLogin();
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
                <Typography variant="h5" mb={2} textAlign="center">Login</Typography>
                <form onSubmit={onSubmit}>
                    <TextField
                        fullWidth label="Username" name="username"
                        value={form.username} onChange={onChange} sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth type="password" label="Password" name="password"
                        value={form.password} onChange={onChange} sx={{ mb: 2 }}
                    />
                    <Button fullWidth variant="contained" type="submit" disabled={loading}>
                        {loading ? "Logging in…" : "Login"}
                    </Button>
                </form>

                <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={goToRegister}>
                    Don’t have an account? Register
                </Button>
            </Paper>

            <Snackbar open={errOpen} autoHideDuration={3000} onClose={() => setErrOpen(false)}>
                <Alert severity="error" sx={{ width: "100%" }}>Invalid credentials</Alert>
            </Snackbar>
        </Stack>
    );
}

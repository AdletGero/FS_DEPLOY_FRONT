import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import App from "./App";

test("App renders title", () => {
    render(<App />);
    expect(screen.getByText(/Car Management/i)).toBeInTheDocument();
});
test("Create Car button exists", () => {
    render(<App />);
    expect(screen.getByText(/Create Car/i)).toBeInTheDocument();
});

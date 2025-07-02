import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';


const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        setError(""); // Clear error on input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        try {
            const response = await axios.post("http://localhost:8027/auth/login", { email, password });
            const { token, statusCode, message } = response.data;

            switch (statusCode) {
                case 200:
                    localStorage.setItem("token", token);
                    const decoded = jwtDecode(token);
                    if (decoded?.roles) {
                        localStorage.setItem("role", decoded.roles[0].authority);
                    }
                    setSuccess("Login successful! Redirecting to profile...");
                    setTimeout(() => navigate("/profile"), 2000);
                    break;

                case 401:
                    setError("Invalid email or password.");
                    break;

                case 403:
                    setError("Account not verified.");
                    break;

                case 404:
                    setError("User not found.");
                    break;

                case 500:
                    setError("Server error. Please try again later.");
                    break;

                default:
                    setError(message || "Something went wrong.");
            }
        } catch (error) {
            if (error.response && error.response.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };


    return (
        <section className="h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Login</h2>

                {error && (
                    <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 text-green-600 text-sm bg-green-50 p-2 rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded text-indigo-600" />
                            Remember me
                        </label>
                        <Link to="/auth/forgot-password" className="text-indigo-600 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition duration-200"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <Link to="/auth/register" className="text-indigo-600 font-medium hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </section>

    );
};

export default Login;

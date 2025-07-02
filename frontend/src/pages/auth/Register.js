import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER"
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, role } = formData;
        try {
            const response = await axios.post("http://localhost:8027/auth/register", {
                name, email, password, role
            });

            const { statusCode, message } = response.data;

            switch (statusCode) {
                case 201:
                    setSuccess("Successfully registered! Redirecting to login...");
                    setTimeout(() => navigate("/auth/login"), 2000);
                    break;

                case 409:
                    setError("Email already registered.");
                    break;

                case 400:
                    setError("Invalid input. Please check all fields.");
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


    const handleGoogleOAuth = () => {
        // Redirect to your Google OAuth route (e.g., Firebase/Auth0/backend)
        window.location.href = "/auth/google";
    };

    const handleMicrosoftOAuth = () => {
        // Redirect to your Microsoft OAuth route
        window.location.href = "/auth/microsoft";
    };

    return (
        <section className="h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Create an Account</h2>

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
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
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
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                    >
                        Register
                    </button>
                </form>

                <div className="my-6 text-sm text-gray-500 text-center">or</div>

                <div className="space-y-3">
                    <button
                        onClick={handleGoogleOAuth}
                        className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                        <span>Continue with Google</span>
                    </button>

                    <button
                        onClick={handleMicrosoftOAuth}
                        className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                        <img src="https://img.icons8.com/?size=100&id=22989&format=png&color=000000" alt="Microsoft" className="h-5 w-5" />
                        <span>Continue with Microsoft</span>
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="text-indigo-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Register;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1 = Email, 2 = OTP, 3 = Reset Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8027/auth/email/reset-password/send-otp", { email });
            const { statusCode, message } = response.data;

            switch (statusCode) {
                case 200:
                    setMessage("OTP has been sent to your email.");
                    setStep(2);
                    break;
                case 403:
                    setError("User not verified.");
                    break;
                case 404:
                    setError("User not found.");
                    break;
                case 500:
                    setError("Server error. Please try again later.");
                    break;
                default:
                    setError(message || "Unexpected error occurred.");
            }
        } catch (err) {
            setError("Network or server error. Try again.");
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("OTP must be 6 digits.");
            return;
        }
        setMessage("OTP verified. Please enter your new password.");
        setStep(3);
        setError("");
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            const payload = { email, otp, newPassword };
            const response = await axios.post("http://localhost:8027/auth/email/reset-password/verify-otp", payload);
            const { statusCode, message } = response.data;

            switch (statusCode) {
                case 200:
                    setMessage("Password reset successful. Redirecting to login...");
                    setTimeout(() => handleLogout(), 2000);
                    break;
                case 400:
                    setError("Invalid OTP.");
                    break;
                case 403:
                    setError("User not verified.");
                    break;
                case 404:
                    setError("User not found.");
                    break;
                case 500:
                    setError("Server error. Please try again later.");
                    break;
                default:
                    setError(message || "Unexpected error occurred.");
            }
        } catch (err) {
            setError("Network or server error. Try again.");
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        window.location.href = '/auth/login';
    };

    
    return (
        <section className="h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
                    {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
                </h2>

                {message && (
                    <div className="mb-4 text-green-600 text-sm bg-green-50 p-2 rounded">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Enter Registered Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
                            Send OTP
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleOtpSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                Enter OTP sent to {email}
                            </label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                                required
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                            Verify OTP
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handlePasswordReset} className="space-y-5">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                Enter New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
                            Reset Password
                        </button>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link to="/auth/login" className="text-indigo-600 font-medium hover:underline">
                        Go back to login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default ForgotPassword;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(90);
    const [resendDisabled, setResendDisabled] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Token not found. Please login again.");
            navigate("/auth/login");
            return;
        }

        const checkVerificationAndSendOtp = async () => {
            try {
                setLoading(true);
                const headers = { Authorization: `Bearer ${token}` };

                const infoRes = await axios.get("http://localhost:8027/auth/get-my-info", { headers });
                const { verified, users, statusCode, message } = infoRes.data;

                if (statusCode !== 200 || !users?.email) {
                    setError(message || "Invalid session or user info.");
                    navigate("/auth/login");
                    return;
                }

                setEmail(users.email);

                if (verified) {
                    setMessage(message || "Email is already verified.");
                    setStep(3);
                    setTimeout(() => navigate("/profile"), 1500);
                } else {
                    await sendOtp(users.email);
                }
            } catch (err) {
                console.error("Verification check error:", err);
                setError("Session expired or server error.");
                navigate("/auth/login");
            } finally {
                setLoading(false);
            }
        };

        checkVerificationAndSendOtp();
    }, []);

    useEffect(() => {
        let interval;
        if (timer > 0 && resendDisabled) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else {
            setResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [timer, resendDisabled]);

    const sendOtp = async (emailToSend) => {
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:8027/auth/email/send-otp", { email: emailToSend });
            const { statusCode, message } = res.data;

            if (statusCode === 200) {
                setMessage(message || "OTP has been sent to your email.");
                setError("");
                setStep(2);
                setTimer(90);
                setResendDisabled(true);
            } else {
                setError(message || "Failed to send OTP.");
            }
        } catch (err) {
            console.error("Send OTP error:", err);
            setError("Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (otp.trim().length !== 6) {
            setError("Enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);
            const payload = { email, otp };

            const res = await axios.post("http://localhost:8027/auth/email/verify", payload, {
                validateStatus: () => true,
            });

            const { statusCode, message } = res.data;

            setError("");
            setMessage("");
            setSuccess("");

            if (statusCode === 200) {
                setMessage(message || "Email verified successfully! Redirecting to profile...");
                setStep(3);
                setTimeout(() => navigate("/profile"), 2000);
            } else if (statusCode === 400) {
                setError(message || "Invalid OTP. Please try again.");
            } else if (statusCode === 403) {
                setSuccess(message || "User already verified.");
                setStep(3);
                setTimeout(() => navigate("/profile"), 1500);
            } else if (statusCode === 404) {
                setError(message || "User not found.");
            } else {
                setError(message || "Unexpected error occurred.");
            }
        } catch (err) {
            console.error("OTP verification error:", err);
            setError("Network error or server not reachable.");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setOtp("");
        await sendOtp(email);
    };

    return (
        <section className="h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
                    {step === 2 ? "Verify OTP" : "Verifying..."}
                </h2>

                {success && <div className="mb-4 text-green-600 text-sm bg-green-50 p-2 rounded">{success}</div>}
                {message && <div className="mb-4 text-green-600 text-sm bg-green-50 p-2 rounded">{message}</div>}
                {error && <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
                {loading && <div className="mb-4 text-blue-600 text-sm">⏳ Please wait...</div>}

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

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                            disabled={loading || otp.length !== 6}
                        >
                            Verify OTP
                        </button>

                        <div className="text-center text-sm text-gray-500 mt-2">
                            {resendDisabled ? (
                                <>Resend OTP in {timer}s</>
                            ) : (
                                <button
                                    type="button"
                                    onClick={resendOtp}
                                    className="text-indigo-600 hover:underline"
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-600">
                    <Link to="/auth/login" className="text-indigo-600 font-medium hover:underline">
                        Go to login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default VerifyEmail;

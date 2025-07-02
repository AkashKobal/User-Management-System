import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

const ProfilePage = () => {
    const [profileInfo, setProfileInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState();

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:8027/auth/get-my-info", {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const { statusCode, users, verified, message } = response.data;

            switch (statusCode) {
                case 200:
                    setProfileInfo(users);
                    setVerified(verified);
                    break;
                case 403:
                    console.log("Access forbidden.");
                    break;
                case 404:
                    console.log("User not found.");
                    break;
                case 500:
                    console.log("Server error occurred.");
                    break;
                default:
                    console.log(message || "Unexpected response.");
            }

        } catch (error) {
            console.error("Error fetching profile info:", error);
            if (error.response?.status === 401) {
                console.log("Unauthorized access. Please log in again.");
                window.location.href = '/auth/login';
            } else {
                console.log("An error occurred while fetching profile info.");
            }
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return !!token;
    };

    const isEmailVerified = () => {
        return verified === true;
    };



    return (
        <>
            <Header />
            <div className="mb-8 w-full max-w-7xl mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>

                    {isAuthenticated() && (
                        <div className="flex justify-end items-center mb-6 gap-2">
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                                onClick={() => window.location.href = '/auth/change-password'}
                            >
                                Change Password
                            </button>
                            <button
                                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                                onClick={() => window.location.href = '/auth/verify-email'}
                            >
                                Verify Email
                            </button>

                        </div>
                    )}

                    <div className="mb-10">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">User Details</h3>
                        <p><strong>Name:</strong> {profileInfo?.name}</p>
                        <p><strong>Email:</strong> {profileInfo?.email}</p>
                        <p><strong>Role:</strong> {profileInfo?.role}</p>
                        <p><strong>Active:</strong> {profileInfo?.active ? "Yes" : "No"}</p>
                        <p><strong>Created At:</strong> {new Date(profileInfo?.createdAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;

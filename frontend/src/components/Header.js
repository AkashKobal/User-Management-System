import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const toggleDropdown = (label) => {
        setOpenDropdown(openDropdown === label ? null : label);
    };

    const isAdmin = () => {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    };

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return !!token;
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setShowLogoutModal(false);
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
    };

    return (
        <header className="bg-white shadow-md z-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-xl font-bold text-gray-800 no-underline">Authentication</Link>
                    <div className="hidden lg:flex space-x-6 text-gray-700 font-medium items-center">
                        <div className="relative group">
                            <Link to="/" className="text-gray-800 hover:text-indigo-600 no-underline">Home</Link>
                        </div>
                        {isAuthenticated() && isAdmin() &&(
                        <div className="relative group">
                            <button className="flex items-center gap-1 hover:text-indigo-600">
                                Admin<i className="pi pi-angle-down" />
                            </button>
                            <div className="absolute left-0 pt-3 w-48 bg-white shadow-md rounded-md z-50 hidden group-hover:block">
                                <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-800 hover:bg-indigo-100 no-underline">Dashboard</Link>
                                <Link to="/admin/manage-users" className="block px-4 py-2 text-sm text-gray-800 hover:bg-indigo-100 no-underline">Manage Users</Link>
                            </div>
                        </div>
                        )}
                        <div className="flex gap-3">
                            {isAuthenticated() && (
                                <Link to="/profile" className="hover:text-indigo-600 no-underline">Profile</Link>
                            )}
                            {!isAuthenticated() && (
                                <Link to="/auth/login" className="hover:text-indigo-600 no-underline">Login</Link>
                            )}
                            {isAuthenticated() && (
                                <span
                                    className="hover:text-indigo-600 no-underline cursor-pointer"
                                    onClick={handleLogoutClick}
                                >
                                    Logout
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
                        >
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Logout</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;

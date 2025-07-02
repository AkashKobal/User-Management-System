// src/components/Sidebar.js
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaTasks, FaUsers } from "react-icons/fa";

const Sidebar = () => {
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const isAdmin = () => localStorage.getItem('role') === 'ADMIN' || localStorage.getItem('role') === 'FACULTY';
    const isAuthenticated = () => !!localStorage.getItem('token');

    return (
        <aside className="w-64 hidden lg:flex flex-col bg-slate-900 text-white p-4 space-y-2">
            <h1 className="text-2xl font-bold mb-6">Techways</h1>

            {isAuthenticated() && (
                <>
                    <Link to="/profile" className="flex items-center gap-2 py-2 hover:text-indigo-300">
                        <FaUser /> Profile
                    </Link>
                    <Link to="/task" className="flex items-center gap-2 py-2 hover:text-indigo-300">
                        <FaTasks /> Task
                    </Link>

                    {isAdmin() && (
                        <div>
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2 py-2 w-full text-left hover:text-indigo-300"
                            >
                                <FaUsers /> Users ▾
                            </button>
                            {userDropdownOpen && (
                                <div className="pl-6 text-sm">
                                    <Link to="/manage-users" className="block py-1 hover:text-indigo-300">Manage Users</Link>
                                    <Link to="/add-user" className="block py-1 hover:text-indigo-300">Add User</Link>
                                </div>
                            )}
                        </div>
                    )}

                    <Link to="/logout" className="mt-auto flex items-center gap-2 py-2 text-sm hover:text-red-400">
                        ↪ Logout
                    </Link>
                </>
            )}
        </aside>
    );
};

export default Sidebar;

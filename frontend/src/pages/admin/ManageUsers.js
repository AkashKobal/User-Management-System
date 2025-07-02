import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Header from "../../components/Header";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);

    const [input, setInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false)


    const handleChange = async (value) => {
        setInput(value);
        if (value.length >= 1) {
            setShowSearchResults(true);

            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(
                    `http://localhost:8027/users/search?keyword=${value}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setSearchResults(response.data);
                setNoResults(response.data.length === 0);
                console.log(response.data);
            } catch (error) {
                console.error("Error searching:", error);
            }
        } else {
            setShowSearchResults(false);
            setSearchResults([]);
            setNoResults(false);
        }
    };


    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
    });

    const handleNewUserChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const createUser = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const { name, email, password, role } = newUser;
            const response = await axios.post("http://localhost:8027/auth/register", {
                name,
                email,
                password,
                role,
            });

            const { statusCode, message } = response.data;

            if (statusCode === 201 || statusCode === 200) {
                toast.success("User created successfully");
                setShowCreateModal(false);
                setNewUser({ name: "", email: "", password: "", role: "USER" });
                getAllUsers();
            } else {
                toast.error(message || "Failed to create user");
            }
        } catch (err) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Unexpected error occurred");
            }
        } finally {
            setCreating(false);
        }
    };

    const getAllUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8027/admin/get-all-users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data?.usersList) {
                setUsers(response.data.usersList);
            } else {
                toast.error("No users found");
            }
        } catch (error) {
            console.error("Fetch failed:", error);
            toast.error("Failed to fetch users");
        }
    };

    const handleDelete = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://localhost:8027/admin/delete/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.statusCode === 204) {
                toast.success("User deleted successfully");
                getAllUsers();
            } else {
                toast.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Delete failed");
        }
    };

    const handleEditClick = (user) => {
        setEditingUser({ ...user });
        setShowModal(true);
    };

    const handleUpdateUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const { authorities, accountNonExpired, accountNonLocked, credentialsNonExpired, username, ...safeUser } = editingUser;

            const response = await axios.put(
                `http://localhost:8027/admin/update/${editingUser.id}`,
                safeUser,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.statusCode === 200) {
                toast.success("User updated successfully");
                setShowModal(false);
                getAllUsers();
            } else {
                toast.error("Failed to update user");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Update failed");
        }
    };
    // reload the page to reflect changes
    const handleReload = () => {
        window.location.reload();
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const totalPages = Math.ceil(users.length / usersPerPage);
    // const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const [filterRole, setFilterRole] = useState("ALL");
    const [filterVerified, setFilterVerified] = useState("ALL");
    const [filterActive, setFilterActive] = useState("ALL");
    const [sortByNameAsc, setSortByNameAsc] = useState(true);

    const filteredUsers = users
        .filter((user) => {
            if (filterRole !== "ALL" && user.role !== filterRole) return false;
            if (filterVerified !== "ALL" && user.verified !== (filterVerified === "VERIFIED")) return false;
            if (filterActive !== "ALL" && user.active !== (filterActive === "ACTIVE")) return false;
            return true;
        })
        .sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return sortByNameAsc ? -1 : 1;
            if (nameA > nameB) return sortByNameAsc ? 1 : -1;
            return 0;
        });

    const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);


    const exportToExcel = () => {
        const filteredSortedUsers = currentUsers; // or whatever you display in the table

        const worksheetData = filteredSortedUsers.map(user => ({
            ID: user.id,
            Name: user.name,
            Email: user.email,
            Role: user.role,
            Verified: user.verified ? "Yes" : "No",
            Active: user.active ? "Active" : "Blocked",
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "users_report.xlsx");
    };

    return (
        <>
            <Header />
            <ToastContainer />
            <div className="container mx-auto px-4 py-12">
                {/* Search Bar */}
                <div className="mb-6 relative">
                    <input
                        type="search"
                        className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Search user by name or email"
                        value={input}
                        onChange={(e) => handleChange(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />

                    {/* Search Results Dropdown */}
                    {showSearchResults && (
                        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md">
                            {searchResults.length > 0 ? (
                                searchResults.map((result) => (
                                    <li
                                        key={result.id}
                                        className="px-4 py-2 hover:bg-indigo-50 border-b last:border-b-0 cursor-pointer"
                                        onClick={() => handleEditClick(result)} // Open the edit dialog
                                    >
                                        <span className="text-indigo-700 hover:underline">
                                            {result.name} ({result.email})
                                        </span>
                                    </li>

                                ))
                            ) : (
                                noResults && (
                                    <li className="px-4 py-2 text-red-500">No user with that name or email</li>
                                )
                            )}
                        </ul>
                    )}
                </div>

                {/* Header and Create Button */}
                <h1 className="text-3xl font-bold text-indigo-700">Manage Users</h1>
                <div className="flex flex-col md:flex-row justify-end items-center mb-6">
                    <button
                        className=" ml-2 md:mt-0 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded w-full md:w-40"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Create User
                    </button>
                    <button
                        className=" ml-2 md:mt-0 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded w-full md:w-40"
                        onClick={exportToExcel}

                    >
                        Export excel
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="border px-3 py-2 rounded w-full min-w-[160px]"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                    </select>

                    <select
                        value={filterVerified}
                        onChange={(e) => setFilterVerified(e.target.value)}
                        className="border px-3 py-2 rounded w-full min-w-[160px]"
                    >
                        <option value="ALL">All Verified</option>
                        <option value="VERIFIED">Verified</option>
                        <option value="UNVERIFIED">Unverified</option>
                    </select>

                    <select
                        value={filterActive}
                        onChange={(e) => setFilterActive(e.target.value)}
                        className="border px-3 py-2 rounded w-full min-w-[160px]"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="BLOCKED">Blocked</option>
                    </select>

                    <button
                        onClick={() => setSortByNameAsc(!sortByNameAsc)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded w-full min-w-[160px]"
                    >
                        Sort Name: {sortByNameAsc ? "A → Z" : "Z → A"}
                    </button>
                </div>


                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-indigo-300 shadow-md">
                        <thead className="bg-indigo-100">
                            <tr>
                                <th className="px-3 py-2 border">ID</th>
                                <th className="px-3 py-2 border">Name</th>
                                <th className="px-3 py-2 border">Email</th>
                                <th className="px-3 py-2 border">Role</th>
                                <th className="px-3 py-2 border">Verified</th>
                                {/* <th className="px-3 py-2 border">Enabled</th> */}
                                <th className="px-3 py-2 border">Active</th>
                                <th className="px-3 py-2 border">Created</th>
                                <th className="px-3 py-2 border">Updated</th>
                                <th className="px-3 py-2 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user.id} className="text-gray-700 hover:bg-indigo-50">
                                    <td className="px-3 py-2 border">{user.id}</td>
                                    <td className="px-3 py-2 border">{user.name}</td>
                                    <td className="px-3 py-2 border">{user.email}</td>
                                    <td className="px-3 py-2 border">{user.role}</td>
                                    <td className="px-3 py-2 border">{user.verified ? 'Yes' : 'No'}</td>
                                    {/* <td className="px-3 py-2 border">{user.enabled ? 'Yes' : 'No'}</td> */}
                                    <td className="px-3 py-2 border">{user.active ? 'Active' : 'Blocked'}</td>
                                    <td className="px-3 py-2 border">{new Date(user.createdAt).toLocaleString()}</td>
                                    <td className="px-3 py-2 border">{new Date(user.updatedAt).toLocaleString()}</td>
                                    <td className="px-1 py-3 border flex justify-center items-center space-x-2">
                                        <button
                                            title="Edit"
                                            className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium py-1 px-3 rounded transition duration-150  "
                                            onClick={() => handleEditClick(user)}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.2995 4.42255L6.34327 13.4872C6.11694 13.7162 6.00377 13.8308 5.9332 13.9717C5.86262 14.1127 5.83924 14.271 5.79248 14.5875L5.55022 16.2271C5.36753 17.4635 5.27619 18.0817 5.64364 18.435C6.01109 18.7883 6.63525 18.6823 7.88356 18.4704L9.53897 18.1894C9.85851 18.1352 10.0183 18.1081 10.1593 18.0349C10.3004 17.9617 10.4136 17.8471 10.6399 17.618L19.5962 8.55344C20.2588 7.88278 20.5901 7.54745 20.5848 7.13611C20.5796 6.72476 20.2397 6.39805 19.5601 5.74462L18.147 4.38599C17.4673 3.73256 17.1275 3.40584 16.7105 3.4112C16.2935 3.41655 15.9622 3.75188 15.2995 4.42255Z" stroke="black" stroke-width="null" class="my-path"></path>
                                                <path d="M18 10L14 6" stroke="black" stroke-width="null" class="my-path"></path>
                                            </svg>
                                        </button>
                                        <span className="text-gray-500 mx-2">/</span>
                                        <button
                                            title="Delete"
                                            className="border border-red-600 text-blue-500 hover:bg-red-600 hover:text-white font-medium py-1 px-3 rounded transition duration-150"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 6.60001H21M4.8 6.60001H19.2V15C19.2 17.8284 19.2 19.2426 18.3213 20.1213C17.4426 21 16.0284 21 13.2 21H10.8C7.97157 21 6.55736 21 5.67868 20.1213C4.8 19.2426 4.8 17.8284 4.8 15V6.60001Z" stroke="black" stroke-width="null" stroke-linecap="round" class="my-path"></path>
                                                <path d="M7.49994 6.59994V4.99994C7.49994 3.89537 8.39537 2.99994 9.49994 2.99994H14.4999C15.6045 2.99994 16.4999 3.89537 16.4999 4.99994V6.59994M16.4999 6.59994H2.99994M16.4999 6.59994H21" stroke="black" stroke-width="null" stroke-linecap="round" class="my-path"></path>
                                                <path d="M10.2 11.1L10.2 16.5" stroke="black" stroke-width="null" stroke-linecap="round" class="my-path"></path>
                                                <path d="M13.8 11.1L13.8 16.5" stroke="black" stroke-width="null" stroke-linecap="round" class="my-path"></path>
                                            </svg>
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                    <div className="mt-6 flex justify-center items-center space-x-2">
                        {totalPages > 1 && (
                            <>
                                {currentPage > 1 && (
                                    <button
                                        className="px-3 py-1 border rounded text-indigo-600 hover:bg-indigo-100"
                                        onClick={() => goToPage(currentPage - 1)}
                                    >
                                        Previous
                                    </button>
                                )}

                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        className={`px-3 py-1 border rounded ${currentPage === index + 1
                                            ? 'bg-indigo-500 text-white'
                                            : 'text-indigo-600 hover:bg-indigo-100'
                                            }`}
                                        onClick={() => goToPage(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                {currentPage < totalPages && (
                                    <button
                                        className="px-3 py-1 border rounded text-indigo-600 hover:bg-indigo-100"
                                        onClick={() => goToPage(currentPage + 1)}
                                    >
                                        Next
                                    </button>
                                )}
                            </>
                        )}
                    </div>


                </div>
            </div>
            {/* create user dialog  */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-green-700">Create New User</h2>
                        <form onSubmit={createUser} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                value={newUser.name}
                                onChange={handleNewUserChange}
                                placeholder="Full Name"
                                required
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleNewUserChange}
                                placeholder="Email"
                                required
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="password"
                                name="password"
                                value={newUser.password}
                                onChange={handleNewUserChange}
                                placeholder="Password"
                                required
                                className="w-full border p-2 rounded"
                            />
                            <select
                                name="role"
                                value={newUser.role}
                                onChange={handleNewUserChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="bg-gray-300 px-4 py-2 rounded"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    {creating ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Update Dialog */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-indigo-600">Update User</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Name"
                                value={editingUser.name}
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, name: e.target.value })
                                }
                            />
                            <input
                                type="email"
                                className="w-full border p-2 rounded"
                                placeholder="Email"
                                value={editingUser.email}
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, email: e.target.value })
                                }
                            />
                            <select
                                className="w-full border p-2 rounded"
                                value={editingUser.role}
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, role: e.target.value })
                                }
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>

                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                                onClick={handleUpdateUser}
                            >
                                {creating ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageUsers;

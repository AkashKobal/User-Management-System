// components/AdminLayout.jsx
import { Link, useLocation } from 'react-router-dom';
import { FaChartBar,FaHome,FaUser,FaUserCog } from 'react-icons/fa';

const menuItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
    { path: '/admin/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { path: '/admin/manage-users', label: 'Manage Users', icon: <FaUserCog  /> },
];

const AdminLayout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-gradient-to-br from-indigo-100 to-indigo-200">
            <aside className="w-72 p-6 backdrop-blur-md bg-white/20 border-r border-indigo-200 shadow-md flex flex-col justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-indigo-900 mb-10">Admin Panel</h1>
                    <nav className="space-y-3">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${location.pathname === item.path
                                        ? 'bg-white text-indigo-700 font-semibold shadow'
                                        : 'text-indigo-100 hover:bg-white/30 hover:text-indigo-800'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="text-sm text-indigo-300">
                    &copy; {new Date().getFullYear()} Admin Console
                </div>
            </aside>

            <main className="flex-1 overflow-auto p-8">
                <div className="bg-white rounded-xl shadow-lg p-6 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

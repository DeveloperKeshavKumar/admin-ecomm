import PrivateRoute from "@/routes/PrivateRoute";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Package, ShoppingCart } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // Redirect to login
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-1/8 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-center mb-6">Dashboard</h1>
          <Link to="products" className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition">
            <Package size={20} />
            Products
          </Link>
          <Link to="orders" className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition">
            <ShoppingCart size={20} />
            Orders
          </Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-red-600 transition text-white w-full"
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="w-7/8 p-6">
        <Outlet />
      </div>
    </div>
  );
}


function DashboardLayout() {
  return (
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  );
}

export { DashboardLayout };
export default Dashboard;
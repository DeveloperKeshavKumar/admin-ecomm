import { ThemeProvider } from "@/components/theme-provider";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import PublicRoute from "@/routes/PublicRoute";
import { DashboardLayout } from "@/pages/dashboard";
import Orders from "@/pages/orders";
import Products from "@/pages/products";
import Login from "@/pages/login";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Outlet />}>
          {/* Public Routes */}
          <Route
            index
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Private Routes */}
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;

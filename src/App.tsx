import { ThemeProvider } from "@/components/theme-provider"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login";

function App() {
  const isLoggedIn = localStorage.getItem('token') ? true : false;
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {
        isLoggedIn ? <Dashboard /> : <Login />
      }
    </ThemeProvider>
  )
}

export default App

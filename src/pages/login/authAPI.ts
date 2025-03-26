import { apiConnector, LOCAL_URL, PRODUCTION_URL } from "@/apiConnector";
import { toast } from "react-hot-toast";

interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: {
        firstName: string;
        lastName: string;
        image?: string;
    };
}

// Determine the environment
const isProduction = import.meta.env.VITE_ENV !== "development";

// Function to handle login
export async function login(email: string, password: string, navigate: (path: string) => void): Promise<void> {
    const toastId = toast.loading("Authenticating...");

    try {
        if (!isProduction) {
            // Development Mode - Auto-login using env credentials
            const devEmail = import.meta.env.VITE_EMAIL;
            const devPassword = import.meta.env.VITE_PASSWORD;

            if (email === devEmail && password === devPassword) {
                localStorage.setItem("token", "dev-token");
                localStorage.setItem("user", JSON.stringify({ firstName: "Dev", lastName: "User", image: "" }));
                toast.success("Logged in as Developer!");
                navigate("/dashboard");
            } else {
                throw new Error("Invalid development credentials");
            }
        } else {
            // Production Mode - API Login
            const response = await apiConnector<LoginResponse>("post", `${PRODUCTION_URL}/login`, { email, password });

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Login Successful");

            // Handle user image fallback
            const user = response.data.user;
            const userImage = user.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`;

            // Store user data in localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify({ ...user, image: userImage }));

            navigate("/dashboard");
        }
    } catch (error) {
        toast.error(error instanceof Error ? error.message : "Login Failed");
    } finally {
        toast.dismiss(toastId);
    }
}
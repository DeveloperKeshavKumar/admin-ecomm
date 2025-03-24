import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <h1 className="text-2xl font-semibold underline ">
        Hello world
      </h1>
    </ThemeProvider>
  )
}

export default App

import { useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./components/Login"; // nuevo import

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<{ name: string; webhook: string } | null>(null);

  // Recuperar desde localStorage si existiera
  useEffect(() => {
    const saved = localStorage.getItem("chat_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (name: string, webhook: string) => {
    const userData = { name, webhook };
    setUser(userData);
    localStorage.setItem("chat_user", JSON.stringify(userData));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster
          position="bottom-right"
          className="!right-4"
          toastOptions={{
            duration: 2000,
            className: "bg-black/70 text-white text-xs py-1.5 px-3 rounded-md border-0 max-w-sm w-auto",
            unstyled: false,
          }}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/"
              element={
                user ? (
                  <Index user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

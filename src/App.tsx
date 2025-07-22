// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts and Pages
import GlobalLayout from "./components/GlobalLayout";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Quizzes from "./pages/Quizzes";
import QuizTaking from "./components/QuizTaking";
import QuizMinimal from "./components/QuizMinimal";
import NotFound from "./pages/NotFound";

// === IMPORT YOUR EXISTING DASHBOARD PAGES HERE ===
import PathPage from "./components/dashboard/PathPage";
import FireAiPage from "./components/dashboard/FireAIPage";
import ServicedInPage from "./components/dashboard/ServicedinPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Routes WITH the bottom navigation bar */}
          <Route element={<GlobalLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quiz/:quizId" element={<QuizTaking />} />
            
            {/* === ADD ROUTES FOR YOUR DASHBOARD PAGES HERE === */}
            <Route path="/path" element={<PathPage />} />
            <Route path="/fireai" element={<FireAiPage />} />
            <Route path="/servicedin" element={<ServicedInPage />} />

          </Route>

          {/* Routes WITHOUT the bottom navigation bar */}
          <Route path="/quiz-minimal/:quizId" element={<QuizMinimal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
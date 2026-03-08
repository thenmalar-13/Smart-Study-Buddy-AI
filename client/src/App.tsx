import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Navbar } from "./components/layout/Navbar";
import Home from "./pages/home";
import CreateNote from "./pages/create-note";
import SessionDetail from "./pages/session-detail";
import ExplainConcept from "./pages/explain-concept";
import Dashboard from "./pages/dashboard";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 relative z-0">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/notes/new" component={CreateNote} />
          <Route path="/notes/:id" component={SessionDetail} />
          <Route path="/concepts" component={ExplainConcept} />
          <Route path="/dashboard" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

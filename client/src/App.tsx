import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { About, Admin, Blog, BlogDetail, BrandPage, Contact, Home, NotFound } from "./pages/Site";

function Router() {
  const [location] = useLocation();
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/hakkimizda" component={About} />
    <Route path="/markalar/sonic"><BrandPage brand="Sonic" /></Route>
    <Route path="/markalar/audibel"><BrandPage brand="Audibel" /></Route>
    <Route path="/blog" component={Blog} />
    <Route path="/blog/:slug">{params => <BlogDetail slug={params.slug} />}</Route>
    <Route path="/iletisim" component={Contact} />
    <Route path="/Wordaf" component={Admin} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

import { useCallback, useEffect, useState } from "react";

const ROUTES = ["home", "app-play", "piano-play", "auth", "settings"] as const;
type Route = typeof ROUTES[number];

function hashToRoute(): Route {
  const hash: string = window.location.hash.replace("#/", "");
  if (ROUTES.includes(hash as Route)) {
    return hash as Route;
  }
  return "home";
}

export function useHashRouter() {
  const [route, setRoute] = useState<Route>(hashToRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(hashToRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((to: Route) => {
    window.location.hash = to === "home" ? "/" : `/${to}`;
  }, []);

  return { route, navigate } as const;
}

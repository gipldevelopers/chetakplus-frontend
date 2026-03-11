import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page smoothly on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Using instant so it behaves like native page navigation
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

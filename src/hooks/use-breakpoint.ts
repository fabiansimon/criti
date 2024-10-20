import { useEffect, useState } from "react";

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

function useBreakpoint(breakpoint: number): boolean {
  const [triggered, setTriggered] = useState<boolean>(
    breakpoint >= window.innerWidth,
  );

  useEffect(() => {
    const handleResize = () => {
      setTriggered(breakpoint >= window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return triggered;
}

export default useBreakpoint;

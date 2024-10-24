import { useEffect, useState } from "react";

function checkMobile(agent: string) {
  return Boolean(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.exec(
      agent,
    ),
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const agent = window.navigator.userAgent;
    setIsMobile(checkMobile(agent));

    const handleResize = () => setIsMobile(checkMobile(agent));

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default useIsMobile;

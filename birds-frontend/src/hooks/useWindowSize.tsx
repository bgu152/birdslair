import { useState, useEffect } from "react";

type WindowSize = {
    width: number | undefined;
};

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState<WindowSize>({
      width: undefined,
    });
  
    useEffect(() => {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
        });
      }
      
      window.addEventListener("resize", handleResize);
       
      handleResize();
      
      return () => window.removeEventListener("resize", handleResize);
    }, []); 
    return windowSize;
  }
  
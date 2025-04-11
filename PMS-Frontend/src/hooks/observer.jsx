import { useRef, useState, useEffect } from "react";

const useInViewObserver= ({ threshold = 0.3}) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
  
    useEffect(() => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if(entry.isIntersecting) setInView(true);
          },
          { threshold,}
        );
      
        if (ref.current) {
          observer.observe(ref.current);
        }
      
        return () => {
          if (ref.current) observer.unobserve(ref.current);
        };
      }, []);

      return [ref, inView];
}

export default useInViewObserver
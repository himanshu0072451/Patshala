import { useState, useEffect, useRef } from "react";

const useUnderlinePosition = (selectedSubject, subjects) => {
  const [underlineProps, setUnderlineProps] = useState({
    width: 0,
    x: 0,
  });
  const navWrapRef = useRef();

  useEffect(() => {
    const updateUnderlinePosition = () => {
      if (!navWrapRef.current) return;

      const currentElem = navWrapRef.current.querySelector(
        `[data-subject="${selectedSubject}"]`
      );

      if (currentElem) {
        const { offsetWidth, offsetLeft } = currentElem;

        if (
          underlineProps.width !== offsetWidth ||
          underlineProps.x !== offsetLeft
        ) {
          setUnderlineProps({
            width: offsetWidth,
            x: offsetLeft,
          });
        }
      }
    };

    updateUnderlinePosition();
    window.addEventListener("resize", updateUnderlinePosition);

    return () => {
      window.removeEventListener("resize", updateUnderlinePosition);
    };
  }, [selectedSubject, subjects]);

  return { underlineProps, navWrapRef };
};

export default useUnderlinePosition;

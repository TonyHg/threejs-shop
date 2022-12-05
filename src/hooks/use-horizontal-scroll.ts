import { useEffect, useRef } from 'react';

export function useHorizontalScroll() {
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      const onWheel = (event: WheelEvent) => {
        if (event.deltaY == 0) return;
        event.preventDefault();
        element.scrollBy(event.deltaY, 0);
      };
      element.addEventListener('wheel', onWheel);
      return () => element.removeEventListener('wheel', onWheel);
    }
  }, []);
  return elementRef;
}

import { useEffect, useRef } from 'react';

export function useHorizontalScroll(viewSelected: boolean) {
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      const onWheel = (event: WheelEvent) => {
        if (event.deltaY == 0) return;
        event.preventDefault();
        element.scrollBy(event.deltaY, 0);
      };
      if (!viewSelected) element.addEventListener('wheel', onWheel);
      return () => element.removeEventListener('wheel', onWheel);
    }
  }, [viewSelected]);
  return elementRef;
}

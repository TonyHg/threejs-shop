import { useEffect, useRef, useState } from 'react';
import { Euler } from 'three';
import './App.css';
import Product from './components/products/product';
import Landing from './components/landing/landing';

interface Product {
  id: number;
  name: string;
  scale?: number;
  rotation?: Euler;
  shouldTouchTheGround?: boolean;
}

function App() {
  const products: Product[] = [
    { id: 1, name: 'japanese_mask', rotation: new Euler(0, -Math.PI) },
    { id: 2, name: 'crystal_stone' },
    { id: 3, name: 'futurist_drone', rotation: new Euler(0, -Math.PI / 2) },
    { id: 4, name: 'mosquito_in_amber', scale: 0.02 },
    { id: 5, name: 'ship_in_a_bottle', shouldTouchTheGround: true },
    { id: 6, name: 'spider_tank', shouldTouchTheGround: true },
    { id: 7, name: 'techno_watch' },
    { id: 8, name: 'venice_mask', scale: 50 },
    { id: 9, name: 'terrarium_bots', scale: 0.09, shouldTouchTheGround: true },
    { id: 10, name: 'dark_scuba' },
    { id: 11, name: 'cursed_gameboy', shouldTouchTheGround: true },
    { id: 12, name: 'lord_inquisitor_skull', scale: 0.02 },
    { id: 13, name: '13' },
    { id: 14, name: '14' },
    { id: 15, name: '15' },
    { id: 16, name: '16' }
  ];
  const [viewSelected, setViewSelected] = useState(false);
  const [cursor, setCursor] = useState<number | undefined>();
  const listRef = useRef<HTMLDivElement>(null);
  const [productIdx, setProductIdx] = useState(0);

  useEffect(() => {
    location.hash = '';
    if (cursor != null)
      location.hash = products[!viewSelected && cursor > 0 ? cursor - 1 : cursor].name;

    if (listRef.current !== null) {
      if (viewSelected && !listRef.current.classList.contains('scroll-smooth')) {
        listRef.current.classList.add('scroll-smooth');
      } else if (!viewSelected) {
        listRef.current.classList.remove('scroll-smooth');
      }
    }
  }, [viewSelected, cursor]);

  useEffect(() => {
    if (listRef.current !== null) {
      listRef.current.addEventListener('scroll', (event) => {
        const element = event.target as HTMLDivElement;
        if (element.scrollLeft > 0) {
          setProductIdx(Math.floor(element.scrollLeft / (window.innerWidth / 3)));
        }
      });
    }
  }, [listRef.current?.scrollLeft]);

  return (
    <div
      className={`flex flex-nowrap h-screen w-screen bg-[#080808] ${
        viewSelected ? 'overflow-x-hidden' : 'overflow-x-auto'
      }`}
      ref={listRef}>
      <div className="flex grow-0 shrink-0 basis-auto h-full w-full">
        <Landing listRef={listRef} />
      </div>
      {products.map((product, index) => (
        <div
          key={index}
          id={product.name}
          className={`flex justify-center items-center grow-0 shrink-0 basis-auto h-full ${
            viewSelected ? 'w-full' : 'w-1/3 cursor-pointer'
          }`}
          onClick={() => {
            if (!viewSelected) {
              setViewSelected(true);
              setCursor(index);
            }
          }}>
          {((!viewSelected && index >= productIdx - 4 && index <= productIdx + 1) ||
            (viewSelected &&
              cursor !== undefined &&
              index >= cursor - 1 &&
              index <= cursor + 1)) && (
            <Product
              name={product.name}
              scale={product.scale}
              rotation={product.rotation}
              shouldTouchTheGround={product.shouldTouchTheGround}
              isSelected={viewSelected}
            />
          )}
        </div>
      ))}
      {viewSelected && (
        <>
          <button
            onClick={() => setViewSelected(false)}
            className="absolute uppercase font-bold top-10 left-10 text-center rounded-lg p-5 button-neon border-0 hover:border-0">
            <span className="mr-6">←</span> back
          </button>
          {cursor && cursor !== 0 && (
            <button
              className="absolute top-1/2 left-10 h-20 w-20 p-5 rounded-full button-neon"
              onClick={() => setCursor(cursor - 1)}>
              <img
                className="text-white invert"
                alt="go to previous product"
                src="https://www.une-pause-a-signes.com/wp-content/plugins/photo-gallery/css/bwg-fonts/fonts/bwg-fonts-svg/angle-left-sm.svg"
              />
            </button>
          )}
          {cursor != null && cursor !== products.length - 1 && (
            <button
              className="absolute top-1/2 right-10 h-20 w-20 p-5 rounded-full button-neon"
              onClick={() => setCursor(cursor + 1)}>
              <img
                className="text-white invert"
                alt="go to previous product"
                src="https://www.une-pause-a-signes.com/wp-content/plugins/photo-gallery/css/bwg-fonts/fonts/bwg-fonts-svg/angle-right-sm.svg"
              />
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default App;

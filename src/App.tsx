import { useEffect, useState } from 'react';
import { Euler } from 'three';
import './App.css';
import Landing from './components/landing/landing';
import Product from './components/products/product';
import { useHorizontalScroll } from './hooks/use-horizontal-scroll';

interface Product {
  id: number;
  name: string;
  scale?: number;
  rotation?: Euler;
  shouldTouchTheGround?: boolean;
}

function App() {
  const products: Product[] = [
    { id: 1, name: 'japanese_mask', scale: 1.5, rotation: new Euler(0, -Math.PI) },
    { id: 2, name: 'crystal_stone', scale: 50 },
    { id: 3, name: 'buster_drone', scale: 1.5 },
    { id: 4, name: 'cursed_pumpkin', scale: 5 },
    { id: 5, name: 'nagitana_spear', scale: 0.015, rotation: new Euler(0, 0, Math.PI / 3) },
    { id: 6, name: 'spider_tank', scale: 0.012, shouldTouchTheGround: true },
    { id: 7, name: 'venice_mask', scale: 50 },
    { id: 8, name: 'techno_watch', rotation: new Euler(0, 0, -Math.PI / 3) },
    { id: 9, name: 'scepter', scale: 0.005 },
    { id: 10, name: 'futuristic_gun', scale: 0.004, shouldTouchTheGround: true },
    { id: 11, name: 'mysterious_book', scale: 0.01, rotation: new Euler(0, 0, Math.PI / 3) },
    { id: 12, name: 'terrarium_bots', scale: 0.1, shouldTouchTheGround: true },
    { id: 13, name: 'yellow_gameboy', scale: 1.7 },
    { id: 14, name: 'mayan_column', scale: 0.25, shouldTouchTheGround: true },
    { id: 15, name: 'jade_sword', scale: 0.05 },
    { id: 16, name: 'mysterious_chest', scale: 2, shouldTouchTheGround: true }
  ];
  const [viewSelected, setViewSelected] = useState(false);
  const [cursor, setCursor] = useState<number | undefined>();
  const listRef = useHorizontalScroll(viewSelected);
  const [productIdx, setProductIdx] = useState(1);

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
          setProductIdx(Math.max(1, Math.floor(element.scrollLeft / (window.innerWidth / 3))));
        }
      });
    }
  }, [listRef.current?.scrollLeft]);

  return (
    <div
      className={`hide-scroll-bar flex flex-nowrap h-screen w-screen bg-[#080808] ${
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

import { useEffect, useRef, useState } from 'react';
import './App.css';
import Product from './components/products/product';
import Landing from './components/landing/landing';

function App() {
  const products = [
    { id: 1, name: 'japanese_mask' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
    { id: 6, name: '6' },
    { id: 7, name: '7' },
    { id: 8, name: '8' },
    { id: 9, name: '9' },
    { id: 10, name: '10' },
    { id: 11, name: '11' },
    { id: 12, name: '12' },
    { id: 13, name: '13' },
    { id: 14, name: '14' },
    { id: 15, name: '15' },
    { id: 16, name: '16' }
  ];

  const [viewSelected, setViewSelected] = useState(false);
  const [cursor, setCursor] = useState<number | undefined>();
  const listRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className={`flex flex-nowrap h-screen w-screen bg-black ${
        viewSelected ? 'overflow-x-hidden' : 'overflow-x-auto'
      }`}
      ref={listRef}>
      <div className="flex grow-0 shrink-0 basis-auto h-full w-full">
        <Landing />
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
          {index == 0 && <Product name={product.name} isSelected={viewSelected} />}
        </div>
      ))}
      {viewSelected && (
        <>
          <button
            onClick={() => setViewSelected(false)}
            className="absolute top-10 left-10 text-center rounded-lg bg-white text-black p-5">
            back
          </button>
          {cursor && cursor !== 0 && (
            <button
              className="absolute top-1/2 left-10 h-20 w-20 bg-white text-black p-5 rounded-full"
              onClick={() => setCursor(cursor - 1)}>
              &lt;
            </button>
          )}
          {cursor != null && cursor !== products.length - 1 && (
            <button
              className="absolute top-1/2 right-10 h-20 w-20 bg-white text-black p-5 rounded-full"
              onClick={() => setCursor(cursor + 1)}>
              &gt;
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default App;

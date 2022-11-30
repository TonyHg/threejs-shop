import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const products = [
    { name: '1' },
    { name: '2' },
    { name: '3' },
    { name: '4' },
    { name: '5' },
    { name: '6' },
    { name: '7' },
    { name: '8' },
    { name: '9' },
    { name: '10' },
    { name: '11' },
    { name: '12' },
    { name: '13' },
    { name: '14' },
    { name: '15' },
    { name: '16' }
  ];

  const [viewSelected, setViewSelected] = useState(false);
  const [cursor, setCursor] = useState<number | undefined>();

  useEffect(() => {
    if (cursor !== undefined) {
      location.hash = '#';
      location.hash = '#' + products[!viewSelected && cursor > 0 ? cursor - 1 : cursor].name;
    }
  }, [viewSelected, cursor]);

  return (
    <div
      className={`flex flex-nowrap h-screen w-screen bg-black ${
        viewSelected ? 'overflow-x-hidden' : 'overflow-x-auto'
      }`}>
      <div className="flex grow-0 shrink-0 basis-auto h-full w-full">
        <div className="flex h-full w-full justify-center items-center uppercase text-7xl">
          dolor sit amet
        </div>
      </div>
      {viewSelected && (
        <button
          onClick={() => setViewSelected(false)}
          className="absolute top-10 right-10 text-center rounded-lg bg-white text-black p-5">
          back
        </button>
      )}
      {products.map((product, index) => (
        <div
          key={index}
          id={product.name}
          className={`flex justify-center items-center grow-0 shrink-0 basis-auto border-white border-2 h-full ${
            viewSelected ? 'w-full' : 'w-1/3'
          }`}
          onClick={() => {
            if (!viewSelected) {
              setViewSelected(true);
              setCursor(index);
            }
          }}>
          <div className="flex p-10 h-full w-full justify-between items-center">
            {viewSelected && index !== 0 && (
              <button
                className="h-20 w-20 bg-white text-black p-5 rounded-full"
                onClick={() => setCursor(index - 1)}>
                &lt;
              </button>
            )}
            {product.name}
            {viewSelected && index !== products.length - 1 && (
              <button
                className="h-20 w-20 bg-white text-black p-5 rounded-full"
                onClick={() => setCursor(index + 1)}>
                &gt;
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;

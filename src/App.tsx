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

  return (
    <div className="flex flex-nowrap h-screen w-screen overflow-x-auto bg-black">
      <div className="flex grow-0 shrink-0 basis-auto h-full w-full">
        <div className="flex h-full w-full justify-center items-center uppercase text-7xl">
          dolor sit amet
        </div>
      </div>
      {products.map((product, index) => (
        <div
          key={index}
          className="flex justify-center items-center  grow-0 shrink-0 basis-auto border-white border-2 h-full w-1/3">
          {product.name}
        </div>
      ))}
    </div>
  );
}

export default App;

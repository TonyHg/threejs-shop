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
    <div className="h-screen w-screen whitespace-nowrap overflow-x-scroll">
      <div className="h-full w-full inline-block bg-red-500">test</div>
      {products.map((product, index) => (
        <div key={index} className="h-full w-1/3 inline-block bg-blue-500">
          {product.name}
        </div>
      ))}
    </div>
  );
}

export default App;

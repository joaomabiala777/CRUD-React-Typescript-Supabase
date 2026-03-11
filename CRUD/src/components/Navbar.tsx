import React from 'react'; // Importação necessária em algumas versões/configurações

const Navbar: React.FC = () => {
  return (
    <nav className="bg-amber-300 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-screen flex items-center justify-center mx-auto p-4">
        <h1 className="text-2xl font-bold">Gestão de Stock</h1>
      </div>
    </nav>
  );
};

export default Navbar;

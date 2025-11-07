import React from 'react';
import Navbar from './components/Navbar';
import {useLocation} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
const App = () => {
  const IsOwnerPath = useLocation().pathname.includes('owner');

  return (
    <div>
      {!IsOwnerPath && <Navbar />}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

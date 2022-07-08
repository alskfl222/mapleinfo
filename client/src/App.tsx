import { RecoilRoot } from 'recoil';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Controller from './pages/Controller';
import Viewer from './pages/Viewer';

function App() {

  return (
    <RecoilRoot>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Viewer />} />
        <Route path='/control' element={<Controller />} />
      </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;

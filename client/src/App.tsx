import { RecoilRoot } from 'recoil';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './pages/Start';
import Controller from './pages/Controller';
import Viewer from './pages/Viewer';

function App() {

  return (
    <RecoilRoot>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/control' element={<Controller />} />
        <Route path='/view' element={<Viewer />} />
      </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;

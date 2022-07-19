import { RecoilRoot } from 'recoil';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './pages/Start';
import Control from './pages/Control';
import View from './pages/View';

function App() {

  return (
    <RecoilRoot>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/control' element={<Control />} />
        <Route path='/view' element={<View />} />
      </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;

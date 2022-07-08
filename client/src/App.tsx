import { RecoilRoot } from 'recoil';
import Controller from './pages/Controller';
import Viewer from './pages/Viewer';

function App() {

  return (
    <RecoilRoot>
      <div>
        <Controller />
        <Viewer />
      </div>
    </RecoilRoot>
  );
}

export default App;

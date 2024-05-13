import './App.css';
import { MainMenu } from './menu/MainMenu';
import { PCSpaceGame } from './PCSpaceGame/PCSpaceGame';
import { MobileSpaceGame} from './MobileSpaceGame/MobileSpaceGame'
import { NoPage } from './NoPage/NoPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameStateProvider } from './Context/Context';


const App: React.FC = () => {
  return (
    <GameStateProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/mobile-sg" element={<MobileSpaceGame />}></Route>
        <Route path="/pc-sg" element={<PCSpaceGame />}></Route>
        <Route path="/" element={<MainMenu />}></Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
    </GameStateProvider>
  );
}

export default App;

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import MotelPage from "./pages/motelpage/Motelpage"; 
import MotelDetailPage from './pages/moteldetailpage/Moteldetailpage';
import MotelComparison from "./pages/motelcomparison/MotelComparison";
import AIChatbot from "./pages/aichatbot/Aichatbot";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/hotels" element={<List/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/motel" element={<MotelPage/>}/> {/* MotelPage 라우트 수정 */}
        <Route path="/motel/:id" element={<MotelDetailPage />} />
        <Route path="/motelcomparison" element={<MotelComparison />} />
        <Route path="/aichatbot" element={<AIChatbot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
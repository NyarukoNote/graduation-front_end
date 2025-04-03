import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import MotelPage from "./pages/motelpage/Motelpage";
import MotelDetailPage from "./pages/moteldetailpage/Moteldetailpage";
import MotelComparison from "./pages/motelcomparison/MotelComparison";
import AIChatbot from "./pages/aichatbot/Aichatbot";
import TourInfo from "./pages/tourinfo/Tourinfo";
import TourDetail from "./pages/tourdetail/Tourdetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/motel" element={<MotelPage />} />
        <Route path="/motel/:name" element={<MotelDetailPage />} />
        <Route path="/motelcomparison" element={<MotelComparison />} />
        <Route path="/aichatbot" element={<AIChatbot />} />
        <Route path="/tourinfo" element={<TourInfo />} />
        <Route path="/tour/:contentid" element={<TourDetail />} />
      </Routes>
    </Router>
  );
}

export default App;

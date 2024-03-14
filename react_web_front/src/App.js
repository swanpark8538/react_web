import { Route, Routes } from "react-router-dom";
import Footer from "./page/common/Footer";
import Header from "./page/common/Header";
import Main from "./page/common/Main";
import Join from "./page/member/Join";

function App() {
  return (
    <div className="wrap">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/join" element={<Join />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

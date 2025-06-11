import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
// ...

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* שאר הנתיבים */}
    </Routes>
  );
}

export default App;


import "./App.css";
import PageNotFound from "./PageNotFound";
import ProtectedRoute from "./container/ProtectedRoute";
import VoiceTest from "./container/VoiceTest";
import Login from "./container/login/Login";
import Signup from "./container/signup/Signup";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    
      <div>
        <Routes>
        <Route path="/" element={<ProtectedRoute><VoiceTest /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
      </div>
      // <>
      //  <Login/>
      //  {/* <Signup/> */}
      // </>
   
  );
}

export default App;

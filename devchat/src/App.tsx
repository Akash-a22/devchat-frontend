import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { ChatOpt } from "./components/body/chat_comp/ChatOpt";
import Header from "./components/header/Header";
import ChatRoom from "./components/body/chat_room/ChatRoom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ChatOpt />} />
          <Route path="/room/:id" element={<ChatRoom />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;

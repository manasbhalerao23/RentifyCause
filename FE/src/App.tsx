import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Body from "./components/Body";
import CreateBlog from "./components/CreateBlog";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div> <Body /></div>}>

        {/* Children Routes */}
        <Route path="/createBlog" element={<div> <CreateBlog/> </div>}/>


          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

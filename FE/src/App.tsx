import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import CreateBlog from "./components/CreateBlog";
import Test from "./components/test";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div> <Body /></div>}>

        {/* Children Routes */}
        <Route path="/createBlog" element={<div> <CreateBlog/> </div>}/>
        <Route path="/test" element={<div> <Test/> </div>}/>
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

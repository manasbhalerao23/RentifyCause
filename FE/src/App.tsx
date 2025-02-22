import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import CreateBlog from "./components/CreateBlog";
import Test from "./components/test";
import { Cards } from "./components/Cards";
import { OpenBlog } from "./components/OpenBlog";
import DashBoard from "./components/DashBoard";
import AuthForm from "./components/Auth";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoard/>}/>

          {/* Children Routes */}
          <Route path="/auth" element={<AuthForm/>}/>
          <Route path="/createBlog" element={<div><CreateBlog/></div>}/>
          <Route path="/card" element={<div><Cards/></div>} />
          <Route path="/test" element={<div> <Test/> </div>}/>
        {/* </Route> */}
        <Route path="/openBlog/:blogId" element={<OpenBlog/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

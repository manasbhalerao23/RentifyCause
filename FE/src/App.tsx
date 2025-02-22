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
        <Route path="/" element={<Body/>}>
            {/* Children Routes */}
        <Route index element={<DashBoard/>}/>

          <Route path="/auth" element={<AuthForm/>}/>
          <Route path="/createBlog" element={<CreateBlog/>}/>
          <Route path="/card" element={<Cards/>} />
          <Route path="/test" element={ <Test/> }/>
        {/* </Route> */}
        <Route path="/openBlog/:blogId" element={<OpenBlog/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import CreateBlog from "./components/CreateBlog";
import Test from "./components/test";
import { Cards } from "./components/Cards";
import { OpenBlog } from "./components/OpenBlog";
import DashBoard from "./components/DashBoard";
import AuthForm from "./components/Auth";
import { Provider } from "react-redux";
import store from "./Utils/store";
import Rent from "./components/Rent";
import ProfilePage from "./components/ProfileBar";
//import AdminPage from "./components/Admin";
import OpenReceipt from "./components/OpenReceipt";
import AdminTest from "./components/AdminTest";
import AdminView from "./components/AdminView";
import Collections from "./components/Collections";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            {/* Children Routes */}
            <Route path="/receipt" element={<OpenReceipt />} />
            <Route path="/admin" element={<AdminTest />} />
            <Route index element={<DashBoard />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/createBlog" element={<CreateBlog />} />
            <Route path="/card" element={<Cards />} />
            <Route path="/test" element={<Test />} />
            {/* </Route> */}
            <Route path="/collections" element={<Collections/>}/>
            <Route path="/openBlog/:blogId" element={<OpenBlog />} />
            <Route path="/rent" element={<Rent />} />
            <Route
              path="/profile"
              element={
                <ProfilePage
                  closeSidebar={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              }
            />
            <Route path="/admin/view/:userId" element={<AdminView />} />
            <Route path="/adminTest" element={<AdminTest/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

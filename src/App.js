import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import Products from "./pages/Products";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Home from "./pages/Home";
import "../src/asset/css/style.css"
import './index.css';
import { ToastContainer } from 'react-toastify';
import Category from "./pages/Category";
import AddCategory from "./pages/AddCategory";
import EditCategory from "./pages/EditCategory";
import SocketMessage from "./SocketMessage"
import Header from "./pages/Header";
import BannerComponent from "./pages/BannerComponent";
import Footer from "./pages/Footer";
import Menu from "./pages/Menu";
import ShoppingCart from "./pages/ShoppingCart";
import Stores from "./pages/Stores";
import AddStore from "./pages/AddStore";
import EditStore from "./pages/EditStore";
import Orders from "./pages/Orders";
import ViewOrder from "./pages/ViewOrders";

function App() {
  const Layout = () => {
    return (
      <div className="leela_customer">
        <Header />
        <BannerComponent />
        <div className="leela_customer_body_content">
          <Outlet />
        </div>
        <Footer />
      </div>
    )
  }
  return (
    <div>
      <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/category" element={<Category />} />
          <Route path="/category/add" element={<AddCategory />} />
          <Route path="/category/edit/:id" element={<EditCategory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/view/:id" element={<ViewOrder />} />

          {/* -------------------ADMIN--------------------------------- */}
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/products/edit/:id" element={<EditProduct />} />
          <Route path="/admin/stores" element={<Stores />} />
          <Route path="/admin/stores/add" element={<AddStore />} />
          <Route path="/admin/stores/edit/:id" element={<EditStore />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/users/add" element={<AddUser />} />
          <Route path="/admin/users/edit/:id" element={<EditUser />} />
          <Route path="/admin/category" element={<Category />} />
          <Route path="/admin/category/add" element={<AddCategory />} />
          <Route path="/admin/category/edit/:id" element={<EditCategory />} />

          {/* -------------------CUSTOMER----------------------------- */}
          <Route path='/' element={<Layout />}>
            <Route path='/' element={<Menu />} />
            <Route path='/cart' element={<ShoppingCart />} />
          </Route>
        </Routes>
        <SocketMessage />
    </div>
  );
}

export default App;

import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsLists from "./pages/ProductsLists";
import SingleProduct from "./pages/SingleProduct";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import AddProduct from "./pages/AddProduct";
import SelectedCategory from "./pages/SelectedCategory";
import Wishlist from "./pages/Wishlist";
import MyAccount from "./pages/MyAccount";
import OrderDetails from "./components/OrderDetails";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/products" exact component={ProductsLists} />
        <Route path="/product/:productId" exact component={SingleProduct} />
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="/cart" exact component={Cart} />
        <Route path="/wishlist" exact component={Wishlist} />
        <Route path="/account" exact component={MyAccount} />
        <Route path="/orderDetails/:orderId" exact component={OrderDetails} />
        <Route path="/add-product" exact component={AddProduct} />
        <Route path="/category/:category" exact component={SelectedCategory} />
        {/* Catch-all route for 404 */}
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;

import { useState, useEffect } from "react";
import { auth, fs } from "../pages/firebase";
import "./modal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

const Modal = ({ TotalProductPrice, totalQuantity, hideModal }) => {
  const navigate = useHistory();

  const [cartProducts, setCartProducts] = useState([]);
  const [cell, setCell] = useState(null);
  const [residentialAddress, setResidentialAddress] = useState("");
  const [cartPrice] = useState(TotalProductPrice);
  const [cartQty] = useState(totalQuantity);

  const uid = auth.currentUser.uid;

  const handleCashOnDelivery = async (e) => {
    e.preventDefault();

    const userData = await fs.collection("users").doc(uid).get();
    const FullName = userData.data().FullName;
    const Email = userData.data().Email;
    await fs.collection("Orders").add({
      ShippingDetails: {
        Name: FullName,
        Email: Email,
        CellNo: cell,
        ResidentialAddress: residentialAddress,
      },
      OrderPrice: cartPrice,
      OrderQuantity: cartQty,
      UserId: uid,
      OrderItems: cartProducts,
      PaymentMethod: "Cash on Delivery",
    });
    cartProducts?.forEach((cartProduct) => {
      fs.collection(`Cart${uid}`).doc(cartProduct.ID).delete();
      console.log("deleted");
    });

    hideModal();
    navigate("/");
    toast.success("Your order has been placed successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  };

  useEffect(() => {
    fs.collection("Cart" + uid).onSnapshot((snapshot) => {
      const newCartProduct = snapshot.docs.map((doc) => ({
        ID: doc.id,
        ...doc.data(),
      }));
      setCartProducts(newCartProduct);
    });
  }, [uid]);
  const handleCloseModal = () => {
    hideModal();
  };

  return (
    <div className="shade-area">
      <div className="modal-container">
        <form className="form-group" onSubmit={handleCashOnDelivery}>
          <input
            type="number"
            className="form-control"
            placeholder="Cell No"
            required
            onChange={(e) => setCell(e.target.value)}
            value={cell}
          />
          <br></br>
          <input
            type="text"
            className="form-control"
            placeholder="Residential Address"
            required
            onChange={(e) => setResidentialAddress(e.target.value)}
            value={residentialAddress}
          />
          <br></br>
          <label>Total Quantity</label>
          <input
            type="text"
            className="form-control"
            readOnly
            required
            value={cartQty}
          />
          <br></br>
          <label>Total Price</label>
          <input
            type="text"
            className="form-control"
            readOnly
            required
            value={cartPrice}
          />
          <br></br>
          <button type="submit" className="btn btn-success btn-md">
            Submit
          </button>
        </form>
        <div className="delete-icon" onClick={handleCloseModal}>
          x
        </div>
      </div>
    </div>
  );
};

export default Modal;

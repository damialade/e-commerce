import React from "react";
import IndividualWishlistProduct from "./IndividualWishlistProduct";

const WishlistProducts = ({ wishlistProducts }) => {
  return wishlistProducts.map((wishlistProduct) => (
    <IndividualWishlistProduct
      key={wishlistProduct.ID}
      wishlistProduct={wishlistProduct}
    />
  ));
};

export default WishlistProducts;

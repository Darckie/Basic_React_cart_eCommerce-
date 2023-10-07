import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart } from "phosphor-react";
import { Link } from "react-router-dom"; //  Link for navigation
import "./ProductList.css";

// ---------------------------PRODUCT LIST HERE----------------------------------

function ProductList() {
  const [Products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartsize, setcartsize] = useState(0);
  const cartRef = useRef(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((Response) => Response.json())
      .then((data) => setProducts(data));
  }, []);

  // ---------------------NAVBAR HERE---------------------------
  function Navbar() {
    return (
      <nav className="nav">
        <ul>
          <a href="#">
            <li>Home</li>
          </a>
          <a href="#">
            <li>Products</li>
          </a>
          <a href="#">
            <li>Blog</li>
          </a>
          <a href="#">
            <li>Contact</li>
          </a>
          <a href="#">
            <li>About</li>
          </a>
          <Link onClick={handleScrollToCart}>
            <div style={{ position: "relative" }}>
              <ShoppingCart size={32} />

              {cartsize > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    background: "grey",
                    color: "blue",
                    borderRadius: "50%",
                    padding: "4px 8px",
                  }}
                >
                  {cartsize}
                </div>
              )}
            </div>
          </Link>
        </ul>
      </nav>
    );
  }

  //add to cart Logic here _____________________________
  const addToCart = (product) => {
    // to check if the product is already in the cart
    const itemInCart = cart.find((item) => item.id === product.id);

    if (itemInCart) {
      // If the product is already in the cart, this will update its quantity
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      // If the product is not in the cart, then this will add
      setCart([...cart, { ...product, quantity: 1 }]);
      console.log("item is added into the cart", product);
    }
    setcartsize(cartsize + 1);
  };

  // ---------------------------------------------------------

  //Update cart logic here_____________________________________
  const updateCart = (itemId, action) => {
    // TO Find item in the cart
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        if (action === "increase") {
          setcartsize(cartsize + 1);
          return { ...item, quantity: item.quantity + 1 };
        } else if (action === "decrease") {
          // this logic will Decrease the quantity, and if it becomes zero, it will remove the item
          setcartsize(cartsize - 1);
          const newQuantity = item.quantity - 1;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
      }
      return item;
    });

    //this is to  remove items with quantity zero
    const filteredCart = updatedCart.filter((item) => item !== null);

    setCart(filteredCart);
  };

  //Total quantity __________________________________

  function calculateTotalPrice(cart) {
    let total = 0;
    for (const item of cart) {
      total += item.price * item.quantity;
    }
    return total;
  }

  //-----------------------CART HERE---------------------
  function Carts({ cart = [], updateCart }) {
    const total = calculateTotalPrice(cart);
    return (
      <div ref={cartRef} className="cart-section">
        <h1>Cart</h1>
        <table border="1px" cellSpacing={"5"}>
          <thead>
            <tr>
              <th>Product Preview</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Remove</th>
            </tr>
          </thead>
          {cart.map((cartItem) => (
            <tbody key={cartItem.id}>
              <tr>
                <td>
                  <img
                    src={cartItem.image}
                    className="product-image"
                    alt="img"
                  />
                </td>
                <td> {cartItem.title.slice(0, 5)}</td>
                <td>{cartItem.quantity}</td>
                <td>${cartItem.price}</td>
                <td>
                  <button
                    className="btny"
                    onClick={() => updateCart(cartItem.id, "increase")}
                  >
                    +
                  </button>
                  <button
                    className="btny"
                    onClick={() => updateCart(cartItem.id, "decrease")}
                  >
                    -
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>

        <div className="proceed">
          <div className="total">Total</div>
          <div className="total"> ${total.toFixed(2)}</div>
        </div>
        <button className="btn btnp">Proceed To Checkout</button>
      </div>
    );
  }

  const handleScrollToCart = () => {
    cartRef.current.scrollIntoView({ behavior: "auto" });
  };

  // --------------------------------PRODUCT LIST HERE------------------------

  return (
    <>
      <Navbar />

      <div className="product-list-container">
        {Products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="element">
              <img
                src={product.image}
                // alt={product.title}
                className="product-image"
              />
              <h2 className="product-title">{product.title}</h2>
              <div class="tag">
                <p className="product-price">${product.price}</p>
              </div>
            </div>

            <div className="xbtn">
              <button className="btn buy-now">Buy Now</button>
              <button
                onClick={() => addToCart(product)}
                className="btn add-to-cart-button"
              >
                <ShoppingCart size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Carts cart={cart} updateCart={updateCart} />
    </>
  );
}

export default ProductList;

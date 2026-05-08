export default function Cart({
  cart,
  removeFromCart,
  updateQuantity,
  authToken
}) {

  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <div className="content">

      <h2 className="title">
        Shopping Cart ({cart.length})
      </h2>

      {cart.length === 0 && <p>Your cart is empty</p>}

      {cart.map((item) => (

        <div key={item.id} className="cart-item">

          <div>
            <h4>{item.name}</h4>
            <p>{item.price} ETH</p>
          </div>

          <div className="cart-right">

            <input
              type="number"
              className="quantity-input"
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.id, parseInt(e.target.value))
              }
            />

            <span className="cart-price">
              {(item.price * item.quantity).toFixed(4)} ETH
            </span>

            <button
              className="button button-red"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>

          </div>
        </div>

      ))}

      {cart.length > 0 && (
        <div className="cart-total">

          <h3>Total: {totalPrice.toFixed(4)} ETH</h3>

          <button
            className={`button ${authToken ? "button-green" : "button-disabled"}`}
            disabled={!authToken}
          >
            Pay with MetaMask
          </button>

        </div>
      )}
    </div>
  );
}
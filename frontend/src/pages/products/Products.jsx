export default function Products({ products, addToCart }) {
  return (
    <div className="content">
      <h2 className="title">Shop - {products.length} products</h2>
      <div className="products-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <h3 className="product-name">{p.name}</h3>
            <p className="product-description">
              {p.description || "No description"}
            </p>
            <p className="product-price">{p.price} ETH</p>
            <button className="button" onClick={() => addToCart(p)}>
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

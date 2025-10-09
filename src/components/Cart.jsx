
import { useCart } from "../context/CartContext";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80";

export default function Cart() {
  const { cart, incrementItem, decrementItem, removeFromCart, clearCart } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.modifiers[0].option.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <aside className="bg-white rounded-[24px] border border-[rgba(15,23,42,0.08)] shadow-[0_10px_30px_rgba(15,23,42,0.12)] p-7 flex flex-col gap-6">
      <header className="flex justify-between items-start gap-4">
        <div>
          <h2 className="m-0 text-xl font-semibold">Your Cart</h2>
          <p className="mt-1 text-slate-500 text-sm">
            Review and adjust your selection before checkout.
          </p>
        </div>
        {!!cart.length && (
          <button
            className="bg-transparent text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
            onClick={clearCart}
          >
            Clear all
          </button>
        )}
      </header>

      <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-2" role="list">
        {cart.length === 0 ? (
          <div className="grid place-items-center text-center py-10 text-slate-500 gap-2">
            <span className="text-4xl">🍽️</span>
            <p>Your plate is empty. Add something delicious!</p>
          </div>
        ) : (
          cart.map((item) => (
            <article
              key={item?.id}
              className="grid grid-cols-[72px_1fr_auto] gap-4 items-center pb-4 border-b border-[rgba(15,23,42,0.08)]"
              role="listitem"
            >
              <div className="w-[72px] h-[72px]">
                <img
                  src={item?.imageURL || FALLBACK_IMAGE}
                  alt=""
                  className="w-full h-full object-cover rounded-[12px]"
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                />
              </div>
              <div>
                <h3 className="m-0 text-base font-semibold">{item.name}</h3>
                <p className="m-1 text-slate-500 text-sm">{item.description?.slice(0, 50)}</p>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <span>₹{item?.modifiers[0].option.price}</span>
                  {item?.quantity > 1 && (
                    <span className="text-slate-400 text-xs">× {item?.quantity}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrementItem(item?.id)}
                  className="w-8 h-8 rounded-md bg-[rgba(15,23,42,0.06)] hover:bg-[rgba(15,23,42,0.12)] text-lg font-bold"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span>{item?.quantity}</span>
                <button
                  onClick={() => incrementItem(item?.id)}
                  className="w-8 h-8 rounded-md bg-[rgba(15,23,42,0.06)] hover:bg-[rgba(15,23,42,0.12)] text-lg font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item?.id)}
                  className="w-8 h-8 rounded-md bg-[rgba(239,68,68,0.12)] text-red-500 hover:bg-[rgba(239,68,68,0.2)]"
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <footer className="flex flex-col gap-2 pt-4 border-t border-[rgba(15,23,42,0.08)]">
        <div className="flex justify-between text-slate-500 text-sm">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-500 text-sm">
          <span>Service fee (5%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-base text-slate-800">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </footer>
    </aside>
  );
}




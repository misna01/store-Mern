import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.seller?._id;
    const { productId, quantity } = req.body;

    const qty = Number(quantity) || 1; // ✅ USE FRONTEND QUANTITY

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: qty }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        // ✅ ADD SELECTED QUANTITY
        existingItem.quantity += qty;
      } else {
        cart.items.push({ productId, quantity: qty });
      }
    }

    await cart.save();

    res.json({
      success: true,
      message: `Added ${qty} item(s) to cart`,
      cart,
    });
  } catch (error) {
    console.error("addToCart error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
    });
  }
};

export const getCart = async (req, res) => {
  try {
const userId = req.user?._id || req.seller?._id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};



// DELETE item from cart
export const removeCartItem = async (req, res) => {
  const { productId } = req.params;

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.json({ msg: "Cart not found" });

  cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  await cart.save();

  res.json({ msg: "Item removed", cart });
};

// ➕ Increment
export const incrementCartQty = async (req, res) => {
  const { productId } = req.params;

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.json({ msg: "Cart not found" });

  const item = cart.items.find(
    (i) => i.productId.toString() === productId
  );
  if (!item) return res.json({ msg: "Item not found" });

  const product = await Product.findById(productId);

  // ✅ FIXED: use product.quantity
  if (item.quantity >= product.quantity)
    return res.json({ msg: "Stock limit reached" });

  item.quantity += 1;
  await cart.save();

  res.json({ msg: "Increased", cart });
};


// ➖ Decrement
export const decrementCartQty = async (req, res) => {
  const { productId } = req.params;

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.json({ msg: "Cart not found" });

  const item = cart.items.find((i) => i.productId.toString() === productId);
  if (!item) return res.json({ msg: "Item not found" });

  if (item.quantity > 1) item.quantity -= 1;
  else cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

  await cart.save();

  res.json({ msg: "Decreased", cart });
};

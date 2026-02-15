import Product from "../models/productModel.js";

export const getShopProducts = async (req, res) => {
  try {
    const {
      search = "",
      brand = "all",
      category = "all",
      minPrice,
      maxPrice,
    } = req.query;

    // 1. Base query for visible/approved products
    const filter = {
      status: "APPROVED",
      isBlocked: { $ne: true },
      isListed: { $ne: false },
      quantity: { $gt: 0 },
    };

    // 2. Search logic (matches name OR brand)
    if (search && search.trim() !== "") {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // 3. Brand Filter (Case Insensitive)
    if (brand && brand !== "all") {
      filter.brand = { $regex: new RegExp(`^${brand.trim()}$`, "i") };
    }

    // 4. Category Filter (Case Insensitive)
    if (category && category !== "all") {
      filter.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    // 5. Price Range (Using display price logic)
    if (minPrice || maxPrice) {
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || 9999999;

      filter.$expr = {
        $and: [
          { $gte: [{ $ifNull: ["$salePrice", "$regularPrice"] }, min] },
          { $lte: [{ $ifNull: ["$salePrice", "$regularPrice"] }, max] },
        ],
      };
    }

    // Fetch and sort
    const products = await Product.find(filter).sort({ createdAt: -1 });

    // Format for frontend
    const formatted = products.map((p) => {
      const obj = p.toObject();
      obj.image = obj.images?.[0] || null; // Flatten images array
      obj.displayPrice = obj.salePrice && obj.salePrice > 0 
        ? obj.salePrice 
        : obj.regularPrice;
      return obj;
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error("SHOP FILTER ERROR:", err);
    res.status(500).json({ message: "Failed to load products" });
  }
};
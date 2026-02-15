
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

import { uploadBufferToCloudinary } from "../config/uploadToCloudinary.js";

// export const addProduct = async (req, res) => {
//   try {
//     const { name, brand, description, price, category } = req.body;

//     if (!name || !price || !category) {
//       return res.status(400).json({
//         message: "Name, price and category are required",
//       });
//     }

//     const files = req.files || [];
//     if (files.length === 0) {
//       return res.status(400).json({
//         message: "At least one image is required",
//       });
//     }

//     const imageUrls = [];

//     for (const file of files) {
//       const result = await uploadBufferToCloudinary(
//         file.buffer,
//         "products"
//       );
//       imageUrls.push(result.secure_url);
//     }

//     const product = await Product.create({
//       sellerId: req.seller?._id || null,
//       name,
//       brand,
//       category,        // ✅ SAVED
//       description,
//       price: Number(price),
//       images: imageUrls,
//     });

//     res.status(201).json({
//       message: "Product created successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("addProduct error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
// controllers/productController.js
// export const addProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       brand,
//       category,
//       description,
//       regularPrice,
//       salePrice,
//       quantity,
//       colors,
//     } = req.body;

//     if (!name || !category || !regularPrice || !salePrice || !quantity) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const files = req.files || [];
//     if (!files.length) {
//       return res.status(400).json({ message: "At least one image required" });
//     }

//     const imageUrls = [];
//     for (const file of files) {
//       const upload = await uploadBufferToCloudinary(file.buffer, "products");
//       imageUrls.push(upload.secure_url);
//     }

//     const product = await Product.create({
//       sellerId: req.seller._id,
//       name,
//       brand,
//       category,
//       description,
//       regularPrice: Number(regularPrice),
//       salePrice: Number(salePrice),
//       quantity: Number(quantity),
//       colors: colors ? JSON.parse(colors) : [],
//       images: imageUrls,
//     });

//     res.status(201).json({ success: true, product });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Add product failed" });
//   }
// };


export const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      regularPrice,
      salePrice,
      quantity,
      colors,
    } = req.body;

    if (!name || !category || !regularPrice || !salePrice || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: "At least one image required" });
    }

    /* ================= UPSERT CATEGORY ================= */
    const normalizedCategory = category.trim().toLowerCase();

    await Category.findOneAndUpdate(
      { name: normalizedCategory },
      { $setOnInsert: { name: normalizedCategory, isActive: true } },
      { upsert: true, new: true }
    );

    /* ================= UPLOAD IMAGES ================= */
    const imageUrls = [];
    for (const file of files) {
      const upload = await uploadBufferToCloudinary(file.buffer, "products");
      imageUrls.push(upload.secure_url);
    }

    const product = await Product.create({
      sellerId: req.seller._id,
      name,
      brand,
      category: normalizedCategory, // normalized
      description,
      regularPrice: Number(regularPrice),
      salePrice: Number(salePrice),
      quantity: Number(quantity),
      colors: colors ? JSON.parse(colors) : [],
      images: imageUrls,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Add product failed" });
  }
};


// // ✅ Get All Products (CORRECTED to handle both Admin and Seller products)
export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find().sort({ _id: -1 });

    // 💡 Map over the products to standardize the 'image' field for the frontend
    const standardizedProducts = allProducts.map(product => {
      const productObject = product.toObject(); // Convert Mongoose document to plain JS object

      // 1. Check if it's a Seller Product (has an 'images' array)
      if (productObject.images && productObject.images.length > 0) {
          // Set the primary image to the first element of the 'images' array
 productObject.image = productObject.images[0];

 // OPTIONAL: Remove the 'images' array from the final response if you only want 'image'
delete productObject.images; 
      } 
      // 2. Admin Products already have the 'image' field, so no change is needed for them.

      return productObject;
    });

    res.json(standardizedProducts);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// export const getSellerProducts = async (req, res) => {
//   try {
//     const sellerId = req.seller._id;

//     const products = await Product.find({ sellerId });

//     res.json({
//       success: true,
//       products,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to load products",
//     });
//   }
// };
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      sellerId: req.seller._id,
    }).sort({ createdAt: -1 });

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("sellerId", "businessName");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productObj = product.toObject();

    // ✅ Keep ALL images
    productObj.images = productObj.images || [];

    // ✅ Optional: main image
    productObj.mainImage = productObj.images[0] || null;

    productObj.sellerName =
      productObj.sellerId?.businessName || "Admin";

    delete productObj.sellerId;

    res.json(productObj);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    /* ================= UPDATE FIELDS ================= */
    const fields = [
      "name",
      "brand",
      "category",
      "description",
      "regularPrice",
      "salePrice",
      "quantity",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] =
          ["regularPrice", "salePrice", "quantity"].includes(field)
            ? Number(req.body[field])
            : req.body[field];
      }
    });

    /* ================= COLORS ================= */
    if (req.body.colors) {
      product.colors = JSON.parse(req.body.colors); // array
    }

    /* ================= IMAGE REMOVE ================= */
    const removedImages = req.body.removedImages
      ? JSON.parse(req.body.removedImages)
      : [];

    let images = product.images.filter(
      (img) => !removedImages.includes(img)
    );

    /* ================= IMAGE ADD ================= */
    if (req.files?.length) {
      const uploads = await Promise.all(
        req.files.map((file) =>
          uploadBufferToCloudinary(file.buffer, "products")
        )
      );

      images.push(...uploads.map((u) => u.secure_url));
    }

    if (!images.length) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    if (images.length > 5) {
      return res
        .status(400)
        .json({ message: "Maximum 5 images allowed" });
    }

    product.images = images;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("editProduct error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getSellerProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.seller._id, // 🔐 ownership check
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("getSellerProductById error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const addOffer = async (req, res) => {
  try {
    const { productId, percentage } = req.body;

    if (!percentage || percentage <= 0 || percentage > 90) {
      return res.status(400).json({ message: "Invalid offer value" });
    }

    const product = await Product.findOne({
      _id: productId,
      sellerId: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.offer = Number(percentage);

    // 🔥 auto recalc sale price
    product.salePrice = Math.round(
      product.regularPrice -
        (product.regularPrice * product.offer) / 100
    );

    await product.save();

    res.json({
      status: true,
      message: "Offer added successfully",
    });
  } catch (error) {
    console.error("addOffer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const removeOffer = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findOne({
      _id: productId,
      sellerId: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.offer = 0;
    product.salePrice = product.regularPrice;

    await product.save();

    res.json({
      status: true,
      message: "Offer removed successfully",
    });
  } catch (error) {
    console.error("removeOffer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isBlocked = !product.isBlocked;
    await product.save();

    const products = await Product.find({
      sellerId: req.seller._id,
    });

    res.json({
      status: true,
      products,
    });
  } catch (error) {
    console.error("toggleProductStatus error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const toggleFeatureProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    const products = await Product.find({
      sellerId: req.seller._id,
    });

    res.json({
      status: true,
      products,
    });
  } catch (error) {
    console.error("toggleFeatureProduct error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isBlocked: false,
      quantity: { $gt: 0 },
    })
      .sort({ createdAt: -1 })
      .limit(8); // 👈 limit for home page

    // 🔥 Normalize image for frontend (your Home uses p.image)
    const formatted = products.map((p) => {
      const obj = p.toObject();
      obj.image = obj.images?.[0] || null;
      obj.price = obj.salePrice || obj.regularPrice;
      return obj;
    });

    res.json(formatted);
  } catch (error) {
    console.error("getFeaturedProducts error:", error);
    res.status(500).json({ message: "Failed to load featured products" });
  }
};
export const searchSellerProducts = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { q } = req.query; // search text

    const filter = {
      sellerId,
    };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("searchSellerProducts error:", error);
    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

export const toggleListProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.seller._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isListed = !product.isListed;
    await product.save();

    const products = await Product.find({
      sellerId: req.seller._id,
    });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("toggleListProduct error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// GET RELATED PRODUCTS BY CATEGORY
// ================================
export const getRelatedProducts = async (req, res) => {
  try {
    const { category, excludeId } = req.query;

    if (!category) {
      return res.json([]);
    }

    const products = await Product.find({
      category: category.toLowerCase(),
      _id: { $ne: excludeId },     // exclude current product
      isBlocked: false,
      isListed: true,
      quantity: { $gt: 0 },
    })
      .sort({ createdAt: -1 })
      .limit(6);

    // Normalize for frontend
    const formatted = products.map((p) => {
      const obj = p.toObject();
      obj.image = obj.images?.[0] || null;
      obj.price = obj.salePrice || obj.regularPrice;
      return obj;
    });

    res.json(formatted);
  } catch (error) {
    console.error("getRelatedProducts error:", error);
    res.status(500).json({ message: "Failed to load related products" });
  }
};


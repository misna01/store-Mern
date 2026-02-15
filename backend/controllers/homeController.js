import Category from "../models/categoryModel.js";

/* ================= GET HOME CATEGORIES ================= */
export const getHomeCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(8);

    const formatted = categories.map((c) => ({
      _id: c._id,
      name: c.name,
      slug: c.name.toLowerCase().replace(/\s+/g, "-"),
      image: `/images/categories/${c.name
        .toLowerCase()
        .replace(/\s+/g, "-")}.jpg`,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("getHomeCategories error:", error);
    res.status(500).json({ message: "Failed to load categories" });
  }
};

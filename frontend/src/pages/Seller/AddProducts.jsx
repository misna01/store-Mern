
import React, { useState, useRef } from "react";
import axios from "axios";
import Navbar from "../../shared/Navbar";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AddProducts = () => {
  const cropperRef = useRef(null);
  const token = localStorage.getItem("token");

  /* ================= STATES ================= */
  const [form, setForm] = useState({
    name: "",
    brand: "",
    regularPrice: "",
    salePrice: "",
    quantity: "",
    colors: "",
    description: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const [images, setImages] = useState([null, null, null, null, null]);
  const [previews, setPreviews] = useState(["", "", "", "", ""]);

  const [cropSrc, setCropSrc] = useState("");
  const [cropIndex, setCropIndex] = useState(null);

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= IMAGE CROP ================= */
  const handleImageSelect = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return Swal.fire("Error", "Only image files allowed", "error");
    }

    setCropIndex(index);
    setCropSrc(URL.createObjectURL(file));
  };

  const handleCropSave = () => {
    const cropper = cropperRef.current.cropper;
    const canvas = cropper.getCroppedCanvas({ width: 800, height: 800 });

    canvas.toBlob((blob) => {
      const file = new File([blob], `product-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      const imgs = [...images];
      const prevs = [...previews];

      imgs[cropIndex] = file;
      prevs[cropIndex] = URL.createObjectURL(file);

      setImages(imgs);
      setPreviews(prevs);
      setCropSrc("");
    });
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    if (!form.name.trim())
      return "Product name is required";

    if (!form.brand.trim())
      return "Brand is required";

    const category = customCategory || selectedCategory;
    if (!category)
      return "Category is required";

    if (!form.regularPrice || form.regularPrice <= 0)
      return "Regular price must be greater than 0";

    if (!form.salePrice || form.salePrice <= 0)
      return "Sale price must be greater than 0";

    if (Number(form.salePrice) >= Number(form.regularPrice))
      return "Sale price must be less than regular price";

    if (!form.quantity || form.quantity < 0)
      return "Quantity must be 0 or more";

    if (!form.colors.trim())
      return "At least one color is required";

    const colorArray = form.colors.split(",").map(c => c.trim());
    if (colorArray.some(c => c.length === 0))
      return "Invalid color format";

    if (!form.description.trim() || form.description.length < 10)
      return "Description must be at least 10 characters";

    const imageCount = images.filter(Boolean).length;
    if (imageCount === 0)
      return "At least one product image is required";

    if (imageCount > 5)
      return "Maximum 5 images allowed";

    return null;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      return Swal.fire("Validation Error", error, "error");
    }

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("brand", form.brand);
      data.append("category", customCategory || selectedCategory);
      data.append("regularPrice", form.regularPrice);
      data.append("salePrice", form.salePrice);
      data.append("quantity", form.quantity);
      data.append(
        "colors",
        JSON.stringify(form.colors.split(",").map(c => c.trim()))
      );
      data.append("description", form.description);

      images.forEach((img) => img && data.append("images", img));

      await axios.post(
        "http://localhost:5000/api/seller/add-product",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success", "Product added successfully", "success");

      // RESET FORM
      setForm({
        name: "",
        brand: "",
        regularPrice: "",
        salePrice: "",
        quantity: "",
        colors: "",
        description: "",
      });
      setImages([null, null, null, null, null]);
      setPreviews(["", "", "", "", ""]);
      setSelectedCategory("");
      setCustomCategory("");

    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Add product failed",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* CROPPER MODAL */}
      {cropSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-[90%] max-w-lg">
            <Cropper ref={cropperRef} src={cropSrc} aspectRatio={1} />
            <button
              onClick={handleCropSave}
              className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Crop & Save
            </button>
          </div>
        </div>
      )}

      <div className="flex">
        {/* SIDEBAR */}
        

        {/* FORM */}
        <div className="flex-1 p-10">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded space-y-4">

            <input name="name" placeholder="Product Name" onChange={handleChange} value={form.name} className="w-full border p-2" />
            <input name="brand" placeholder="Brand" onChange={handleChange} value={form.brand} className="w-full border p-2" />

            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full border p-2">
              <option value="">Select Category</option>
              <option>Rings</option>
              <option>Necklace</option>
              <option>Earrings</option>
            </select>

            <input placeholder="Or custom category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="w-full border p-2" />

            <input name="regularPrice" type="number" placeholder="Regular Price" onChange={handleChange} value={form.regularPrice} className="w-full border p-2" />
            <input name="salePrice" type="number" placeholder="Sale Price" onChange={handleChange} value={form.salePrice} className="w-full border p-2" />
            <input name="quantity" type="number" placeholder="Quantity" onChange={handleChange} value={form.quantity} className="w-full border p-2" />

            <input name="colors" placeholder="Colors (Red,Blue)" onChange={handleChange} value={form.colors} className="w-full border p-2" />
            <textarea name="description" placeholder="Description" onChange={handleChange} value={form.description} className="w-full border p-2" />

            {[0, 1, 2, 3, 4].map((i) => (
              <input key={i} type="file" accept="image/*" onChange={(e) => handleImageSelect(e, i)} />
            ))}

            <button className="bg-indigo-600 text-white px-6 py-2 rounded">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;

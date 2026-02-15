import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../shared/Navbar";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const cropperRef = useRef(null);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    name: "",
    brand: "",
    regularPrice: "",
    salePrice: "",
    quantity: "",
    colors: "",
    description: "",
    category: "",
  });

  /* ================= IMAGES ================= */
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  /* ================= CROPPER ================= */
  const [cropSrc, setCropSrc] = useState("");
  const [replaceIndex, setReplaceIndex] = useState(null);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/seller/product/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const p = res.data;

        setForm({
          name: p.name,
          brand: p.brand,
          category: p.category,
          regularPrice: p.regularPrice,
          salePrice: p.salePrice,
          quantity: p.quantity,
          colors: p.colors?.join(", "),
          description: p.description,
        });

        setExistingImages(p.images || []);
      } catch {
        alert("Product not found");
        navigate("/seller/manage-products");
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= INPUT ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= ADD MULTIPLE NEW ================= */
  const handleAddImages = (files) => {
    const arr = Array.from(files);
    if (!arr.length) return;

    const total = existingImages.length + newImages.length + arr.length;
    if (total > 5) return alert("Max 5 images allowed");

    const file = arr[0];
    setReplaceIndex(null);
    setCropSrc(URL.createObjectURL(file));
    setPreviews(arr);
  };

  /* ================= REPLACE EXISTING ================= */
  const handleReplaceImage = (file, index) => {
    setReplaceIndex(index);
    setCropSrc(URL.createObjectURL(file));
  };

  /* ================= CROP SAVE ================= */
  const handleCropSave = () => {
    const cropper = cropperRef.current.cropper;
    const canvas = cropper.getCroppedCanvas({
      width: 800,
      height: 800,
      imageSmoothingQuality: "high",
    });

    canvas.toBlob((blob) => {
      const file = new File([blob], `product-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      if (replaceIndex !== null) {
        setRemovedImages((prev) => [...prev, existingImages[replaceIndex]]);
        setExistingImages((prev) =>
          prev.filter((_, i) => i !== replaceIndex)
        );
        setNewImages((prev) => [...prev, file]);
      } else {
        setNewImages((prev) => [...prev, file]);
      }

      setCropSrc("");
      setReplaceIndex(null);
    }, "image/jpeg");
  };

  /* ================= REMOVE OLD ================= */
  const removeExisting = (img, index) => {
    setRemovedImages((prev) => [...prev, img]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (k === "colors") {
        data.append(
          "colors",
          JSON.stringify(v.split(",").map((c) => c.trim()))
        );
      } else {
        data.append(k, v);
      }
    });

    data.append("removedImages", JSON.stringify(removedImages));
    newImages.forEach((img) => data.append("images", img));

    try {
      await axios.put(
        `http://localhost:5000/api/seller/edit-product/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Product updated");
      navigate("/seller/manage-products");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* CROPPER */}
      {cropSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-[90%] max-w-lg">
            <Cropper ref={cropperRef} src={cropSrc} aspectRatio={1} />
            <button
              onClick={handleCropSave}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Crop & Save
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white p-6 mt-10 space-y-4"
      >
        <input name="name" value={form.name} onChange={handleChange} className="border p-2 w-full" />
        <input name="brand" value={form.brand} onChange={handleChange} className="border p-2 w-full" />
        <input name="regularPrice" type="number" value={form.regularPrice} onChange={handleChange} className="border p-2 w-full" />
        <input name="salePrice" type="number" value={form.salePrice} onChange={handleChange} className="border p-2 w-full" />
        <input name="quantity" type="number" value={form.quantity} onChange={handleChange} className="border p-2 w-full" />
        <input name="colors" value={form.colors} onChange={handleChange} className="border p-2 w-full" />
        <textarea name="description" value={form.description} onChange={handleChange} className="border p-2 w-full" />

        {/* EXISTING */}
        <div className="grid grid-cols-5 gap-3">
          {existingImages.map((img, i) => (
            <div key={i}>
              <img src={img} className="h-24 w-full object-cover" />
              <button type="button" onClick={() => removeExisting(img, i)}>❌</button>
              <input type="file" onChange={(e) => handleReplaceImage(e.target.files[0], i)} />
            </div>
          ))}
        </div>

        {/* ADD NEW */}
        <input type="file" multiple onChange={(e) => handleAddImages(e.target.files)} />

        <div className="flex gap-2">
          {newImages.map((img, i) => (
            <img key={i} src={URL.createObjectURL(img)} className="h-20 w-20" />
          ))}
        </div>

        <button className="bg-indigo-600 text-white px-6 py-2 rounded">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;

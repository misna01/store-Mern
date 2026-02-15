// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const EditSellerProfile = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     businessName: "",
//     businessAddress: "",
//     pinCode: "",
//     city: "",
//     state: "",
//     gst: "",
//     pan: "",
//     bankAccount: "",
//     ifsc: "",
//     storeName: "",
//     sellerType: ""
//   });

//   const [loading, setLoading] = useState(true);

//   // Fetch current seller profile
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/seller/profile", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setFormData(res.data);
//       } catch (err) {
//         console.log(err);
//         navigate("/login");
//       }
//       setLoading(false);
//     };

//     fetchData();
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Submit update
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(
//         "http://localhost:5000/api/seller/update-profile",
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Profile updated successfully!");
//       navigate("/seller/profile");

//     } catch (err) {
//       console.error(err);
//       alert("Update failed!");
//     }
//   };

//   if (loading) return <p className="text-center p-10">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-xl shadow-xl w-full max-w-3xl"
//       >
//         <h2 className="text-3xl font-bold mb-6">Edit Seller Profile</h2>

//         {/* FORM INPUTS */}
//         {Object.keys(formData).map((key) => (
//           <div className="mb-4" key={key}>
//             <label className="block text-sm font-semibold mb-1 capitalize">
//               {key.replace(/([A-Z])/g, " $1")}
//             </label>
//             <input
//               type="text"
//               name={key}
//               value={formData[key] || ""}
//               onChange={handleChange}
//               className="w-full border px-4 py-2 rounded-md"
//             />
//           </div>
//         ))}

//         <button
//           type="submit"
//           className="w-full mt-4 bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800"
//         >
//           Save Changes
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditSellerProfile;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditSellerProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState({});

  // editable text fields
  const [editable, setEditable] = useState({
    fullName: "",
    phone: "",
    businessAddress: "",
    city: "",
    state: "",
    storeName: ""
  });

  // documents (existing url OR new File)
  const [documents, setDocuments] = useState({
    panCard: "",
    gstCertificate: "",
    brandCertificate: "",
    addressProof: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/seller/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSeller(res.data);
        setEditable({
          fullName: res.data.fullName || "",
          phone: res.data.phone || "",
          businessAddress: res.data.businessAddress || "",
          city: res.data.city || "",
          state: res.data.state || "",
          storeName: res.data.storeName || ""
        });
        setDocuments(res.data.documents || {});
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setEditable({ ...editable, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocuments({ ...documents, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // append editable text fields
    Object.keys(editable).forEach((key) =>
      data.append(key, editable[key])
    );

    // append documents if replaced
    Object.keys(documents).forEach((key) => {
      if (documents[key] instanceof File) {
        data.append(key, documents[key]);
      }
    });

    try {
      await axios.put(
        "http://localhost:5000/api/seller/update-profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Profile updated successfully");
      navigate("/seller/profile");
    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl p-8 rounded-xl shadow"
      >
        <h2 className="text-2xl font-bold mb-6">Edit Seller Profile</h2>

        {/* EDITABLE */}
        <h3 className="font-semibold mb-4">Editable Details</h3>

        {Object.keys(editable).map((key) => (
          <div className="mb-4" key={key}>
            <label className="block mb-1 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={key}
              value={editable[key]}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>
        ))}

        {/* READ ONLY */}
        <h3 className="font-semibold mt-6 mb-4">
          Other Details (Read Only)
        </h3>

        {[
          "email",
          "sellerType",
          "businessName",
          "gst",
          "pan",
          "bankAccount",
          "ifsc",
          "pinCode",
          "status"
        ].map((key) => (
          <div className="mb-3" key={key}>
            <label className="block text-sm capitalize">{key}</label>
            <input
              value={seller[key] || ""}
              readOnly
              className="w-full border px-4 py-2 rounded bg-gray-100"
            />
          </div>
        ))}

        {/* DOCUMENTS */}
        <h3 className="font-semibold mt-6 mb-4">Documents</h3>

        {Object.keys(documents).map((key) => (
          <div key={key} className="mb-4">
            <label className="block capitalize mb-1">{key}</label>

            {typeof documents[key] === "string" && documents[key] && (
              <a
                href={documents[key]}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline block mb-1"
              >
                View current
              </a>
            )}

            <input
              type="file"
              name={key}
              onChange={handleFileChange}
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full mt-6 bg-black text-white py-3 rounded-lg font-bold"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditSellerProfile;

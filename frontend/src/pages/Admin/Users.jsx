import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.users);
      setLoading(false);
    } catch (error) {
      alert("Failed to load users");
      setLoading(false);
    }
  };

  const toggleBlock = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `http://localhost:5000/api/admin/users/block/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers(); // refresh list
    } catch (error) {
      alert("Failed to update user");
    }
  };

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>

                <td className="px-4 py-3">
                  {user.isBlocked ? (
                    <span className="text-red-600 font-semibold">
                      Blocked
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      Active
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleBlock(user._id)}
                    className={`px-4 py-1 rounded text-white text-sm ${
                      user.isBlocked
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;

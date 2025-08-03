import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/admin/register`, { name, email, password });
      alert("Admin registration successful, please login");
      navigate("/admin/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-2xl font-bold">Admin Register</h2>
      <input className="border p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister} className="px-4 py-2 bg-green-600 text-white rounded">Register</button>
    </div>
  );
};

export default AdminRegister;

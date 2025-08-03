import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/admin/login`, { email, password });
      const token = res.data.token;
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload.isAdmin) return alert("Not an admin account");

      localStorage.setItem("token", token);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-2xl font-bold">Admin Login</h2>
      <input className="border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>

      <p className="mt-4">
        Don't have an account?{" "}
        <Link to="/admin/register" className="text-blue-500 underline">Register as Admin</Link>
      </p>
    </div>
  );
};

export default AdminLogin;

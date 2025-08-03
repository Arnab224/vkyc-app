import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/register", { name, email, password });
      alert("Registration successful, please login.");
      navigate("/user/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-2xl font-bold">User Registration</h2>
      <input className="border p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister} className="px-4 py-2 bg-green-600 text-white rounded">Register</button>
    </div>
  );
};

export default UserRegister;

'use client';

import { useState } from "react";
import { registerUser, loginUser } from "@/action";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
        if (!username || !password) {
            alert("Please fill in both Username and Password.");
            return;
          }
      const res = await registerUser(username, password);
      alert("Registration successful. Please login.");
      // 입력 필드 초기화
        setUsername("");
        setPassword("");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again");
    }
  };

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password
    });

    if (res.ok) {
      alert("Login successful!");
      window.location.href = "/note/1";
    } else {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Note App</h1>
      <input
        type="text"
        placeholder="id"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-4 p-2 border rounded w-64"
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border rounded w-64"
      />
      <button
        onClick={handleLogin}
        className="mb-2 w-64 p-2 bg-black text-white rounded"
      >
        Login
      </button>
      <button
        onClick={handleRegister}
        className="w-64 p-2 bg-gray-300 text-black rounded"
      >
        Register
      </button>
    </div>
  );
}

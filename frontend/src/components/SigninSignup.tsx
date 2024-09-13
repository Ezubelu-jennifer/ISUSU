"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

const SignInSignUp: React.FC<{ onClose?: () => void; onAuthenticate?: () => void }> = ({ onClose, onAuthenticate }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    dateOfBirth: '',
    stateOfOrigin: '',
    address: '',
    career: '',
  });

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      fullName: '',
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      dateOfBirth: '',
      stateOfOrigin: '',
      address: '',
      career: '',
    });
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const userDetails = {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        stateOfOrigin: formData.stateOfOrigin,
        address: formData.address,
        career: formData.career,
      };

      // Sign-Up Logic
      console.log("Sign up with:", formData);
      // Store user details in localStorage for simplicity
      localStorage.setItem("user", JSON.stringify(userDetails));

      localStorage.setItem("username", formData.username);
      localStorage.setItem("password", formData.password);
      setIsAuthenticated(true);
      router.push("/dashboard"); // Redirect to dashboard

    } else {
      console.log("Sign in with:", { username: formData.username, password: formData.password });
     // const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Sign-In Logic
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser.username === formData.username && storedUser.password === formData.password) {
        setIsAuthenticated(true);
        router.push("/dashboard"); // Redirect to dashboard

      } else {
        alert("Invalid username or password.");
      }
    }
   
  };


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setIsAuthenticated(true);
    }
  }, []);


  const handleSignOut = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    router.push("/"); // Redirect to home
  };

  return (
    <div className="container mx-auto p-4 max-w-md h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <>
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">State of Origin</label>
              <input
                type="text"
                name="stateOfOrigin"
                value={formData.stateOfOrigin}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Career</label>
              <input
                type="text"
                name="career"
                value={formData.career}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
             {formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-sm">Passwords do not match.</p>
            )}
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded mt-4"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <p className="text-center mt-4">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={toggleSignUp}
          className="text-blue-500 hover:underline"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
      {localStorage.getItem("user") && (
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white p-2 rounded mt-4"
        >
          Sign Out
        </button>
      )}
    </div>
  );
};

export default SignInSignUp;

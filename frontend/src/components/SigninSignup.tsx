"use client"; 

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const SignInSignUp: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 // const router = useRouter(); 

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      console.log('Sign up with:', { username, password });
      // Add sign-up logic here (e.g., API call)
    } else {
      console.log('Sign in with:', { username, password });
      // Add sign-in logic here (e.g., API call)
     // router.push('/create-group');
    }
  };

  const handleGmailSignIn = () => {
    console.log('Sign in with Gmail');
    // Add Gmail API sign-in logic here
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <Link href="/dashboard">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded mt-4"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        </Link>
      </form>
      {!isSignUp && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Or sign in with
          </p>
          <button
            onClick={handleGmailSignIn}
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center justify-center mx-auto"
          >
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google logo"
              className="mr-2"
            />
            Sign in with Gmail
          </button>
        </div>
      )}
      <p className="text-center mt-4">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={toggleSignUp}
          className="text-blue-500 hover:underline"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default SignInSignUp;
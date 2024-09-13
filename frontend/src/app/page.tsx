"use client";

import { useState, useEffect } from "react";
import SignInSignUp from "@/components/SigninSignup";
import Dashboard from "@/app/dashboard/page";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showModal, setShowModal] = useState(true); // Modal starts open to enforce authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleSignInSignUpClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    setShowModal(false); // Close modal after successful authentication
    localStorage.setItem("username", "exampleUser"); // Store a mock user

  };

  useEffect(() => {
    // Check if the user is already authenticated (for example, by checking local storage)
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setIsAuthenticated(true);
      setShowModal(false); // Hide modal if already authenticated
    }else{
      setShowModal(true);
    }
  }, []);

  const handleLogout = () => {

    setIsAuthenticated(false);
    setShowModal(true); // Show the modal again after logout
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    router.push('/'); // Redirect to home page

  };

  return (
    <div className="relative min-h-screen">

    {/* Display Dashboard only if authenticated */}
    {isAuthenticated ? (
      <Dashboard onLogout={handleLogout} />
      ) : (
        <>

      {/* Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative z-60">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <SignInSignUp
              onClose={handleCloseModal}
              onAuthenticate={handleAuthentication}
            />
          </div>
          </div>
      )}
        {/* Background overlay to prevent interactions */}
        {showModal && (
            <div className="fixed inset-0 bg-black opacity-30 z-40" />
          )}
        </>
      )}

       {/* Logout button */}
       {isAuthenticated && (
        <button
          className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
     
    </div>
  );
}

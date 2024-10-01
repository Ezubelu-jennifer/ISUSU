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
    //localStorage.setItem("username", "exampleUser"); // Store a mock user

  };

  useEffect(() => {
    // Check if the user is already authenticated (for example, by checking local storage)
    const storedUser = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (storedUser&& password) {
      setIsAuthenticated(true);
      setShowModal(false); // Hide modal if already authenticated
    }else{
      setShowModal(true);
     
    }
  }, []);

  const handleLogout = () => {
    console.log("Logout button clicked"); // Add this line


    setIsAuthenticated(false);
    setShowModal(true); // Show the modal again after logout
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    router.push('/'); // Redirect to home page

  };

  return (
    <div className="relative min-h-screen bg-gray-200 flex flex-col items-center justify-center">
      

    {/* Display Dashboard only if authenticated */}
    {isAuthenticated ? (
      <Dashboard onLogout={ handleLogout} />
      ) : (
        <>

      {/* Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          
          <div className="bg-white p-12 rounded-lg shadow-lg relative z-60">
             {/* Add your image here */}
          <img
           src="igwebuikelogo.png" // Make sure to provide the correct path to your image
           alt="Description of image"
           className="w-60 h-auto rounded-lg mb-3" // Set width to 32, height auto
           />
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
          onClick={ handleLogout}
        >
          Logout
        </button>
      )}
     
    </div>
  );
}

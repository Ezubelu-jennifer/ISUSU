"use client"

import  Navbar  from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Mainlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar onLogout={function (): void {
        throw new Error("Function not implemented.");
      } } />
      <main className="relative flex flex-col flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Mainlayout
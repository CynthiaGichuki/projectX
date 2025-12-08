import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { BlockchainContext } from "../context/BlockchainContext";
import logo from "../assets/logo2.png";
import "../styles/navbar.css";
import { User, X, ShieldAlert } from "lucide-react"; 

const Navbar = () => {
  const { isRegistered, isAdmin, identity, getCredential, verifyAndLogin, loginAsAdmin } = useContext(BlockchainContext);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const handleCreateAccount = async () => {
    if (!nameInput) return alert("Please enter your name");
    await getCredential(nameInput);
    setActiveTab("login");
  };

  const handleLogin = async () => {
    await verifyAndLogin();
    setShowLoginModal(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="Project X Logo" className="logo-img" />
          </Link>

          <div className="navbar-buttons" style={{ gap: '15px' }}>
            <Link to="/projects" className="btn btn-secondary">Browse Projects</Link>
            
            {/* DISPLAY NAME HERE */}
            {isRegistered ? (
              <div className={`flex items-center gap-2 font-bold border px-3 py-2 rounded-lg ${isAdmin ? 'text-purple-400 border-purple-900 bg-purple-900/20' : 'text-green-400 border-green-900 bg-green-900/20'}`}>
                {isAdmin ? <ShieldAlert size={18}/> : <User size={18} />}
                <span>
                    {isAdmin ? "Admin Mode" : (identity?.credential?.name || localStorage.getItem("userName") || "Citizen")}
                </span>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="btn btn-primary">
                Log In / Sign Up
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* LOGIN POPUP */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111418] border border-gray-800 p-8 rounded-2xl w-[400px] shadow-2xl relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome to ProjectX</h2>

            <div className="flex mb-6 bg-gray-900 p-1 rounded-lg">
              <button onClick={() => setActiveTab("login")} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "login" ? "bg-[#f9b233] text-black" : "text-gray-400 hover:text-white"}`}>Log In</button>
              <button onClick={() => setActiveTab("create")} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "create" ? "bg-[#f9b233] text-black" : "text-gray-400 hover:text-white"}`}>Create Account</button>
            </div>

            {activeTab === "create" && (
              <div className="space-y-4">
                <input type="text" placeholder="Enter your Full Name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-[#f9b233] focus:outline-none"/>
                <button onClick={handleCreateAccount} className="w-full bg-[#f9b233] hover:bg-[#e48f12] text-black font-bold py-3 rounded-lg transition-colors">Issue Credential</button>
              </div>
            )}

            {activeTab === "login" && (
              <div className="space-y-4">
                {!identity ? (
                  <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm text-center">No credential found. Please create an account.</div>
                ) : (
                  <div className="p-4 bg-green-900/20 border border-green-900/50 rounded-lg text-green-200 text-sm">
                    <p><strong>Found Credential:</strong> {identity.credential.name}</p>
                  </div>
                )}
                <button onClick={handleLogin} disabled={!identity} className="w-full bg-[#f9b233] hover:bg-[#e48f12] disabled:opacity-50 text-black font-bold py-3 rounded-lg transition-colors">Present & Log In</button>
                
                {/* ADMIN SHORTCUT */}
                <div className="mt-4 pt-4 border-t border-gray-700 text-center">
                    <button onClick={loginAsAdmin} className="text-xs text-gray-500 hover:text-purple-400 underline">
                        Login as Administrator
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
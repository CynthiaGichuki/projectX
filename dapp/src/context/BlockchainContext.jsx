import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

export const BlockchainContext = createContext();

const SSI_SERVER_URL = "http://localhost:4000";
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // <--- PASTE NEW ADDRESS

const ADMIN_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const ABI = [
  "function submitProposal(string memory _ipfsHash) external",
  "function vote(uint256 _id) external",
  "function expertApprove(uint256 _id) external",
  "function rejectProposal(uint256 _id, string memory _reasonHash) external", // NEW
  "function startImplementation(uint256 _id) external",
  "function addMilestone(uint256 _id, string memory _evidenceIpfsHash) external",
  "function completeProject(uint256 _id) external",
  "function proposalCount() view returns (uint256)",
  "function getProposal(uint256 _id) view returns (tuple(uint256 id, address author, string ipfsHash, uint256 voteCount, uint8 status, string[] milestoneHashes, string rejectionHash))",
  "function isCitizen(address) view returns (bool)",
  "function isExpert(address) view returns (bool)",
  "function hasUserVoted(uint256 _id, address _user) view returns (bool)" // NEW
];

export const BlockchainProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [ipfs, setIpfs] = useState(null);
  const [proposals, setProposals] = useState([]);
  
  const [identity, setIdentity] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // 1. INITIAL SETUP
  useEffect(() => {
    const init = async () => {
      const { create } = await import('ipfs-http-client');
      setIpfs(create({ url: "http://127.0.0.1:5001" }));

      let key = localStorage.getItem("burnerKey");
      if (!key) {
        key = ethers.Wallet.createRandom().privateKey;
        localStorage.setItem("burnerKey", key);
      }

      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const signer = new ethers.Wallet(key, provider);
      const k = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      setWallet(signer);
      setContract(k);

      try {
        const citizen = await k.isCitizen(signer.address);
        const expert = await k.isExpert(signer.address);
        setIsRegistered(citizen);
        setIsAdmin(expert);
        
        loadProposals(k, signer.address); // Pass address to check votes

        const savedName = localStorage.getItem("userName");
        if(savedName && citizen) {
            setIdentity({ credential: { name: savedName } });
        }
      } catch (e) { console.log("Connection Error:", e); }
    };
    init();
  }, []);

  const loadProposals = async (ctx, userAddress) => {
    if(!ctx) return;
    const addr = userAddress || wallet?.address; // Ensure we have address
    try {
        const count = await ctx.proposalCount();
        let arr = [];
        for (let i = 1; i <= Number(count); i++) {
            const p = await ctx.getProposal(i);
            
            // Check if user voted
            let userVoted = false;
            if(addr) {
                userVoted = await ctx.hasUserVoted(p.id, addr);
            }

            const proposalPlain = {
                id: p.id,
                author: p.author,
                ipfsHash: p.ipfsHash,
                voteCount: p.voteCount,
                status: p.status,
                milestoneHashes: p.milestoneHashes,
                rejectionHash: p.rejectionHash,
                hasVoted: userVoted // Attach to object
            };

            // Fetch Metadata
            let metadata = { title: `Proposal #${p.id}`, description: "Loading...", image: null };
            try {
                const response = await fetch(`http://127.0.0.1:8080/ipfs/${p.ipfsHash}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.title) metadata = data;
                    else metadata.description = "Legacy proposal"; 
                }
            } catch (err) {}

            // Fetch Rejection Reason (if rejected)
            let rejectionReason = null;
            if (Number(p.status) === 5 && p.rejectionHash) {
                 try {
                    const rRes = await fetch(`http://127.0.0.1:8080/ipfs/${p.rejectionHash}`);
                    if(rRes.ok) {
                        const rData = await rRes.json();
                        rejectionReason = rData.reason;
                    }
                 } catch(e) {}
            }

            arr.push({ ...proposalPlain, ...metadata, rejectionReason });
        }
        setProposals(arr);
    } catch(e) { console.error("Error loading data:", e); }
  };

  const submitProposal = async (formData) => {
    if (!contract || !ipfs) return;
    try {
        const { title, topic, location, description, imageFile } = formData;
        let imageHash = null;
        if (imageFile) {
            const addedImage = await ipfs.add(imageFile);
            imageHash = addedImage.path;
        }
        const metadata = {
            title, topic, location, description,
            image: imageHash ? `http://127.0.0.1:8080/ipfs/${imageHash}` : null
        };
        const jsonString = JSON.stringify(metadata);
        const { path } = await ipfs.add(jsonString);

        // Check Frontend Duplicate (Optional optimization)
        if(proposals.some(p => p.ipfsHash === path)) return alert("Duplicate!");

        const tx = await contract.submitProposal(path);
        const receipt = await tx.wait();
        console.log("Total gas cost:" + receipt.cumulativeGasUsed);
        console.log("Total amount of blocks: " + receipt.blockNumber);

        loadProposals(contract, wallet.address);
        alert("Submitted!");
    } catch (e) { alert("Submission failed: " + (e.reason || e.message)); }
  };

  // NEW: Reject Project
  const rejectProject = async (id, reason) => {
    if (!contract || !ipfs) return;
    try {
        // Upload reason JSON to IPFS
        const data = JSON.stringify({ reason });
        const { path } = await ipfs.add(data);
        
        const tx = await contract.rejectProposal(id, path);
        await tx.wait();
        loadProposals(contract, wallet.address);
        alert("Proposal Rejected.");
    } catch(e) { alert("Error rejecting: " + e.reason); }
  };

  // ... (Keep existing identity functions unchanged) ...
  const getCredential = async (name) => {
    const res = await fetch(`${SSI_SERVER_URL}/issue-credential`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, did: `did:projectx:${wallet.address}` })
    });
    const data = await res.json();
    setIdentity(data);
    alert(`Credential Issued for ${data.credential.name}!`);
  };

  const verifyAndLogin = async () => {
    if (!identity) return alert("No Credential found!");
    const res = await fetch(`${SSI_SERVER_URL}/verify-and-register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        credential: identity.credential, 
        signature: identity.signature,
        walletAddress: wallet.address 
      })
    });
    const data = await res.json();
    if (data.success) {
      setIsRegistered(true);
      localStorage.setItem("userName", identity.credential.name);
      alert(`Welcome ${identity.credential.name}! You are now verified.`);
    } else {
      alert("Verification Failed: " + data.error);
    }
  };

  const loginAsAdmin = () => {
    if(confirm("Switch to Admin Mode?")) {
        localStorage.setItem("burnerKey", ADMIN_PRIVATE_KEY);
        localStorage.setItem("userName", "Government Admin");
        window.location.reload();
    }
  };

  const vote = async (id) => {
    try {
        const tx = await contract.vote(id);
        await tx.wait();
        loadProposals(contract, wallet.address);
    } catch(e) { alert(e.reason); }
  };

  const approveProposal = async (id) => {
    const tx = await contract.expertApprove(id);
    await tx.wait();
    loadProposals(contract, wallet.address);
  };

  const startProject = async (id) => {
    const tx = await contract.startImplementation(id);
    await tx.wait();
    loadProposals(contract, wallet.address);
  };

  const addMilestone = async (id, text) => {
    const { path } = await ipfs.add(text);
    const tx = await contract.addMilestone(id, path);
    await tx.wait();
    loadProposals(contract, wallet.address);
  };

  const finishProject = async (id) => {
    const tx = await contract.completeProject(id);
    await tx.wait();
    loadProposals(contract, wallet.address);
  };

  return (
    <BlockchainContext.Provider value={{ 
      wallet, isRegistered, isAdmin, identity, proposals, 
      getCredential, verifyAndLogin, loginAsAdmin,
      submitProposal, vote, approveProposal, startProject, addMilestone, finishProject, rejectProject 
    }}>
      {children}
    </BlockchainContext.Provider>
  );
};
import React, { useContext, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { BlockchainContext } from "../context/BlockchainContext";
import "../styles/projects.css";

export default function Projects() {
  const { 
    proposals, 
    isRegistered, 
    isAdmin, 
    submitProposal, 
    vote, 
    approveProposal, 
    rejectProject, 
    startProject, 
    addMilestone, 
    finishProject 
  } = useContext(BlockchainContext);

  // Form State
  const [form, setForm] = useState({
    title: "", topic: "", location: "", description: "", imageFile: null
  });

  const fileInputRef = useRef(null);

  const statusMap = ["Draft", "Expert Review", "Voting", "Approved", "Implementation", "Rejected", "Completed"];

  // --- STYLES ---
  const actionBtnStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    flex: 1, 
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, imageFile: e.target.files[0] });
    }
  };

  const handleSubmit = () => {
    if (!form.title || !form.description) return alert("Title and Description are required.");
    submitProposal(form);
    setForm({ title: "", topic: "", location: "", description: "", imageFile: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getRandomImage = (id) => {
    const images = ["/community_garden.jpg", "/lighting.jpg", "/school.jpg", "/youth_center.jpg", "/bridge.png"];
    return images[id % images.length];
  };

  const PLACEHOLDER_IMG = "/community_garden.jpg";

  return (
    <div className="projects-page">
      <Navbar />

      <div className="projects-header">
        <h1>Community Projects</h1>
        
        {isRegistered && (
          <div style={{marginTop: '20px', background: '#1a1d20', padding: '20px', borderRadius: '10px', border: '1px solid #333'}}>
            <h3 style={{marginBottom: '15px', color: '#f9b233'}}>Submit New Proposal</h3>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px'}}>
                <input className="input-field" placeholder="Project Title *" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                <input className="input-field" placeholder="Topic" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} />
                <input className="input-field" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                <input type="file" className="input-field" style={{padding: '7px'}} onChange={handleFileChange} ref={fileInputRef} />
            </div>
            <textarea className="input-field" placeholder="Description *" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{width: '100%', marginBottom: '10px'}} />
            <button className="btn btn-primary" onClick={handleSubmit} style={{width: '100%'}}>Submit Proposal</button>
          </div>
        )}
      </div>

      <div className="projects-grid">
        {proposals.length === 0 ? <p style={{textAlign:'center', color:'#888'}}>No proposals found.</p> : proposals.map((p) => (
            <div key={p.id} style={{marginBottom: '40px'}}>
              
              {/* BUTTONS & EVIDENCE NOW INSIDE THE CARD */}
              <ProjectCard 
                title={p.title} 
                votes={p.voteCount.toString()} 
                status={statusMap[p.status]} 
                description={p.description.substring(0, 100) + "..."}
                image={p.image || PLACEHOLDER_IMG}
                ipfsHash={p.ipfsHash}
              >
                  {/* 1. REJECTION REASON (Top Priority) */}
                  {Number(p.status) === 5 && (
                    <div style={{width:'100%', fontSize:'0.8rem', color:'#ef4444', background:'rgba(239,68,68,0.1)', padding:'8px', borderRadius:'6px', marginBottom:'8px'}}>
                        <strong>⛔ Rejected:</strong> {p.rejectionReason || "No reason given"}
                    </div>
                  )}

                  {/* 2. PROGRESS TRACKING (Visible to Everyone, moved UP) */}
                  {p.milestoneHashes && p.milestoneHashes.length > 0 && (
                    <div style={{width: '100%', marginBottom: '10px', padding: '10px', background: '#1a1d20', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #333'}}>
                      <strong style={{color: '#9ca3af', display:'block', marginBottom:'5px'}}>🚀 Progress Updates:</strong>
                      {p.milestoneHashes.map((hash, i) => (
                        <a key={i} href={`http://localhost:8080/ipfs/${hash}`} target="_blank" style={{display: 'block', color: '#f9b233', textDecoration: 'none', padding:'2px 0'}}>
                          📄 View Evidence #{i+1}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* 3. ADMIN: ADD EVIDENCE (Moved UP, right after evidence list) */}
                  {isAdmin && Number(p.status) === 4 && (
                     <button 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            const note = prompt("Enter evidence description:"); 
                            if(note) addMilestone(p.id, note); 
                        }} 
                        style={{...actionBtnStyle, background:'#333', color:'#ccc', border:'1px dashed #555', marginBottom: '8px', width: '100%', flex: 'none'}}
                     >
                        + Add Progress Evidence
                     </button>
                  )}

                  {/* 4. MAIN ACTION BUTTONS */}
                  <div style={{display: 'flex', gap: '8px', width: '100%'}}>
                      
                      {/* CITIZEN VOTE */}
                      {isRegistered && Number(p.status) === 2 && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); !p.hasVoted && vote(p.id); }} 
                            disabled={p.hasVoted}
                            style={{
                                ...actionBtnStyle, 
                                background: p.hasVoted ? '#333' : 'var(--gold)',
                                color: p.hasVoted ? '#888' : 'black',
                                cursor: p.hasVoted ? 'default' : 'pointer'
                            }}
                        >
                          {p.hasVoted ? "Already Voted" : "🗳️ Vote"}
                        </button>
                      )}

                      {/* ADMIN ACTIONS */}
                      {isAdmin && (
                        <>
                            {Number(p.status) === 1 && (
                                <>
                                    <button onClick={(e) => { e.stopPropagation(); approveProposal(p.id); }} style={{...actionBtnStyle, background: '#10b981', color: 'white'}}>✅ Approve</button>
                                    <button onClick={(e) => { e.stopPropagation(); const r = prompt("Reason?"); if(r) rejectProject(p.id, r); }} style={{...actionBtnStyle, background: '#ef4444', color: 'white'}}>⛔ Reject</button>
                                </>
                            )}
                            {Number(p.status) === 3 && (
                                <button onClick={(e) => { e.stopPropagation(); startProject(p.id); }} style={{...actionBtnStyle, background: '#f59e0b'}}>🏗️ Start Build</button>
                            )}
                            {Number(p.status) === 4 && (
                                <button onClick={(e) => { e.stopPropagation(); finishProject(p.id); }} style={{...actionBtnStyle, background: '#10b981', color:'white'}}>🏁 Complete Project</button>
                            )}
                        </>
                      )}
                  </div>

              </ProjectCard>
            </div>
          ))}
      </div>
    </div>
  );
}
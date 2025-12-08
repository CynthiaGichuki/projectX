import React from "react";
import "../styles/projectCard.css";

const ProjectCard = ({ title, votes, description, status, image, ipfsHash, children }) => {
  
  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (ipfsHash) {
      window.open(`http://127.0.0.1:8080/ipfs/${ipfsHash}`, "_blank");
    } else {
      alert("No IPFS details available.");
    }
  };

  return (
    <div className="project-card-wrapper">
      
      {/* 1. THE FLIPPING CARD (Info & Image) */}
      <div className="project-card-container">
        <div className="project-card-inner">

          {/* FRONT SIDE */}
          <div className="project-card front">
            <div>
              <h3 className="project-title">{title}</h3>
              <span className={`status ${status.toLowerCase().replace(" ", "-")}`} style={{marginTop: '8px', display: 'inline-block'}}>
                {status}
              </span>
              <p className="project-description" style={{marginTop: '12px'}}>
                {description}
              </p>
            </div>
            
            {/* Vote Count stays on the card */}
            <p className="project-votes" style={{marginTop: 'auto'}}>Votes: {votes}</p>
          </div>

          {/* BACK SIDE */}
          <div 
            className="project-card back" 
            onClick={handleViewDetails}
            style={{ cursor: "pointer" }}
            title="Click to view IPFS JSON"
          >
            <img src={image} alt={title} className="project-image" />
            <div className="image-overlay">
              <h3>{title}</h3>
              <p style={{ textDecoration: 'underline', color: '#f9b233' }}>
                Click to view details ↗
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. THE BUTTONS (Static, below the card) */}
      <div className="card-actions-external">
        {children}
      </div>

    </div>
  );
};

export default ProjectCard;
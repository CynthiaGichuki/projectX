import React from "react";
import "../styles/projectCard.css";

const ProjectCard = ({ title, votes, description, status, image }) => {
  return (
    <div className="project-card-container">
      <div className="project-card-inner">

        {/* FRONT SIDE */}
        <div className="project-card front">
          <h3 className="project-title">{title}</h3>
          <p className="project-description">{description}</p>

          <span className={`status ${status.toLowerCase().replace(" ", "-")}`}>
            {status}
          </span>

          <p className="project-votes">Votes: {votes}</p>
        </div>

        {/* BACK SIDE */}
        <div className="project-card back">
          <img src={image} alt={title} className="project-image" />

          <div className="image-overlay">
            <h3>{title}</h3>
            <p>Click to view details</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectCard;

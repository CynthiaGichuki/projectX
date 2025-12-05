import React from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import "../styles/projects.css";

const projects = [
  { id: 1, title: "Community Garden", votes: 12, status: "Approved", image: "/community_garden.jpg" },
  { id: 2, title: "Road Lighting Phase 1", votes: 19, status: "Pending", image: "/lighting.jpg" },
  { id: 3, title: "School Renovation", votes: 8, status: "In Review", image: "/school.jpg" },
  { id: 4, title: "Youth Sports Center", votes: 25, status: "Approved", image: "/youth_center.jpg" },
  { id: 5, title: "Water Borehole", votes: 14, status: "Rejected", image },
  { id: 6, title: "Bridge Repair", votes: 11, status: "Pending", image: "/bridge.png" },
];

export default function Projects() {
  return (
    <div className="projects-page">
      <Navbar />

      <div className="projects-header">
        <h1>All Projects</h1>
        <p className="subtitle">
          Explore all community proposals, votes, and funding progress.
        </p>
      </div>

      <div className="projects-grid">
        {projects.map((p) => (
          <ProjectCard key={p.id} title={p.title} votes={p.votes} status={p.status} image={p.image}/>
        ))}
      </div>
    </div>
  );
}

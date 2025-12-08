import React from "react";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import ProjectCard from "../components/ProjectCard";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-wrapper">
      
      <Navbar />
      <div className="carousel-section">
        <Carousel />
      </div>

      {/* Main content */}
      <div className="home-container">
        <h2 className="section-title">Top Proposals</h2>
        <div className="project-grid">
          <ProjectCard title="Community Garden" description="This is the description of the project" votes={12} status={"Approved"} image={ "/community_garden.jpg"} />
          <ProjectCard title="Road Lighting Phase 1" description="This is the description of the project" votes={19} status={"Pending"} image={"/lighting.jpg"}/>
          <ProjectCard title="School Renovation" description="This is the description of the project" votes={8} status={"Rejected"} image={"/school.jpg"}/>
        </div>

      </div>
    </div>
  );
};

export default Home;

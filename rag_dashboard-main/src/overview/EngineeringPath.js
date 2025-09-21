import React from 'react';
import { Link } from 'react-router-dom';
import './Paths.css';

const EngineeringPath = () => {
  return (
    <div className="path-container">
      <Link to="/" className="back-link">← Back to Overview</Link>
      <h1 className="path-title">
        <span className="path-icon">⚛️</span>
        Career Paths in the Non-Medical Stream (Engineering)
      </h1>
      <p className="path-intro">
        Success in the IIT-JEE opens doors to a vast range of engineering disciplines, each offering unique challenges and opportunities to innovate.
      </p>

      <div className="path-grid">
        <div className="path-card">
          <h3>Computer Science Engineering</h3>
          <p>Focuses on software development, algorithms, AI, and data science. The most in-demand branch globally.</p>
        </div>
        <div className="path-card">
          <h3>Mechanical Engineering</h3>
          <p>A core branch dealing with the design, construction, and use of machines. It's vital for manufacturing, automotive, and aerospace industries.</p>
        </div>
        <div className="path-card">
          <h3>Civil Engineering</h3>
          <p>Involves the design and construction of public and private works, such as infrastructure, bridges, dams, and buildings.</p>
        </div>
        <div className="path-card">
          <h3>Electrical Engineering</h3>
          <p>Deals with the study and application of electricity, electronics, and electromagnetism. Essential for power systems and electronics.</p>
        </div>
        <div className="path-card">
          <h3>Chemical Engineering</h3>
          <p>Focuses on designing processes to produce, transform, and transport materials, crucial for pharmaceuticals, energy, and manufacturing.</p>
        </div>
        <div className="path-card">
          <h3>Aerospace Engineering</h3>
          <p>The primary field of engineering concerned with the development of aircraft and spacecraft.</p>
        </div>
      </div>
    </div>
  );
};

export default EngineeringPath;
import React from 'react';
import { Link } from 'react-router-dom';
import './Paths.css';

const MedicalPath = () => {
  return (
    <div className="path-container">
      <Link to="/" className="back-link">← Back to Overview</Link>
      <h1 className="path-title">
        <span className="path-icon">🩺</span>
        Career Paths in the Medical Stream
      </h1>
      <p className="path-intro">
        After clearing the NEET exam, students can pursue a variety of respected and rewarding careers in the healthcare sector. Here are some of the most prominent options.
      </p>

      <div className="path-grid">
        <div className="path-card">
          <h3>MBBS (Bachelor of Medicine, Bachelor of Surgery)</h3>
          <p>The premier degree for becoming a medical doctor, focusing on diagnosing and treating illnesses. It's a 5.5-year course including a one-year internship.</p>
        </div>
        <div className="path-card">
          <h3>BDS (Bachelor of Dental Surgery)</h3>
          <p>Focuses on dental health, including the diagnosis, prevention, and treatment of diseases of the teeth, gums, and mouth. A 5-year course.</p>
        </div>
        <div className="path-card">
          <h3>B.Pharmacy (Bachelor of Pharmacy)</h3>
          <p>The study of preparing and dispensing drugs. Pharmacists are crucial to the healthcare system and can work in research, production, or at pharmacies.</p>
        </div>
        <div className="path-card">
          <h3>BAMS (Bachelor of Ayurvedic Medicine and Surgery)</h3>
          <p>An integrated degree focused on the traditional Indian system of Ayurveda, combined with modern medical principles.</p>
        </div>
        <div className="path-card">
          <h3>BHMS (Bachelor of Homeopathic Medicine and Surgery)</h3>
          <p>Focuses on the homeopathic system of medicine, which is based on the principle of "like cures like."</p>
        </div>
        <div className="path-card">
          <h3>B.Sc. Nursing</h3>
          <p>A foundational degree for a career in nursing, preparing professionals for patient care in various healthcare settings.</p>
        </div>
      </div>
    </div>
  );
};

export default MedicalPath;
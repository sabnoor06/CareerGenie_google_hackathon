import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './overview.css';
import TopNav from '../Dashboard/Top_nav/Top_nav';
import MedicalPath from './MedicalPath';
import EngineeringPath from './EngineeringPath';
import logo from '../assets/logo.png'; // <-- ADDED: Import the logo

const Overview = () => {
    const navigate = useNavigate();

    const [marketData, setMarketData] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                const response = await fetch('http://localhost:8080/market-insights');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMarketData(data);
            } catch (err) {
                setError('Failed to load market data. Please try again later.');
                console.error("Fetch error:", err);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchMarketData();
    }, []);

    return (
        <div className="overview-container">

        {/* --- ADDED BRAND HEADER --- */}
        <div className="brand-header">
            <img src={logo} alt="CareerGenie Logo" className="brand-logo" />
            <h1 className="brand-name">CareerGenie</h1>
        </div>

        <div className="hero-section">
            {/* The centered logo has been removed from here */}
            <h1 className="hero-headline">
                Build Your Roadmap to a <span className="highlight-text">Top Tech</span> Career
            </h1>
            <p className="hero-subheading">
                A career is a long-term journey of learning, growth, and achievement.
                Our AI Career Advisor transforms your personal skills and ambitions into a clear, actionable plan for success.
                We analyze your profile, recommend courses to bridge skill gaps, and help you target the perfect job at your dream company.
            </p>
            <button className="cta-button" onClick={() => navigate('/GenAI')}>Click here to get started</button>
        </div>

        {/* The rest of your component remains unchanged... */}
        <div className="features-section">
            <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Skill Gap Analysis</h3>
                <p>Instantly see the skills you have vs. the skills required for your desired role. Click on Above Button to learn more</p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">🗺️</div>
                <h3>Personalized Roadmap</h3>
                <p>Get a step-by-step career track, with course recommendations to level up. Click on Above Button to learn more</p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Targeted Job Matches</h3>
                <p>Find job openings that perfectly match your unique skills and career stage. Click on Above Button to learn more</p>
            </div>
        </div>

        <div className="market-insights-section">
            <h2>Real-Time Job Market Insights</h2>
            {isLoadingData ? (
                <p className="loading-text">Loading market data...</p>
            ) : error ? (
                <p className="error-text">{error}</p>
            ) : (
                <div className="insights-grid">
                    <div className="insight-card trending">
                        <div className="insight-icon"><i className="fa-solid fa-arrow-trend-up"></i></div>
                        <h3 className="insight-title">Top Trending Roles</h3>
                        <ul className="insight-list">
                            {marketData.trendingRoles.map(role => <li key={role}>{role}</li>)}
                        </ul>
                    </div>
                    <div className="insight-card declining">
                        <div className="insight-icon"><i className="fa-solid fa-arrow-trend-down"></i></div>
                        <h3 className="insight-title">Declining Roles</h3>
                        <ul className="insight-list">
                            {marketData.decliningRoles.map(role => <li key={role}>{role}</li>)}
                        </ul>
                    </div>
                    <div className="insight-card salaries">
                        <div className="insight-icon"><i className="fa-solid fa-dollar-sign"></i></div>
                        <h3 className="insight-title">Average Salaries</h3>
                        <ul className="insight-list">
                            {Object.entries(marketData.averageSalaries).map(([role, salary]) => (
                                <li key={role}><strong>{role}:</strong> {salary}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="insight-card remote">
                        <div className="insight-icon"><i className="fa-solid fa-house-laptop"></i></div>
                        <h3 className="insight-title">Remote Opportunities</h3>
                        <p className="insight-data">{marketData.remoteOpportunities}</p>
                        <p className="insight-subtext">of tech roles listed are remote</p>
                    </div>
                </div>
            )}
        </div>

        <div className="companies-section">
            <h2>Land Your Dream Job at Industry-Leading Companies</h2>
            <p>Our platform prepares you for interviews and roles at the world's most innovative companies, including:</p>
            <div className="logos-container">
                <div className="logos-slide">
                    <div className="company-logo google-color"><i className="fa-brands fa-google"></i> Google</div>
                    <div className="company-logo microsoft-color"><i className="fa-brands fa-microsoft"></i> Microsoft</div>
                    <div className="company-logo apple-color"><i className="fa-brands fa-apple"></i> Apple</div>
                    <div className="company-logo meta-color"><i className="fa-brands fa-meta"></i> Meta</div>
                    <div className="company-logo oracle-color"><i className="fa-brands fa-oracle"></i> Oracle</div>
                    <div className="company-logo amazon-color"><i className="fa-brands fa-amazon"></i> Amazon</div>
                </div>
                <div className="logos-slide">
                    <div className="company-logo google-color"><i className="fa-brands fa-google"></i> Google</div>
                    <div className="company-logo microsoft-color"><i className="fa-brands fa-microsoft"></i> Microsoft</div>
                    <div className="company-logo apple-color"><i className="fa-brands fa-apple"></i> Apple</div>
                    <div className="company-logo meta-color"><i className="fa-brands fa-meta"></i> Meta</div>
                    <div className="company-logo oracle-color"><i className="fa-brands fa-oracle"></i> Oracle</div>
                    <div className="company-logo amazon-color"><i className="fa-brands fa-amazon"></i> Amazon</div>
                </div>
            </div>
        </div>

        <div className="career-links-section">
            <h2>Explore Opportunities Directly</h2>
            <p>Understand what makes each company a unique and rewarding place to build your career.</p>
            <div className="career-grid">
                <div className="company-card google-color">
                    <h3><i className="fa-brands fa-google"></i> Google</h3>
                    <p>Work on products used by billions of people daily. A career at Google offers a chance to tackle massive-scale challenges in Search, Cloud, and AI, fostering a culture of innovation and data-driven solutions.</p>
                    <a href="https://careers.google.com/" target="_blank" rel="noopener noreferrer" className="company-card-link">Visit Careers</a>
                </div>
                <div className="company-card microsoft-color">
                    <h3><i className="fa-brands fa-microsoft"></i> Microsoft</h3>
                    <p>Impact millions of businesses and consumers through a diverse ecosystem from Azure cloud to Xbox. Microsoft is ideal for those wanting to solve complex enterprise problems and drive digital transformation globally.</p>
                    <a href="https://careers.microsoft.com/" target="_blank" rel="noopener noreferrer" className="company-card-link">Visit Careers</a>
                </div>
                <div className="company-card apple-color">
                    <h3><i className="fa-brands fa-apple"></i> Apple</h3>
                    <p>Join a team obsessed with creating perfectly integrated hardware and software that defines industries. A career here is for those passionate about product excellence, design, and user experience.</p>
                    <a href="https://www.apple.com/careers/in/" target="_blank" rel="noopener noreferrer" className="company-card-link">Visit Careers</a>
                </div>
                <div className="company-card meta-color">
                    <h3><i className="fa-brands fa-meta"></i> Meta</h3>
                    <p>Build the future of social connection and the metaverse. At Meta, you can work on cutting-edge AI research and platforms like Facebook and Instagram that connect a significant portion of the world's population.</p>
                    <a href="https://www.metacareers.com/" target="_blank" rel="noopener noreferrer" className="company-card-link">Visit Careers</a>
                </div>
                <div className="company-card oracle-color">
                    <h3><i className="fa-brands fa-oracle"></i> Oracle</h3>
                    <p>Power the world's most important enterprises with mission-critical database and cloud infrastructure solutions. A career at Oracle provides deep expertise in the foundational tech that businesses rely on.</p>
                    <a href="https://www.oracle.com/careers/" target="_blank" rel="noopener noreferrer" className="company-card-link">Visit Careers</a>
                </div>
                <div className="company-card amazon-color">
                    <h3><i className="fa-brands fa-amazon"></i> Amazon</h3>
                    <p>Innovate at the intersection of e-commerce, cloud computing with AWS, and global logistics. Amazon's "Day 1" culture is perfect for builders who thrive on customer obsession and operational excellence at scale.</p>
                    <a href="https://www.amazon.jobs/" target="_blank" rel="noopener noreferrer" className="company-card-link">Visit Careers</a>
                </div>
            </div>
        </div>
        <div className="student-guidance-section">
            <h2>Starting Your Journey? Guidance for Students</h2>
            <p className="student-subheading">
                We provide tailored roadmaps for India's top competitive exams. Explore paths, find resources, and connect with leading learning platforms.
            </p>
            <div className="guidance-grid">
                <div className="guidance-card medical">
                    <div className="guidance-icon">🩺</div>
                    <h3>Medical Stream (NEET)</h3>
                    <p>
                        Your complete guide to cracking the NEET exam. Get help with study plans and subject strategies to secure your place in a leading medical college. We recommend top resources from platforms like <strong>Physics Wallah</strong> and <strong>Unacademy</strong>.
                    </p>
                    <button className="guidance-button" onClick={() => navigate('/medical-path')}>
                        Explore Medical Path
                    </button>
                </div>
                <div className="guidance-card engineering">
                    <div className="guidance-icon">⚛️</div>
                    <h3>Non-Medical Stream (IIT-JEE)</h3>
                    <p>
                        Navigate the path to India's elite engineering institutes. Get personalized guidance for JEE Mains & Advanced and leverage coaching from experts at <strong>Unacademy</strong> and <strong>Physics Wallah</strong>.
                    </p>
                    <button className="guidance-button" onClick={() => navigate('/engineering-path')}>
                        Explore Engineering Path
                    </button>
                </div>
            </div>
        </div>
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-credit">
                    <p>&copy; 2025 CareerGenie. Developed by Yawar Altaf & Sabnoor Fatima.</p>
                </div>
                <div className="footer-links">
                <h4>About Us</h4>
                <ul>
                    <li>
                    <a href="https://www.linkedin.com/in/yawar-altaf-84aa1b264/" target="_blank" rel="noopener noreferrer">
                        Yawar Altaf's LinkedIn
                    </a>
                    </li>
                    <li>
                    <a href="https://www.linkedin.com/in/sabnoor-fatima-4ab6a724b/" target="_blank" rel="noopener noreferrer">
                        Sabnoor Fatima's LinkedIn
                    </a>
                    </li>
                </ul>
                </div>
            </div>
        </footer>
        <TopNav />
        
    </div>
    );
};

export default Overview;
import React, { useState, useEffect, useCallback } from "react";

const initialProjects = [
  {
    id: 1,
    title: "ShopHub E-Commerce",
    shortDesc: "Production-ready MERN eCommerce platform with secure authentication and payment processing.",
    description: "Production-ready MERN eCommerce platform featuring JWT authentication, Razorpay payment gateway, admin analytics dashboard, Cloudinary media storage, invoice generation, and secure REST APIs.",
    problemSolved: "Modern online retail requires a secure, scalable, and intuitive platform. This project addresses key eCommerce challenges including user session security, real-time payment processing, order management, and admin analytics.",
    keyFeatures: [
      "JWT Authentication with role-based access",
      "Razorpay Payment Gateway Integration",
      "Admin Dashboard with analytics",
      "Cloudinary Image Upload & Management",
      "Order Tracking System",
      "Invoice Generation (PDF)",
      "Product Search & Filters"
    ],
    architecture: {
      frontend: "React 18 with Context API",
      backend: "Node.js + Express.js",
      database: "MongoDB with Mongoose ODM",
      deployment: "Vercel (Frontend) + Render (Backend)"
    },
    challenges: [
      "Secure JWT token storage and refresh mechanism",
      "Razorpay webhook verification for payment confirmation",
      "Optimizing MongoDB aggregation pipelines for admin analytics",
      "Handling concurrent order updates with Mongoose transactions"
    ],
    learnings: [
      "Full-stack MERN architecture patterns",
      "REST API design best practices",
      "MongoDB schema design and indexing",
      "Payment gateway integration security",
      "Production deployment strategies"
    ],
    techStack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Razorpay", "Cloudinary", "Mongoose"],
    liveDemo: "https://shophub-frontend-azure.vercel.app/",
    github: "https://github.com/ArbazCod/shophub-ecommerce",
    image: "/images/shophub.png",
    featured: true,
    views: 128,
    likes: 24
  },
  {
    id: 2,
    title: "SmartCart Customer Segmentation",
    shortDesc: "ML-powered customer segmentation dashboard using unsupervised learning.",
    description: "Advanced customer segmentation dashboard using Unsupervised Machine Learning, PCA, and K-Means Clustering to identify customer groups and generate actionable business insights through interactive visualizations.",
    problemSolved: "Businesses struggle to understand customer behavior patterns. This solution automatically segments customers into meaningful groups, enabling targeted marketing campaigns and personalized recommendations without manual analysis.",
    keyFeatures: [
      "K-Means Clustering for customer grouping",
      "PCA Dimensionality Reduction visualization",
      "Interactive 2D/3D cluster visualizations",
      "Customer profile analysis",
      "Actionable business insights generation",
      "CSV data upload support"
    ],
    architecture: {
      frontend: "Streamlit",
      backend: "Python + Scikit-Learn",
      dataProcessing: "Pandas + NumPy",
      visualization: "Plotly + Matplotlib"
    },
    challenges: [
      "Determining optimal K value using elbow method and silhouette score",
      "Handling high-dimensional customer data with PCA",
      "Making cluster interpretations business-friendly",
      "Performance optimization for large datasets"
    ],
    learnings: [
      "Unsupervised learning algorithms in production",
      "Data preprocessing and feature scaling",
      "Dimensionality reduction techniques",
      "Interactive dashboard development with Streamlit",
      "Translating technical clusters to business insights"
    ],
    techStack: ["Python", "Streamlit", "Scikit-Learn", "Pandas", "NumPy", "Plotly", "PCA", "KMeans"],
    liveDemo: "https://smartcart-customer-segmentation.streamlit.app/",
    github: "https://github.com/ArbazCod/smartcart-customer-segmentation",
    image: "/images/smartcart.png",
    featured: true,
    views: 89,
    likes: 17
  },
  {
    id: 3,
    title: "InsightBank Analytics",
    shortDesc: "Enterprise banking analytics platform with ML-driven insights.",
    description: "Enterprise banking analytics platform using Python, SQL, Streamlit, Plotly, and Machine Learning to generate customer insights, transaction analysis, KPI dashboards, and business intelligence reports.",
    problemSolved: "Financial institutions need real-time analytics on customer transactions, risk assessment, and performance metrics. This platform consolidates multiple data sources into actionable dashboards for data-driven decision making.",
    keyFeatures: [
      "Customer transaction analytics",
      "KPI dashboard with real-time metrics",
      "Risk assessment models",
      "Revenue trend forecasting",
      "Automated BI report generation",
      "SQL query builder for analysts"
    ],
    architecture: {
      frontend: "Streamlit",
      backend: "Python + SQLAlchemy",
      database: "PostgreSQL",
      analytics: "Pandas + Scikit-Learn"
    },
    challenges: [
      "Processing millions of transaction records efficiently",
      "Implementing real-time data aggregation",
      "Securing sensitive financial data",
      "Creating responsive dashboards with large datasets"
    ],
    learnings: [
      "Financial data processing and compliance",
      "SQL optimization for analytical queries",
      "Building interactive BI tools",
      "Time series forecasting techniques",
      "Enterprise dashboard design patterns"
    ],
    techStack: ["Python", "SQL", "Streamlit", "Plotly", "Scikit-Learn", "Pandas", "PostgreSQL"],
    liveDemo: "https://insightbank-analytics.streamlit.app/",
    github: "https://github.com/ArbazCod/InsightBank-Analytics",
    image: "/images/insightbank.png",
    featured: true,
    views: 67,
    likes: 12
  },
  {
    id: 4,
    title: "HealthRisk Predictor",
    shortDesc: "AI-powered healthcare risk prediction system.",
    description: "AI-powered healthcare risk prediction system using supervised machine learning to analyze patient health data and predict potential risk levels through interactive dashboards.",
    problemSolved: "Early detection of health risks can save lives. This system analyzes patient data to predict risk levels for chronic diseases, enabling proactive healthcare interventions and personalized wellness plans.",
    keyFeatures: [
      "Disease risk prediction models",
      "Patient health data analysis",
      "Interactive risk factor exploration",
      "Personalized health recommendations",
      "Medical history integration",
      "Risk trend visualization"
    ],
    architecture: {
      frontend: "Streamlit",
      backend: "Python + Scikit-Learn",
      models: "Random Forest + XGBoost",
      visualization: "Plotly"
    },
    challenges: [
      "Handling missing medical data gracefully",
      "Balancing model sensitivity vs specificity",
      "Ensuring HIPAA-compliant data handling",
      "Explaining model predictions to non-technical users"
    ],
    learnings: [
      "Healthcare ML model development",
      "Medical data preprocessing techniques",
      "Model interpretability with SHAP values",
      "Building trust in AI healthcare tools",
      "Regulatory considerations for health tech"
    ],
    techStack: ["Python", "Scikit-Learn", "XGBoost", "Pandas", "NumPy", "Streamlit", "Plotly"],
    liveDemo: "https://healthrisk-predictor.streamlit.app/",
    github: "https://github.com/ArbazCod/HealthRisk-Predictor",
    image: "/images/healthrisk.png",
    featured: false,
    views: 45,
    likes: 9
  },
  {
    id: 5,
    title: "Portfolio & Blogging Platform",
    shortDesc: "Full-stack CMS with authentication and SEO optimization.",
    description: "Full-stack portfolio and blogging platform featuring secure authentication, admin dashboard, blog management, SEO optimization, user dashboard, contact system, and responsive design.",
    problemSolved: "Creators and developers need a professional platform to showcase work and share knowledge. This CMS provides an all-in-one solution with blog management, project showcase, and user engagement features without vendor lock-in.",
    keyFeatures: [
      "JWT Authentication & Authorization",
      "Admin Dashboard with analytics",
      "Markdown blog post editor",
      "SEO meta tag management",
      "User comments & engagement",
      "Contact form with email integration",
      "Responsive design for all devices"
    ],
    architecture: {
      frontend: "React 18 + Tailwind CSS",
      backend: "Node.js + Express",
      database: "MongoDB",
      caching: "Redis"
    },
    challenges: [
      "Implementing secure JWT refresh flow",
      "Optimizing blog post SEO dynamically",
      "Building a WYSIWYG-like markdown editor",
      "Managing rate limiting for contact forms"
    ],
    learnings: [
      "Full-stack authentication patterns",
      "SEO optimization techniques for SPAs",
      "Content management system architecture",
      "Email service integration",
      "Building reusable React components"
    ],
    techStack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Tailwind CSS", "Redis"],
    liveDemo: "https://your-portfolio.com",
    github: "https://github.com/yourusername/portfolio-platform",
    image: "/images/portfolio.png",
    featured: true,
    views: 156,
    likes: 31
  },
  {
    id: 7,
    type: "certificate",
    title: "Delta – Full Stack Web Development",
    shortDesc: "MERN Stack Web Development Certification from Apna College.",
    description: "Successfully completed the Delta Full Stack Web Development program from Apna College. Acquired practical experience building full-stack web applications using React, Node.js, Express.js, and MongoDB while implementing authentication, REST APIs, and deployment workflows.",
    problemSolved: "Completed intensive training focused on modern web development, software engineering best practices, frontend and backend integration, database management, and production-ready application development.",
    keyFeatures: [
      "HTML5 & CSS3",
      "JavaScript (ES6+)",
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST API Development",
      "JWT Authentication"
    ],
    architecture: {
      frontend: "React.js",
      backend: "Node.js + Express.js",
      database: "MongoDB",
      deployment: "GitHub & Deployment Workflows"
    },
    challenges: [
      "Building complete full-stack applications",
      "Implementing secure authentication systems",
      "Designing RESTful APIs",
      "Database integration and management"
    ],
    learnings: [
      "Full Stack Application Architecture",
      "Frontend & Backend Integration",
      "Authentication & Authorization",
      "Database Modeling",
      "API Development",
      "Deployment Strategies"
    ],
    techStack: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js", "MongoDB", "JWT", "Git", "GitHub"],
    image: "/delta-certificate.png",
    featured: true,
    views: 0,
    likes: 0
  }
];

// Advanced localStorage management with user-specific data
const STORAGE_KEYS = {
  PROJECT_STATS: 'projectStats',
  USER_LIKES: 'userLikes',
  USER_ID: 'userId'
};

const getUserId = () => {
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
  return userId;
};

const loadProjectData = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.PROJECT_STATS);
  if (saved) {
    const stats = JSON.parse(saved);
    return initialProjects.map(project => ({
      ...project,
      views: stats[project.id]?.views || project.views,
      likes: stats[project.id]?.likes || project.likes
    }));
  }
  return initialProjects;
};

const saveProjectStats = (projects) => {
  const stats = {};
  projects.forEach(project => {
    stats[project.id] = { views: project.views, likes: project.likes };
  });
  localStorage.setItem(STORAGE_KEYS.PROJECT_STATS, JSON.stringify(stats));
};

const getUserLikes = () => {
  const userId = getUserId();
  const likes = localStorage.getItem(`${STORAGE_KEYS.USER_LIKES}_${userId}`);
  return likes ? new Set(JSON.parse(likes)) : new Set();
};

const saveUserLikes = (likedSet) => {
  const userId = getUserId();
  localStorage.setItem(`${STORAGE_KEYS.USER_LIKES}_${userId}`, JSON.stringify([...likedSet]));
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likedProjects, setLikedProjects] = useState(new Set());
  const [animatingLike, setAnimatingLike] = useState(null);

  useEffect(() => {
    const loadData = () => {
      const loadedProjects = loadProjectData();
      const userLikes = getUserLikes();
      setProjects(loadedProjects);
      setLikedProjects(userLikes);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const updateProjectStats = useCallback((projectId, type, delta) => {
    setProjects(prevProjects => {
      const updated = prevProjects.map(project => {
        if (project.id === projectId) {
          if (type === 'view') {
            return { ...project, views: project.views + 1 };
          }
          if (type === 'like') {
            return { ...project, likes: Math.max(0, project.likes + delta) };
          }
        }
        return project;
      });
      saveProjectStats(updated);
      return updated;
    });
  }, []);

  const handleLike = useCallback((e, projectId) => {
    e.stopPropagation();
    
    const isLiked = likedProjects.has(projectId);
    const delta = isLiked ? -1 : 1;
    
    setLikedProjects(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      saveUserLikes(newSet);
      return newSet;
    });
    
    updateProjectStats(projectId, 'like', delta);
    
    setAnimatingLike(projectId);
    setTimeout(() => setAnimatingLike(null), 300);
  }, [likedProjects, updateProjectStats]);

  const handleProjectClick = useCallback((project) => {
    updateProjectStats(project.id, 'view', 0);
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, [updateProjectStats]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen, closeModal]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading projects...</p>
        <style>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
            color: white;
            font-family: 'Inter', sans-serif;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(167, 139, 250, 0.3);
            border-top-color: #a78bfa;
            border-radius: 50%;
            animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="bg-gradient" />
      <div className="content-wrapper">
        {/* Header Section */}
        <div className="header-section">
          <div className="badge">
            <span className="badge-dot"></span>
            Project Showcase
          </div>
          <h1 className="main-title">
            Building <span className="gradient-text">Real Solutions</span>
          </h1>
          <p className="subtitle">
            Full-Stack Development, Machine Learning, and Data Analytics projects built to solve real-world problems.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`project-card ${project.featured ? "featured" : ""} ${animatingLike === project.id ? 'like-animation' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleProjectClick(project)}
            >
              <div className="card-glow" />
              
              <div className="card-image">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x220?text=Project+Preview";
                  }}
                />
                {project.featured && (
                  <span className="featured-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Featured
                  </span>
                )}
              </div>

              <div className="card-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.shortDesc}</p>
                
                <div className="tech-stack">
                  {project.techStack.slice(0, 4).map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="tech-tag more-tag">+{project.techStack.length - 4}</span>
                  )}
                </div>

                <div className="stats-row">
                  <div className="stat">
                    <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>{project.views.toLocaleString()}</span>
                  </div>
                  <button 
                    className={`like-btn ${likedProjects.has(project.id) ? 'liked' : ''}`}
                    onClick={(e) => handleLike(e, project.id)}
                    aria-label={likedProjects.has(project.id) ? "Unlike" : "Like"}
                  >
                    <div className="heart-container">
                      <svg 
                        className={`heart-icon ${likedProjects.has(project.id) ? 'heart-active' : ''}`}
                        viewBox="0 0 24 24" 
                        fill={likedProjects.has(project.id) ? "currentColor" : "none"} 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <span className="like-count">{project.likes}</span>
                    </div>
                  </button>
                </div>

                <div className="card-footer">
                  <div className="button-group">
                    {project.type === "certificate" ? (
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectClick(project);
                        }}
                      >
                        View Certificate
                      </button>
                    ) : (
                      <>
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          Live Demo
                        </a>

                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13" />
                          </svg>
                          GitHub
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="footer-note">
          <p>
            <span className="footer-icon">✨</span> 
            Click any project card for detailed case study 
            <span className="footer-divider">•</span> 
            <span className="footer-heart">❤️</span> Toggle likes on any project
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedProject && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close modal">
              ×
            </button>
            
            <div className="modal-header">
              <img src={selectedProject.image} alt={selectedProject.title} className="modal-image" />
              <div className="modal-header-info">
                <h2>{selectedProject.title}</h2>
                <p className="modal-short-desc">{selectedProject.shortDesc}</p>
                <div className="modal-stats">
                  <span className="modal-stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {selectedProject.views.toLocaleString()} Views
                  </span>
                  <button 
                    className={`modal-like-btn ${likedProjects.has(selectedProject.id) ? 'liked' : ''}`}
                    onClick={(e) => handleLike(e, selectedProject.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={likedProjects.has(selectedProject.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {selectedProject.likes} Likes
                  </button>
                </div>
              </div>
            </div>

            {selectedProject.type === "certificate" && (
              <div style={{ padding: "20px" }}>
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    objectFit: "contain"
                  }}
                />
              </div>
            )}

            <div className="modal-body">
              <section>
                <h3>📌 Overview</h3>
                <p>{selectedProject.description}</p>
              </section>

              <section>
                <h3>🎯 Problem Solved</h3>
                <p>{selectedProject.problemSolved}</p>
              </section>

              <section>
                <h3>✨ Key Features</h3>
                <ul className="feature-list">
                  {selectedProject.keyFeatures.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3>🏗️ Architecture</h3>
                <ul className="architecture-list">
                  <li><strong>Frontend:</strong> {selectedProject.architecture.frontend}</li>
                  <li><strong>Backend:</strong> {selectedProject.architecture.backend}</li>
                  <li><strong>Database:</strong> {selectedProject.architecture.database}</li>
                  {selectedProject.architecture.deployment && (
                    <li><strong>Deployment:</strong> {selectedProject.architecture.deployment}</li>
                  )}
                </ul>
              </section>

              <section>
                <h3>⚠️ Challenges Faced</h3>
                <ul>
                  {selectedProject.challenges.map((challenge, i) => (
                    <li key={i}>{challenge}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3>📚 What I Learned</h3>
                <ul>
                  {selectedProject.learnings.map((learning, i) => (
                    <li key={i}>{learning}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3>🛠️ Tech Stack</h3>
                <div className="modal-tech-stack">
                  {selectedProject.techStack.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </section>
            </div>

            {selectedProject.type !== "certificate" && (
              <div className="modal-footer">
                <a href={selectedProject.liveDemo} target="_blank" rel="noreferrer" className="btn btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Live Demo
                </a>
                <a href={selectedProject.github} target="_blank" rel="noreferrer" className="btn btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13" />
                  </svg>
                  GitHub Repository
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .projects-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .bg-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 40px;
          position: relative;
          z-index: 2;
        }

        .header-section {
          text-align: center;
          margin-bottom: 70px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          color: #a78bfa;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: #a78bfa;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .main-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          color: white;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb923c 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .subtitle {
          font-size: clamp(1rem, 3vw, 1.2rem);
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 32px;
          margin-bottom: 60px;
        }

        @media (max-width: 768px) {
          .content-wrapper {
            padding: 50px 20px;
          }
          
          .projects-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        @media (max-width: 480px) {
          .content-wrapper {
            padding: 40px 16px;
          }
          
          .projects-grid {
            gap: 20px;
          }
        }

        .project-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          cursor: pointer;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .project-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(167, 139, 250, 0.5);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .project-card.featured {
          border-color: rgba(167, 139, 250, 0.6);
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(244, 114, 182, 0.05));
        }

        .project-card.like-animation {
          animation: cardPop 0.3s ease-out;
        }

        @keyframes cardPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1), transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .project-card:hover .card-glow {
          opacity: 1;
        }

        .card-image {
          height: 220px;
          overflow: hidden;
          position: relative;
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(244, 114, 182, 0.1));
        }

        @media (max-width: 768px) {
          .card-image {
            height: 200px;
          }
        }

        @media (max-width: 480px) {
          .card-image {
            height: 180px;
          }
        }

        .project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .project-card:hover .project-image {
          transform: scale(1.05);
        }

        .featured-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #a78bfa, #f472b6);
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          letter-spacing: 0.5px;
          z-index: 1;
          backdrop-filter: blur(4px);
        }

        .card-content {
          padding: 24px;
        }

        @media (max-width: 768px) {
          .card-content {
            padding: 20px;
          }
        }

        .project-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        @media (max-width: 480px) {
          .project-title {
            font-size: 1.3rem;
          }
        }

        .project-description {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .tech-tag {
          font-size: 0.75rem;
          padding: 5px 12px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 100px;
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }

        .tech-tag:hover {
          background: rgba(167, 139, 250, 0.3);
          border-color: rgba(167, 139, 250, 0.5);
        }

        .more-tag {
          background: rgba(167, 139, 250, 0.2);
          border-color: rgba(167, 139, 250, 0.3);
        }

        .stats-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
          padding: 8px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .stat-icon {
          width: 16px;
          height: 16px;
        }

        .like-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s ease;
        }

        .heart-container {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .heart-icon {
          width: 20px;
          height: 20px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          color: rgba(255, 255, 255, 0.6);
        }

        .like-btn:hover .heart-icon {
          transform: scale(1.15);
          color: #f472b6;
        }

        .heart-active {
          color: #f472b6;
          fill: #f472b6;
          animation: heartBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes heartBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }

        .like-count {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.2s ease;
        }

        .like-btn.liked .like-count {
          color: #f472b6;
        }

        .button-group {
          display: flex;
          gap: 12px;
        }

        @media (max-width: 480px) {
          .button-group {
            flex-direction: column;
            gap: 10px;
          }
        }

        .btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #a78bfa, #f472b6);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(167, 139, 250, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .footer-note {
          text-align: center;
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-note p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .footer-icon, .footer-heart {
          font-size: 0.9rem;
        }

        .footer-divider {
          margin: 0 4px;
        }

        @media (max-width: 480px) {
          .footer-note p {
            font-size: 0.75rem;
            gap: 4px;
          }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border-radius: 28px;
          max-width: 900px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .modal-content {
            max-height: 90vh;
            border-radius: 20px;
          }
        }

        .modal-close {
          position: sticky;
          top: 20px;
          right: 20px;
          float: right;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
          margin: 20px 20px 0 0;
          backdrop-filter: blur(8px);
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .modal-header {
          display: flex;
          flex-direction: column;
          clear: both;
        }

        .modal-image {
          width: 100%;
          height: 280px;
          object-fit: cover;
          border-radius: 28px 28px 0 0;
        }

        @media (max-width: 768px) {
          .modal-image {
            height: 200px;
          }
        }

        .modal-header-info {
          padding: 28px 32px 20px;
        }

        @media (max-width: 768px) {
          .modal-header-info {
            padding: 20px;
          }
        }

        .modal-header-info h2 {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .modal-header-info h2 {
            font-size: 1.5rem;
          }
        }

        .modal-short-desc {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .modal-stats {
          display: flex;
          gap: 24px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .modal-stat, .modal-like-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .modal-like-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 0;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .modal-like-btn:hover {
          color: #f472b6;
        }

        .modal-like-btn.liked {
          color: #f472b6;
        }

        .modal-body {
          padding: 0 32px 20px;
        }

        @media (max-width: 768px) {
          .modal-body {
            padding: 0 20px 20px;
          }
        }

        .modal-body section {
          margin-bottom: 28px;
        }

        .modal-body h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #a78bfa;
          margin-bottom: 12px;
        }

        .modal-body p, .modal-body li {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }

        .modal-body ul {
          margin: 0;
          padding-left: 20px;
        }

        .modal-body li {
          margin-bottom: 6px;
        }

        .feature-list li, .architecture-list li {
          list-style-type: none;
          position: relative;
          padding-left: 24px;
        }

        .feature-list li::before {
          content: "✅";
          position: absolute;
          left: 0;
        }

        .architecture-list li::before {
          content: "▹";
          position: absolute;
          left: 0;
          color: #a78bfa;
        }

        .modal-tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .modal-footer {
          padding: 20px 32px 32px;
          display: flex;
          gap: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .modal-footer {
            padding: 20px;
            flex-direction: column;
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(167, 139, 250, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(167, 139, 250, 0.8);
        }
      `}</style>
    </div>
  );
}
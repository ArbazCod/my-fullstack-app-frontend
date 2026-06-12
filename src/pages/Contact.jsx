import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  
  const [status, setStatus] = useState({
    type: "", // "success", "error", "loading"
    message: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "loading", message: "Sending your message..." });

    try {
      // Using Web3Forms submission
      const form = e.target;
      const formDataObj = new FormData(form);
      
      // Add additional data
      formDataObj.append("subject", `New Contact from ${formData.name}`);
      formDataObj.append("from_name", "Portfolio Contact Form");
      
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj,
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        });
        
        // Reset form
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
        
        // Reset status after 5 seconds
        setTimeout(() => {
          setStatus({ type: "", message: "" });
        }, 5000);
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      {/* Header Section */}
      <div className="contact-header">
        <h1 className="contact-title">Let's Connect</h1>
        <div className="title-divider"></div>
        <p className="contact-subtitle">
          Have a question or want to work together? I'd love to hear from you.
        </p>
      </div>

      <div className="contact-content">
        {/* Contact Information */}
        <div className="contact-info">
          <div className="info-section">
            <h2 className="info-title">Get In Touch</h2>
            <p className="info-description">
              Fill out the form or use the contact details below. I typically
              respond within 24 hours.
            </p>
            
            <div className="contact-details">
              <div className="detail-item">
                <div className="detail-icon">✉️</div>
                <div className="detail-content">
                  <h3>Email</h3>
                  <p>ak0297305@gmail.com</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">📍</div>
                <div className="detail-content">
                  <h3>Location</h3>
                  <p>West Bengal, India</p>
                  <span className="detail-sub">Available worldwide</span>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">💼</div>
                <div className="detail-content">
                  <h3>Work Status</h3>
                  <p>Open to Opportunities</p>
                  <span className="detail-sub">Remote & On-site</span>
                </div>
              </div>
            </div>

            <div className="contact-cta">
              <p className="cta-text">Prefer social media?</p>
              <div className="social-links">
                <a href="https://www.linkedin.com/in/arbaz17" className="social-link" aria-label="LinkedIn">
                  <span className="social-icon">💼</span>
                  <span>LinkedIn</span>
                </a>
                <a href="https://github.com/ArbazCod" className="social-link" aria-label="GitHub">
                  <span className="social-icon">🐙</span>
                  <span>GitHub</span>
                  </a>
                <a
    href="/resume.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="social-link"
    aria-label="Resume"
  >
    <span className="social-icon">📄</span>
    <span>Resume</span>
  </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-wrapper">
          <div className="form-header">
            <h2 className="form-title">Send a Message</h2>
            <p className="form-subtitle">
              All fields are required. I respect your privacy and will never share your information.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            action="https://api.web3forms.com/submit"
            method="POST"
            className="contact-form"
          >
            {/* Web3Forms Hidden Inputs */}
            <input
              type="hidden"
              name="access_key"
              value="52a0df4a-afc9-473b-8163-b9958456adad"
            />
            <input type="hidden" name="redirect" value="false" />
            <input type="hidden" name="subject" value="New Contact Form Submission" />
            <input type="hidden" name="from_name" value="Portfolio Website" />
            
            {/* Honeypot Spam Protection */}
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              style={{ display: "none" }}
            />

            {/* Name Field */}
            <div className="form-group">
              <div className="input-header">
                <label htmlFor="name" className="form-label">
                  Your Name
                </label>
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>
              <div className="input-wrapper">
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? "error" : ""}`}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                  required
                />
                <span className="input-icon">👤</span>
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <div className="input-header">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                  required
                />
                <span className="input-icon">📧</span>
              </div>
            </div>

            {/* Message Field */}
            <div className="form-group">
              <div className="input-header">
                <label htmlFor="message" className="form-label">
                  Your Message
                </label>
                {errors.message && (
                  <span className="error-message">{errors.message}</span>
                )}
              </div>
              <div className="input-wrapper">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`form-textarea ${errors.message ? "error" : ""}`}
                  placeholder="Tell me about your project, idea, or inquiry..."
                  rows="5"
                  disabled={isSubmitting}
                  required
                />
                <span className="textarea-icon">💭</span>
              </div>
              <div className="form-helper">
                <span className="char-count">
                  {formData.message.length}/500 characters
                </span>
                <span className="helper-text">Required</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <span className="btn-icon">✈️</span>
                </>
              )}
            </button>

            {/* Status Message */}
            {status.message && (
              <div className={`status-message ${status.type}`}>
                <span className="status-icon">
                  {status.type === "success" ? "✅" : 
                   status.type === "error" ? "❌" : "⏳"}
                </span>
                <span>{status.message}</span>
              </div>
            )}

            {/* Web3Forms Attribution */}
            <div className="form-footer">
              <p className="privacy-note">
                <span className="lock-icon">🔒</span>
                Your information is secure and will only be used to respond to your inquiry.
              </p>
              <p className="attribution">
                Powered by{" "}
                <a 
                  href="https://web3forms.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="attribution-link"
                >
                  Web3Forms
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

// CSS Styles
const styles = `
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 140px);
}

/* Header Styles */
.contact-header {
  text-align: center;
  margin-bottom: 60px;
}

.contact-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4f46e5, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.title-divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #8b5cf6);
  margin: 0 auto 24px;
  border-radius: 2px;
}

.contact-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Contact Content */
.contact-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 60px;
  align-items: start;
}

@media (max-width: 992px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

/* Contact Information */
.contact-info {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid #e5e7eb;
}

.info-section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.info-description {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 32px;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.detail-icon {
  font-size: 1.5rem;
  background: linear-gradient(135deg, #4f46e5, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}

.detail-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.detail-content p {
  font-size: 1rem;
  color: #4f46e5;
  font-weight: 500;
  margin-bottom: 2px;
}

.detail-sub {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Contact CTA */
.contact-cta {
  margin-top: auto;
}

.cta-text {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 16px;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  text-decoration: none;
  color: #4b5563;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: translateY(-2px);
  border-color: #4f46e5;
  color: #4f46e5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-icon {
  font-size: 1.1rem;
}

/* Contact Form */
.contact-form-wrapper {
  background: white;
  border-radius: 20px;
  padding: 40px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .contact-form-wrapper {
    padding: 30px 24px;
  }
  
  .contact-info {
    padding: 30px 24px;
  }
}

.form-header {
  margin-bottom: 32px;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
}

/* Form Elements */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
}

.error-message {
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  color: #1f2937;
  background: #f9fafb;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-textarea {
  padding: 16px 20px 16px 50px;
  resize: vertical;
  min-height: 140px;
}

.form-input:hover, .form-textarea:hover {
  border-color: #d1d5db;
  background: white;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #4f46e5;
  background: white;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input.error, .form-textarea.error {
  border-color: #dc2626;
  background: #fef2f2;
}

.form-input:disabled, .form-textarea:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.input-icon, .textarea-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #9ca3af;
  pointer-events: none;
}

.textarea-icon {
  top: 20px;
  transform: none;
}

.form-helper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.char-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.helper-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Submit Button */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 32px;
  background: linear-gradient(135deg, #4f46e5, #8b5cf6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 16px;
  min-height: 56px;
  width: 100%;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.submit-btn:hover:not(:disabled) .btn-icon {
  transform: translateX(4px);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Status Message */
.status-message {
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  margin-top: 16px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-message.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.status-message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.status-message.loading {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.status-icon {
  font-size: 1.2rem;
}

/* Form Footer */
.form-footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.privacy-note {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 12px;
}

.lock-icon {
  font-size: 1rem;
}

.attribution {
  font-size: 0.875rem;
  color: #9ca3af;
  text-align: center;
}

.attribution-link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.attribution-link:hover {
  color: #8b5cf6;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-container {
    padding: 20px 16px;
  }

  .contact-title {
    font-size: 2.25rem;
  }

  .contact-subtitle {
    font-size: 1.1rem;
  }

  .contact-header {
    margin-bottom: 40px;
  }

  .form-input, .form-textarea {
    padding: 14px 16px 14px 46px;
  }
  
  .social-links {
    flex-direction: column;
  }
  
  .social-link {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .contact-title {
    font-size: 1.75rem;
  }

  .form-title, .info-title {
    font-size: 1.5rem;
  }

  .submit-btn {
    padding: 16px 24px;
    font-size: 1rem;
  }
  
  .detail-item {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  .contact-info {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    border-color: #374151;
  }
  
  .contact-form-wrapper {
    background: #1f2937;
    border-color: #374151;
  }
  
  .form-title, .info-title {
    color: #f9fafb;
  }
  
  .form-subtitle, .info-description {
    color: #d1d5db;
  }
  
  .detail-content h3 {
    color: #e5e7eb;
  }
  
  .detail-content p {
    color: #8b5cf6;
  }
  
  .form-input, .form-textarea {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
  
  .form-input:focus, .form-textarea:focus {
    border-color: #8b5cf6;
    background: #374151;
  }
  
  .social-link {
    background: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }
  
  .social-link:hover {
    border-color: #8b5cf6;
    color: #8b5cf6;
  }
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);







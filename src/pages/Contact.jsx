import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiMessageSquare,
  FiUsers,
  FiHelpCircle,
  FiFileText,
  FiShield,
  FiBookOpen,
  FiChevronDown,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../api/api";

const ContactInfoCard = ({ info, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="contact-info-card-enhanced"
    >
      <div className={`contact-info-icon ${info.color}`}>
        {info.icon}
      </div>
      <h3 className="contact-info-title">{info.title}</h3>
      <div className="contact-info-details">
        {info.details.map((detail, i) => (
          <p key={i} className="contact-info-detail">{detail}</p>
        ))}
      </div>
      <a href={info.action} className="contact-info-action">
        {info.buttonText} <FiSend className="w-4 h-4" />
      </a>
    </motion.div>
  );
};

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
    success: false,
  });

  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "How do I upload a resource?",
      answer: "Login to your account, click on 'Upload' in the navigation menu, fill in the resource details (title, description, branch, semester, etc.), and upload your PDF file. Your resource will be reviewed by an admin before being published.",
      category: "upload",
      open: false,
    },
    {
      id: 2,
      question: "What file formats are supported?",
      answer: "Currently, we support PDF files only. Maximum file size is 10MB. Make sure your file is clear, readable, and relevant to the subject.",
      category: "upload",
      open: false,
    },
    {
      id: 3,
      question: "How long does approval take?",
      answer: "Resources are typically reviewed within 24-48 hours. You'll receive a notification once your resource is approved or if additional information is needed.",
      category: "general",
      open: false,
    },
    {
      id: 4,
      question: "Can I edit or delete my uploaded resources?",
      answer: "Currently, only admins can delete resources. If you need to update or remove a resource, please contact the admin team through this form.",
      category: "general",
      open: false,
    },
    {
      id: 5,
      question: "Is my data secure?",
      answer: "Yes! We use JWT authentication, bcrypt password hashing, and secure HTTPS connections. Your personal information is never shared with third parties.",
      category: "security",
      open: false,
    },
    {
      id: 6,
      question: "Can I become an admin?",
      answer: "Admin positions are currently by invitation only. Active contributors who consistently share high-quality resources may be considered for admin roles in the future.",
      category: "account",
      open: false,
    },
    {
      id: 7,
      question: "What branches and semesters are supported?",
      answer: "We support all major engineering branches: CSE, ECE, EEE, MECH, CIVIL, IT, and OTHER. Resources are categorized from semester 1 to 8.",
      category: "resources",
      open: false,
    },
    {
      id: 8,
      question: "How do I report inappropriate content?",
      answer: "Use this contact form to report any inappropriate or copyrighted content. Please include the resource ID and reason for reporting.",
      category: "general",
      open: false,
    },
  ]);

  const [filteredFaqs, setFilteredFaqs] = useState(faqs);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All FAQs", icon: <FiHelpCircle /> },
    { id: "general", name: "General", icon: <FiMessageSquare /> },
    { id: "upload", name: "Upload", icon: <FiFileText /> },
    { id: "account", name: "Account", icon: <FiUsers /> },
    { id: "security", name: "Security", icon: <FiShield /> },
    { id: "resources", name: "Resources", icon: <FiBookOpen /> },
  ];

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredFaqs(faqs);
    } else {
      setFilteredFaqs(faqs.filter((faq) => faq.category === activeCategory));
    }
  }, [activeCategory, faqs]);

  const toggleFaq = (id) => {
    setFaqs((prevFaqs) =>
      prevFaqs.map((faq) => (faq.id === id ? { ...faq, open: !faq.open } : faq))
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormStatus({
        submitting: false,
        submitted: false,
        error: "Please fill in all required fields",
        success: false,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        submitting: false,
        submitted: false,
        error: "Please enter a valid email address",
        success: false,
      });
      return;
    }

    setFormStatus({
      submitting: true,
      submitted: false,
      error: null,
      success: false,
    });

    try {
      const response = await api.post("/contact", formData);
      if (response.data?.success) {
        setFormStatus({
          submitting: false,
          submitted: true,
          error: null,
          success: true,
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          category: "general",
        });
        setTimeout(() => {
          setFormStatus((prev) => ({ ...prev, success: false, submitted: false }));
        }, 5000);
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setFormStatus({
        submitting: false,
        submitted: false,
        error: error.response?.data?.message || "Failed to send message. Please try again.",
        success: false,
      });
    }
  };

  const contactInfo = [
    {
      icon: <FiMail className="w-6 h-6" />,
      title: "Email Us",
      details: ["support@campusshare.com", "We'll respond within 24 hours"],
      action: "mailto:support@campusshare.com",
      buttonText: "Send Email",
      color: "blue-gradient",
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: "Virtual Office",
      details: ["Available Online", "24/7 Support", "Global Community"],
      action: "#",
      buttonText: "Get in Touch",
      color: "purple-gradient",
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Support Hours",
      details: ["Monday - Friday: 9:00 AM - 6:00 PM IST", "Saturday: 10:00 AM - 2:00 PM IST", "Sunday: Closed"],
      action: "#",
      buttonText: "24/7 Online Support",
      color: "green-gradient",
    },
  ];

  const socialLinks = [
    { icon: <FiGithub className="w-5 h-5" />, url: "https://github.com/rajhemant076", label: "GitHub" },
    { icon: <FiLinkedin className="w-5 h-5" />, url: "https://www.linkedin.com/in/hemant-raj-04452a326", label: "LinkedIn" },
    { icon: <FiInstagram className="w-5 h-5" />, url: "https://www.instagram.com/hemant_raj1401/", label: "Instagram" },
  ];

  const teamContacts = [
    {
      name: "Support Team",
      role: "General Support & Queries",
      email: "support@campusshare.com",
      response: "Responds within 24h",
      icon: <FiMessageSquare />,
    },
    {
      name: "Admin Team",
      role: "Resource Approval & Moderation",
      email: "admin@campusshare.com",
      response: "Responds within 48h",
      icon: <FiShield />,
    },
    {
      name: "Technical Team",
      role: "Bugs & Technical Issues",
      email: "tech@campusshare.com",
      response: "Responds within 12h",
      icon: <FiHelpCircle />,
    },
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-pattern"></div>
        
        <div className="contact-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="contact-hero-text"
          >
            <h1 className="contact-hero-title">
              Get in{" "}
              <span className="contact-hero-highlight">
                Touch
              </span>
            </h1>
            <p className="contact-hero-description">
              Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>

        <div className="contact-hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="white" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <ContactInfoCard key={index} info={info} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section" id="contact-form">
        <div className="container">
          <div className="contact-form-container">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="contact-form-card"
            >
              <h2 className="contact-form-title">Send us a message</h2>
              <p className="contact-form-subtitle">Fill out the form below and we'll get back to you within 24 hours.</p>

              {formStatus.success && (
                <div className="alert alert-success">
                  <FiCheckCircle className="w-5 h-5" />
                  <span>Message sent successfully! We'll get back soon.</span>
                </div>
              )}

              {formStatus.error && (
                <div className="alert alert-error">
                  <FiAlertCircle className="w-5 h-5" />
                  <span>{formStatus.error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="yourname@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="report">Report Content</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className="form-textarea"
                    placeholder="Write your message here..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formStatus.submitting}
                  className="btn btn-primary btn-block"
                >
                  {formStatus.submitting ? (
                    <>
                      <div className="spinner-sm"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="contact-team-section"
            >
              <h2 className="contact-team-title">Contact our team</h2>
              <p className="contact-team-subtitle">Get in touch with the right team member for your query.</p>

              <div className="contact-team-list">
                {teamContacts.map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="contact-team-card"
                  >
                    <div className="contact-team-card-inner">
                      <div className="contact-team-icon">
                        {contact.icon}
                      </div>
                      <div className="contact-team-info">
                        <h3 className="contact-team-name">{contact.name}</h3>
                        <p className="contact-team-role">{contact.role}</p>
                        <a href={`mailto:${contact.email}`} className="contact-team-email">
                          <FiMail className="w-4 h-4" />
                          {contact.email}
                        </a>
                        <p className="contact-team-response">
                          <FiClock className="w-3 h-3" />
                          {contact.response}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="contact-social-card">
                <h3 className="contact-social-title">Connect with us</h3>
                <p className="contact-social-description">
                  Follow us on social media for updates, tips, and community highlights.
                </p>
                <div className="contact-social-links">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-link"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="contact-section-header"
          >
            <h2 className="contact-section-title">
              Frequently Asked{" "}
              <span className="contact-section-highlight">
                Questions
              </span>
            </h2>
            <p className="contact-section-subtitle">Find answers to common questions about CampusShare.</p>
          </motion.div>

          <div className="contact-categories">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`contact-category-btn ${
                  activeCategory === category.id ? "active" : ""
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>

          <div className="contact-faq-list">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="contact-faq-item"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="contact-faq-question"
                >
                  <h3 className="contact-faq-question-text">{faq.question}</h3>
                  <FiChevronDown className={`contact-faq-chevron ${faq.open ? "open" : ""}`} />
                </button>
                <div className={`contact-faq-answer ${faq.open ? "open" : ""}`}>
                  <p>{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="contact-faq-footer"
          >
            <p className="contact-faq-footer-text">Still have questions?</p>
            <button
              onClick={() => {
                document.querySelector("#contact-form")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn btn-primary"
            >
              <FiMessageSquare className="w-5 h-5" />
              Contact Support
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
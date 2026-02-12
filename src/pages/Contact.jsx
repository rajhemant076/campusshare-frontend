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
} from "react-icons/fi";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaInstagram,
} from "react-icons/fa";
import Footer from "../components/Footer";
import api from "../api/api";

const ContactInfoCard = ({ info, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="contact-info-card"
    >
      <div className={`contact-icon bg-gradient-to-r ${info.color}`}>
        {info.icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{info.title}</h3>
      <div className="space-y-1 mb-4">
        {info.details.map((detail, i) => (
          <p key={i} className="text-gray-600">{detail}</p>
        ))}
      </div>
      <a href={info.action} className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors">
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
      details: ["support@campusshare.com", "admin@campusshare.com"],
      action: "mailto:support@campusshare.com",
      buttonText: "Send Email",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: ["CampusShare HQ", "123 Education Street", "Tech City, TC 12345"],
      action: "#",
      buttonText: "Get Directions",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Support Hours",
      details: ["Monday - Friday", "9:00 AM - 6:00 PM", "Weekend: Closed"],
      action: "#",
      buttonText: "24/7 Support",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const socialLinks = [
    { icon: <FaGithub className="w-5 h-5" />, url: "https://github.com/campusshare", label: "GitHub" },
    { icon: <FaTwitter className="w-5 h-5" />, url: "https://twitter.com/campusshare", label: "Twitter" },
    { icon: <FaLinkedin className="w-5 h-5" />, url: "https://linkedin.com/company/campusshare", label: "LinkedIn" },
    { icon: <FaDiscord className="w-5 h-5" />, url: "https://discord.gg/campusshare", label: "Discord" },
    { icon: <FaInstagram className="w-5 h-5" />, url: "https://instagram.com/campusshare", label: "Instagram" },
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
        <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
                Touch
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="white" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <ContactInfoCard key={index} info={info} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" id="contact-form">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a message</h2>
              <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>

              {formStatus.success && (
                <div className="alert alert-success flex items-center gap-3">
                  <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Message sent successfully! We'll get back soon.</span>
                </div>
              )}

              {formStatus.error && (
                <div className="alert alert-error flex items-center gap-3">
                  <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{formStatus.error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="John Doe"
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
                      placeholder="john@example.com"
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
                  className="btn btn-primary w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
                >
                  {formStatus.submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact our team</h2>
              <p className="text-gray-600 mb-8">Get in touch with the right team member for your query.</p>

              <div className="space-y-4">
                {teamContacts.map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center text-purple-600">
                        {contact.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{contact.role}</p>
                        <a href={`mailto:${contact.email}`} className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 text-sm">
                          <FiMail className="w-4 h-4" />
                          {contact.email}
                        </a>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {contact.response}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-semibold mb-4">Connect with us</h3>
                <p className="text-white/90 mb-6">
                  Follow us on social media for updates, tips, and community highlights.
                </p>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-110"
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

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-600">Find answers to common questions about CampusShare.</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-4"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="faq-item w-full"
                >
                  <div className="faq-question">
                    <h3 className="text-lg font-semibold text-gray-900 pr-8">{faq.question}</h3>
                    <FiChevronDown className={`faq-chevron ${faq.open ? "open" : ""}`} />
                  </div>
                  <div className={`mt-4 text-gray-600 overflow-hidden transition-all duration-300 ${
                    faq.open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    {faq.answer}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <button
              onClick={() => {
                document.querySelector("#contact-form")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
            >
              <FiMessageSquare className="w-5 h-5" />
              Contact Support
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Visit Our Campus</h3>
                <p className="text-gray-600 mb-6">
                  We're located at the heart of the tech district. Drop by for a visit or attend one of our community events.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">CampusShare HQ</p>
                      <p className="text-gray-600">123 Education Street, Tech City, TC 12345</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiClock className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Office Hours</p>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-64 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white mb-4">
                    <FiMapPin className="w-8 h-8" />
                  </div>
                  <p className="text-gray-600">Interactive Map Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default Contact;
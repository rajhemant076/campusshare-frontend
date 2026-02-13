import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  HeartIcon,
  ClockIcon,
  ChartBarIcon,
  BuildingLibraryIcon,
  CpuChipIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  UsersIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Footer from "../components/Footer";
import api from "../api/api";

const FeatureCard = ({ feature, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="feature-card-enhanced"
    >
      <div className="feature-card-inner">
        <div className={`feature-icon-wrapper ${feature.color}`}>
          {feature.icon}
        </div>

        <h3 className="feature-card-title">{feature.title}</h3>

        <p className="feature-card-description">{feature.description}</p>

        {feature.stat && (
          <div className="feature-card-stat">
            <span className="feature-stat-label">{feature.statLabel}</span>
            <span className="feature-stat-value">{feature.stat}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ResourceCard = ({ resource, index }) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="feature-resource-card"
    >
      <div className="resource-card-badges">
        <span className="badge badge-primary">
          {resource.branch || "CSE"}
        </span>
        <span className="badge badge-secondary">
          Sem {resource.semester || "1"}
        </span>
        <span className="badge badge-outline">
          {resource.type || "Notes"}
        </span>
      </div>

      <h4 className="resource-card-title">
        {resource.title || "Data Structures Notes"}
      </h4>

      <p className="resource-card-description">
        {resource.description || "Complete notes for Data Structures covering arrays, linked lists, trees, and graphs."}
      </p>

      <div className="resource-card-footer">
        <span className="resource-author">
          By {resource.uploadedBy?.name || "John Doe"}
        </span>
        <div className="resource-stats">
          <span className="resource-stat">
            <HeartIcon className="w-4 h-4" /> {resource.likesCount || 24}
          </span>
          <span className="resource-stat">
            <BookmarkIcon className="w-4 h-4" /> {resource.bookmarks?.length || 12}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Features = () => {
  const [stats, setStats] = useState({
    totalResources: 0,
    totalUsers: 0,
    totalDownloads: 0,
    totalApproved: 0,
    totalBranches: 7,
    totalSemesters: 8,
    loading: true,
    error: null,
  });

  const [recentResources, setRecentResources] = useState([]);
  const [popularResources, setPopularResources] = useState([]);
  const [branchStats, setBranchStats] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchRealTimeData = useCallback(async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true, error: null }));

      const featuresResponse = await api.get("/features/stats");

      if (featuresResponse.data?.success) {
        const { stats, recentResources, popularResources, branchStats } = featuresResponse.data.data;
        
        setStats((prev) => ({
          ...prev,
          totalUsers: stats.totalUsers || 0,
          totalResources: stats.totalResources || 0,
          totalApproved: stats.totalApproved || 0,
          totalDownloads: stats.totalDownloads || Math.floor((stats.totalResources || 0) * 3.5),
          totalBranches: stats.totalBranches || 7,
          totalSemesters: stats.totalSemesters || 8,
          loading: false,
        }));

        setRecentResources(recentResources || []);
        setPopularResources(popularResources || []);
        setBranchStats(branchStats || []);
      }
    } catch (error) {
      console.error("Error fetching real-time data:", error);

      setStats((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || "Failed to fetch data",
      }));

      if (process.env.NODE_ENV === "development") {
        setStats({
          totalResources: 1234,
          totalUsers: 892,
          totalDownloads: 4321,
          totalApproved: 987,
          totalBranches: 7,
          totalSemesters: 8,
          loading: false,
          error: null,
        });
        
        setBranchStats([
          { branch: "CSE", count: 450 },
          { branch: "ECE", count: 320 },
          { branch: "EEE", count: 280 },
          { branch: "MECH", count: 310 },
          { branch: "CIVIL", count: 290 },
          { branch: "IT", count: 380 },
          { branch: "OTHER", count: 120 },
        ]);
      }
    }
  }, []);

  useEffect(() => {
    fetchRealTimeData();
  }, [fetchRealTimeData]);

  const statCards = [
    {
      icon: <DocumentTextIcon className="w-8 h-8" />,
      value: (stats.totalResources || 0).toLocaleString(),
      label: "Total Resources",
      change: "+12%",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <UsersIcon className="w-8 h-8" />,
      value: (stats.totalUsers || 0).toLocaleString(),
      label: "Active Students",
      change: "+8%",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <ArrowTrendingUpIcon className="w-8 h-8" />,
      value: (stats.totalDownloads || 0).toLocaleString(),
      label: "Total Downloads",
      change: "+25%",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <CheckBadgeIcon className="w-8 h-8" />,
      value: (stats.totalApproved || 0).toLocaleString(),
      label: "Approved Resources",
      change: "+15%",
      color: "from-orange-500 to-red-500",
    },
  ];

  const features = [
    {
      icon: <CloudArrowUpIcon className="w-8 h-8" />,
      title: "Easy File Upload",
      description: "Upload notes, assignments, PYQs, and lab manuals with just a few clicks. Support for PDF format up to 10MB.",
      color: "blue-gradient",
      stat: `${stats.totalResources || 0}+`,
      statLabel: "Total Resources",
    },
    {
      icon: <MagnifyingGlassIcon className="w-8 h-8" />,
      title: "Smart Search",
      description: "Find resources by branch, semester, subject, or type. Advanced filters help you get exactly what you need.",
      color: "purple-gradient",
      stat: `${stats.totalBranches} Branches`,
      statLabel: `${stats.totalSemesters} Semesters`,
    },
    {
      icon: <DocumentCheckIcon className="w-8 h-8" />,
      title: "Admin Approval",
      description: "Quality control through admin review system. Only approved resources are visible to the community.",
      color: "green-gradient",
      stat: `${stats.totalApproved || 0}+`,
      statLabel: "Approved Resources",
    },
    {
      icon: <BookmarkIcon className="w-8 h-8" />,
      title: "Bookmark Resources",
      description: "Save important resources for quick access later. Build your personal library of study materials.",
      color: "yellow-gradient",
    },
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: "Like & Engage",
      description: "Show appreciation for helpful resources. Popular resources rise to the top.",
      color: "red-gradient",
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Student Community",
      description: "Connect with fellow students from different branches and semesters.",
      color: "indigo-gradient",
      stat: `${stats.totalUsers || 0}+`,
      statLabel: "Active Students",
    },
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: "Branch Specific",
      description: "Resources organized by CSE, ECE, EEE, MECH, CIVIL, IT, and other branches.",
      color: "teal-gradient",
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "Semester Wise",
      description: "Content categorized from semester 1 to 8, making it easy to find relevant material.",
      color: "amber-gradient",
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Secure Authentication",
      description: "JWT-based authentication with encrypted passwords. Your data stays safe.",
      color: "violet-gradient",
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Admin Dashboard",
      description: "Comprehensive analytics and management tools for administrators.",
      color: "slate-gradient",
    },
    {
      icon: <BuildingLibraryIcon className="w-8 h-8" />,
      title: "Digital Library",
      description: "Create your own digital collection of academic resources.",
      color: "cyan-gradient",
    },
    {
      icon: <CpuChipIcon className="w-8 h-8" />,
      title: "Modern Tech Stack",
      description: "Built with MERN stack, GridFS for file storage, and responsive design.",
      color: "fuchsia-gradient",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up / Login",
      description: "Create your student account using your college email.",
      icon: <AcademicCapIcon className="w-6 h-6" />,
    },
    {
      step: "2",
      title: "Browse Resources",
      description: "Search and filter resources by branch, semester, or subject.",
      icon: <MagnifyingGlassIcon className="w-6 h-6" />,
    },
    {
      step: "3",
      title: "Upload & Share",
      description: "Share your notes and study materials with the community.",
      icon: <CloudArrowUpIcon className="w-6 h-6" />,
    },
    {
      step: "4",
      title: "Get Approved",
      description: "Admins review and approve your uploads for quality.",
      icon: <DocumentCheckIcon className="w-6 h-6" />,
    },
    {
      step: "5",
      title: "Engage & Save",
      description: "Like, bookmark, and download resources you need.",
      icon: <HeartIcon className="w-6 h-6" />,
    },
  ];

  if (stats.error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="pt-32 pb-20 text-center">
          <div className="text-red-600 mb-4">⚠️ {stats.error}</div>
          <button
            onClick={fetchRealTimeData}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="features-page">
      {/* Hero Section */}
      <section className="features-hero">
        <div className="features-hero-overlay"></div>
        <div className="features-hero-pattern"></div>

        <div className="features-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="features-hero-text"
          >
            <div className="features-live-badge">
              <div className="live-dot"></div>
              <span>Live Data • Updated Real-time</span>
            </div>

            <h1 className="features-hero-title">
              Everything You Need in{" "}
              <span className="features-hero-highlight">
                One Place
              </span>
            </h1>

            <p className="features-hero-description">
              CampusShare provides a complete platform for{" "}
              {stats.totalUsers || 0}+ students to share, discover, and
              collaborate on {stats.totalResources || 0}+ academic resources.
            </p>

            <div className="features-stats-grid">
              {statCards.map((stat, index) => (
                <div key={index} className="features-stat-item">
                  <div className="features-stat-value">
                    {stats.loading ? (
                      <div className="features-stat-skeleton"></div>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="features-stat-label">{stat.label}</div>
                  <div className="features-stat-change">{stat.change}</div>
                </div>
              ))}
            </div>

            <div className="features-hero-buttons">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/resources" className="btn btn-outline-light btn-lg">
                Browse Resources
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="features-hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="white" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="features-stats-section">
        <div className="container">
          <div className="features-stats-cards">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="features-stat-card"
              >
                <div className={`features-stat-card-icon ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="features-stat-card-value">
                  {stats.loading ? (
                    <div className="features-stat-card-skeleton"></div>
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="features-stat-card-label">{stat.label}</div>
                <div className="features-stat-card-change">{stat.change}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Branch Stats Section */}
      <section className="features-branch-section">
        <div className="container">
          <div className="features-branch-card">
            <h3 className="features-branch-title">Resources by Branch</h3>
            <div className="features-branch-grid">
              {branchStats.length > 0 ? (
                branchStats.map((branch, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="features-branch-item"
                  >
                    <div className="features-branch-name">
                      {branch.branch || branch._id}
                    </div>
                    <div className="features-branch-count">
                      {branch.count}
                    </div>
                    <div className="features-branch-label">resources</div>
                  </motion.div>
                ))
              ) : (
                [1,2,3,4,5,6,7].map((i) => (
                  <div key={i} className="features-branch-skeleton">
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="features-grid-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="features-section-header"
          >
            <h2 className="features-section-title">
              Powerful Features for{" "}
              <span className="features-section-highlight">
                Students & Admins
              </span>
            </h2>
            <p className="features-section-subtitle">
              Everything you need to succeed in your academic journey
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="features-recent-section">
        <div className="container">
          <div className="features-recent-header">
            <div>
              <h3 className="features-recent-title">Recently Added</h3>
              <p className="features-recent-subtitle">Latest resources shared by students</p>
            </div>
            <Link to="/resources" className="features-view-all">
              View All <span className="features-view-all-arrow">→</span>
            </Link>
          </div>

          <div className="features-resource-grid">
            {recentResources.length > 0
              ? recentResources.slice(0, 3).map((resource, index) => (
                  <ResourceCard key={index} resource={resource} index={index} />
                ))
              : [1, 2, 3].map((i) => (
                  <div key={i} className="features-resource-skeleton">
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Most Popular Section */}
      <section className="features-popular-section">
        <div className="container">
          <div className="features-popular-header">
            <div>
              <h3 className="features-popular-title">Most Popular</h3>
              <p className="features-popular-subtitle">Most liked resources in CampusShare</p>
            </div>
          </div>

          <div className="features-resource-grid">
            {popularResources.length > 0
              ? popularResources.slice(0, 3).map((resource, index) => (
                  <ResourceCard key={index} resource={resource} index={index} />
                ))
              : [1, 2, 3].map((i) => (
                  <div key={i} className="features-resource-skeleton">
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="features-howitworks-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="features-section-header"
          >
            <h2 className="features-section-title">
              How{" "}
              <span className="features-section-highlight">
                CampusShare
              </span>{" "}
              Works
            </h2>
            <p className="features-section-subtitle">Get started in just a few simple steps</p>
          </motion.div>

          <div className="features-timeline">
            <div className="features-timeline-line"></div>
            <div className="features-timeline-steps">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`features-timeline-step ${index % 2 === 0 ? "left" : "right"}`}
                >
                  <div className="features-timeline-content">
                    <div className="features-timeline-icon">
                      <span className="features-timeline-number">{item.step}</span>
                      {item.icon}
                    </div>
                    <h3 className="features-timeline-title">{item.title}</h3>
                    <p className="features-timeline-description">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="features-cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="features-cta-content"
          >
            <h2 className="features-cta-title">
              Join {stats.totalUsers || 0}+ Students Already Sharing!
            </h2>
            <p className="features-cta-description">
              Be part of the growing CampusShare community. Start sharing and discovering resources today.
            </p>
            <div className="features-cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Create Free Account
              </Link>
              <Link to="/resources" className="btn btn-outline-light btn-lg">
                Browse Resources
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;
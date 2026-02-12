import React, { useEffect, useState, useCallback } from "react";
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
import Footer from "../components/Footer"; // ❌ REMOVED Navbar import
import api from "../api/api";

/* ------------------ FeatureCard Component ------------------ */
const FeatureCard = ({ feature, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}
      >
        {feature.icon}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {feature.title}
      </h3>

      <p className="text-gray-600 mb-4">{feature.description}</p>

      {feature.stat && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{feature.statLabel}</span>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {feature.stat}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* ------------------ ResourceCard Component ------------------ */
const ResourceCard = ({ resource, index }) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold">
          {resource.branch || "Unknown"}
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
          Sem {resource.semester || "N/A"}
        </span>
      </div>

      <h4 className="text-lg font-semibold text-gray-900 mb-2">
        {resource.title || "Untitled"}
      </h4>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {resource.description || "No description available"}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>By {resource.uploadedBy?.name || "Anonymous"}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <HeartIcon className="w-4 h-4" /> {resource.likesCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <BookmarkIcon className="w-4 h-4" />{" "}
            {resource.bookmarks?.length || 0}
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

  /* ------------------ Fetch Real-time Data ------------------ */
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

      // fallback for dev
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

  /* ------------------ Stat Cards ------------------ */
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

  /* ------------------ Features List ------------------ */
  const features = [
    {
      icon: <CloudArrowUpIcon className="w-8 h-8" />,
      title: "Easy File Upload",
      description:
        "Upload notes, assignments, PYQs, and lab manuals with just a few clicks. Support for PDF format up to 10MB.",
      color: "from-blue-500 to-cyan-500",
      stat: `${stats.totalResources || 0}+`,
      statLabel: "Total Resources",
    },
    {
      icon: <MagnifyingGlassIcon className="w-8 h-8" />,
      title: "Smart Search",
      description:
        "Find resources by branch, semester, subject, or type. Advanced filters help you get exactly what you need.",
      color: "from-purple-500 to-pink-500",
      stat: `${stats.totalBranches} Branches`,
      statLabel: `${stats.totalSemesters} Semesters`,
    },
    {
      icon: <DocumentCheckIcon className="w-8 h-8" />,
      title: "Admin Approval",
      description:
        "Quality control through admin review system. Only approved resources are visible to the community.",
      color: "from-green-500 to-emerald-500",
      stat: `${stats.totalApproved || 0}+`,
      statLabel: "Approved Resources",
    },
    {
      icon: <BookmarkIcon className="w-8 h-8" />,
      title: "Bookmark Resources",
      description:
        "Save important resources for quick access later. Build your personal library of study materials.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: "Like & Engage",
      description:
        "Show appreciation for helpful resources. Popular resources rise to the top.",
      color: "from-red-500 to-rose-500",
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Student Community",
      description:
        "Connect with fellow students from different branches and semesters.",
      color: "from-indigo-500 to-blue-500",
      stat: `${stats.totalUsers || 0}+`,
      statLabel: "Active Students",
    },
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: "Branch Specific",
      description:
        "Resources organized by CSE, ECE, EEE, MECH, CIVIL, IT, and other branches.",
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "Semester Wise",
      description:
        "Content categorized from semester 1 to 8, making it easy to find relevant material.",
      color: "from-amber-500 to-yellow-500",
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Secure Authentication",
      description:
        "JWT-based authentication with encrypted passwords. Your data stays safe.",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Admin Dashboard",
      description: "Comprehensive analytics and management tools for administrators.",
      color: "from-slate-500 to-gray-500",
    },
    {
      icon: <BuildingLibraryIcon className="w-8 h-8" />,
      title: "Digital Library",
      description: "Create your own digital collection of academic resources.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: <CpuChipIcon className="w-8 h-8" />,
      title: "Modern Tech Stack",
      description:
        "Built with MERN stack, GridFS for file storage, and responsive design.",
      color: "from-fuchsia-500 to-pink-500",
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

  /* ------------------ Error UI ------------------ */
  if (stats.error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="pt-32 pb-20 text-center">
          <div className="text-red-600 mb-4">⚠️ {stats.error}</div>
          <button
            onClick={fetchRealTimeData}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  /* ------------------ Main UI ------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-90"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern id=%22grid%22 width=%2260%22 height=%2260%22 patternUnits=%22userSpaceOnUse%22%3E%3Cpath d=%22M 60 0 L 0 0 0 60%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.1)%22 stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22url(%23grid)%22 /%3E%3C/svg%3E')]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Live Data • Updated Real-time
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Everything You Need in{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
                One Place
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              CampusShare provides a complete platform for{" "}
              {stats.totalUsers || 0}+ students to share, discover, and
              collaborate on {stats.totalResources || 0}+ academic resources.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                >
                  <div className="text-2xl font-bold text-white mb-1">
                    {stats.loading ? (
                      <div className="h-8 w-20 bg-white/20 animate-pulse rounded mx-auto"></div>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-xs text-white/80">{stat.label}</div>
                  <div className="text-xs mt-1 text-green-300">
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                Get Started Free
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300">
                Browse Resources
              </button>
            </div>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full"
          >
            <path
              fill="white"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Rest of your component remains the same... */}
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div
                  className={`w-20 h-20 mx-auto bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {stat.icon}
                </div>

                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stats.loading ? (
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mx-auto"></div>
                  ) : (
                    stat.value
                  )}
                </div>

                <div className="text-gray-600 mb-1">{stat.label}</div>
                <div className="text-sm text-green-600 font-medium">
                  {stat.change}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Branch Distribution */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Resources by Branch
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {branchStats.length > 0 ? (
                branchStats.map((branch, index) => (
                  <div key={index} className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {branch.branch || branch._id}
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {branch.count}
                    </div>
                    <div className="text-xs text-gray-500">resources</div>
                  </div>
                ))
              ) : (
                [1,2,3,4,5,6,7].map((i) => (
                  <div key={i} className="text-center animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Students & Admins
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to succeed in your academic journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Resources */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Recently Added
              </h3>
              <p className="text-gray-600">
                Latest resources shared by students
              </p>
            </div>
            <button className="text-purple-600 hover:text-purple-700 font-semibold">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentResources.length > 0
              ? recentResources.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} index={index} />
                ))
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-xl p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Popular Resources */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Most Popular
              </h3>
              <p className="text-gray-600">
                Most liked resources in CampusShare
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularResources.length > 0
              ? popularResources.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} index={index} />
                ))
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                CampusShare
              </span>{" "}
              Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just a few simple steps
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-200 via-indigo-200 to-purple-200"></div>

            <div className="space-y-12 relative">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: index % 2 === 0 ? -50 : 50,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } items-center gap-8`}
                >
                  <div className="lg:w-1/2">
                    <div
                      className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                        index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-4 mb-4 ${
                          index % 2 === 0 ? "lg:flex-row-reverse" : ""
                        }`}
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {item.step}
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-lg">{item.description}</p>
                    </div>
                  </div>
                  <div className="lg:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join {stats.totalUsers || 0}+ Students Already Sharing!
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Be part of the growing CampusShare community. Start sharing and
              discovering resources today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                Create Free Account
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300">
                Browse Resources
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
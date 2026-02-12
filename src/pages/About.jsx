import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiUsers,
  FiBookOpen,
  FiAward,
  FiTarget,
  FiHeart,
  FiGlobe,
  FiCoffee,
  FiShield,
  FiZap,
  FiTrendingUp,
  FiDownload,
  FiUpload,
  FiDatabase,
  FiLayers,
  FiKey,
  FiCode,
  FiCheckCircle,
} from "react-icons/fi";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaReact,
  FaNodeJs,
  FaJs,
} from "react-icons/fa";
import Footer from "../components/Footer";
import api from "../api/api";

const StatCard = ({ stat, index, loading }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 shadow-lg text-center"
    >
      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white mb-4">
        {stat.icon}
      </div>
      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {loading ? (
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mx-auto"></div>
        ) : (
          `${(stat.value || 0).toLocaleString()}${stat.suffix || ""}`
        )}
      </div>
      <div className="text-gray-600">{stat.label}</div>
    </motion.div>
  );
};

const ValueCard = ({ value, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <div
        className={`w-16 h-16 rounded-xl bg-gradient-to-r ${value.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
      >
        {value.icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
      <p className="text-gray-600">{value.description}</p>
    </motion.div>
  );
};

const TeamCard = ({ member, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="team-card"
    >
      <div className="relative h-64 overflow-hidden">
        <img src={member.image} alt={member.name} className="team-image" />
        <div className="team-image-overlay"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{member.name}</h3>
          <p className="text-sm opacity-90">{member.role}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm text-purple-600 font-semibold mb-2">{member.department}</p>
        <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
        <div className="flex gap-3">
          <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
            <FaLinkedin className="w-5 h-5" />
          </a>
          <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
            <FaTwitter className="w-5 h-5" />
          </a>
          <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
            <FaGithub className="w-5 h-5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const MilestoneCard = ({ milestone, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex flex-col md:flex-row gap-6 items-start"
    >
      <div className="milestone-year">{milestone.year}</div>
      <div className="milestone-card flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
            {milestone.icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
        </div>
        <p className="text-gray-600">{milestone.description}</p>
      </div>
    </motion.div>
  );
};

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResources: 0,
    totalDownloads: 0,
    totalApproved: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        if (response.data?.success) {
          const { totalUsers, totalUploads, approvedResources } = response.data.stats;
          const uploads = totalUploads || 0;
          setStats({
            totalUsers: totalUsers || 0,
            totalResources: uploads,
            totalDownloads: Math.floor(uploads * 3.5),
            totalApproved: approvedResources || 0,
            loading: false,
          });
        } else {
          throw new Error("Stats API failed");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({
          totalUsers: 892,
          totalResources: 1234,
          totalDownloads: 4321,
          totalApproved: 987,
          loading: false,
        });
      }
    };
    fetchStats();
  }, []);

  const milestones = [
    {
      year: "2023",
      title: "The Idea",
      description: "CampusShare was born from a simple idea: students helping students. Founders noticed the lack of centralized academic resource sharing platform.",
      icon: <FiCoffee className="w-6 h-6" />,
    },
    {
      year: "2024",
      title: "First Launch",
      description: "Beta version launched with 100+ students from CSE branch. Received overwhelming response with 500+ resource uploads in first month.",
      icon: <FiZap className="w-6 h-6" />,
    },
    {
      year: "2025",
      title: "Expansion",
      description: "Expanded to all engineering branches (CSE, ECE, EEE, MECH, CIVIL, IT). Crossed 1000+ active users milestone.",
      icon: <FiTrendingUp className="w-6 h-6" />,
    },
    {
      year: "2026",
      title: "Today",
      description: `Now serving ${(stats.totalUsers || 0).toLocaleString()}+ students with ${(stats.totalResources || 0).toLocaleString()}+ resources.`,
      icon: <FiGlobe className="w-6 h-6" />,
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & CEO",
      department: "Computer Science",
      bio: "PhD in Educational Technology. Passionate about democratizing education through technology.",
      image: "https://images.unsplash.com/photo-1494790108755-2519345b8c2e?auto=format&fit=crop&w=500&q=80",
      social: { linkedin: "https://linkedin.com", twitter: "https://twitter.com", github: "https://github.com" },
    },
    {
      name: "Prof. Michael Chen",
      role: "CTO",
      department: "Information Technology",
      bio: "Full-stack developer with 10+ years experience. Previously at Google and Microsoft.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      social: { linkedin: "https://linkedin.com", twitter: "https://twitter.com", github: "https://github.com" },
    },
    {
      name: "Dr. Priya Patel",
      role: "Head of Content",
      department: "Electronics Engineering",
      bio: "Former professor with expertise in curriculum development and quality assurance.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80",
      social: { linkedin: "https://linkedin.com", twitter: "https://twitter.com", github: "https://github.com" },
    },
    {
      name: "Alex Rodriguez",
      role: "Lead Developer",
      department: "Computer Science",
      bio: "MERN stack specialist. Open source contributor and hackathon winner.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
      social: { linkedin: "https://linkedin.com", twitter: "https://twitter.com", github: "https://github.com" },
    },
    {
      name: "Emily Zhang",
      role: "UX/UI Designer",
      department: "Design",
      bio: "Creates intuitive and accessible user experiences.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80",
      social: { linkedin: "https://linkedin.com", twitter: "https://twitter.com", github: "https://github.com" },
    },
    {
      name: "Rajesh Kumar",
      role: "Community Manager",
      department: "Student Relations",
      bio: "Former student representative. Ensures every voice is heard in our community.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80",
      social: { linkedin: "https://linkedin.com", twitter: "https://twitter.com", github: "https://github.com" },
    },
  ];

  const values = [
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: "Student First",
      description: "Every decision we make is driven by what's best for students.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Quality Assured",
      description: "All resources go through review process to ensure quality.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Community Driven",
      description: "Built by students, for students. We grow and learn together.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: "Excellence",
      description: "We strive for excellence in everything we do.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: "Accessibility",
      description: "Free and equal access to educational resources.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <FiGlobe className="w-8 h-8" />,
      title: "Innovation",
      description: "Constantly evolving with new technologies and features.",
      color: "from-teal-500 to-cyan-500",
    },
  ];

  const techStack = [
    { name: "React", icon: <FaReact className="w-8 h-8" />, color: "text-blue-400" },
    { name: "Node.js", icon: <FaNodeJs className="w-8 h-8" />, color: "text-green-600" },
    { name: "MongoDB", icon: <FiDatabase className="w-8 h-8" />, color: "text-green-500" },
    { name: "Express", icon: <FiLayers className="w-8 h-8" />, color: "text-gray-300" },
    { name: "JavaScript", icon: <FaJs className="w-8 h-8" />, color: "text-yellow-400" },
    { name: "JWT", icon: <FiKey className="w-8 h-8" />, color: "text-purple-400" },
    { name: "TailwindCSS", icon: <FiCode className="w-8 h-8" />, color: "text-cyan-400" },
    { name: "Redux", icon: <FiCheckCircle className="w-8 h-8" />, color: "text-purple-300" },
  ];

  const achievements = [
    { label: "Active Users", value: stats.totalUsers, icon: <FiUsers />, suffix: "+" },
    { label: "Resources", value: stats.totalResources, icon: <FiBookOpen />, suffix: "+" },
    { label: "Downloads", value: stats.totalDownloads, icon: <FiDownload />, suffix: "+" },
    { label: "Uploads", value: stats.totalApproved, icon: <FiUpload />, suffix: "+" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
                CampusShare
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Empowering students to share knowledge, collaborate, and succeed together.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="white" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full mb-6">
            <FiTarget className="w-4 h-4" />
            <span className="text-sm font-medium">Our Mission</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Making Education Accessible to{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Every Student
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            CampusShare is built on the belief that every student deserves access to quality resources.
            We are building a student-driven community for learning and sharing.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} loading={stats.loading} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-xl text-gray-600">From a simple idea to a thriving community of learners.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {milestones.map((milestone, index) => (
              <MilestoneCard key={index} milestone={milestone} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What We{" "}
              <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Believe
              </span>
            </h2>
            <p className="text-xl text-gray-600">Our core values guide everything we do.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <ValueCard key={index} value={value} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet the{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Team
              </span>
            </h2>
            <p className="text-xl text-gray-600">Passionate educators, developers, and students working together.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamCard key={index} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built with{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Modern Tech
              </span>
            </h2>
            <p className="text-xl text-gray-300">Powered by MERN stack and industry best practices.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="text-center group"
              >
                <div className={`${tech.color} group-hover:scale-110 transition-transform duration-300`}>
                  {tech.icon}
                </div>
                <p className="text-xs text-gray-400 mt-2">{tech.name}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <FaGithub className="w-5 h-5" />
              <span className="text-sm">Open source and community driven</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Be Part of Our Story</h2>
            <p className="text-xl text-white/90 mb-8">
              Join {(stats.totalUsers || 0).toLocaleString()}+ students who are already sharing and learning together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary bg-white text-purple-600 hover:shadow-lg hover:scale-105">
                Create Free Account
              </button>
              <button className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-purple-600">
                Explore Resources
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default About;
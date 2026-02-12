import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { 
  FiMail, 
  FiUser, 
  FiTag, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiEye,
  FiTrash2,
  FiMessageSquare,
  FiSend,
  FiArchive
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/contact-messages");
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Fetch messages error:", error);
      alert("Failed to fetch contact messages");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (id) => {
    try {
      const res = await api.get(`/admin/contact-messages/${id}`);
      setSelectedMessage(res.data.message);
      setAdminNotes(res.data.message.adminNotes || "");
      setReplyText(res.data.message.replyMessage || "");
      
      // Mark as read if unread
      if (res.data.message.status === "unread") {
        await api.put(`/admin/contact-messages/${id}/status`, { status: "read" });
        fetchMessages();
      }
      
      setShowModal(true);
    } catch (error) {
      console.error("Fetch message error:", error);
      alert("Failed to fetch message details");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/contact-messages/${id}/status`, { status });
      fetchMessages();
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      alert(`Message marked as ${status}`);
    } catch (error) {
      console.error("Update status error:", error);
      alert("Failed to update status");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;
    
    try {
      await api.put(`/admin/contact-messages/${selectedMessage._id}/status`, { 
        notes: adminNotes 
      });
      setSelectedMessage({ ...selectedMessage, adminNotes });
      alert("Notes saved successfully");
    } catch (error) {
      console.error("Save notes error:", error);
      alert("Failed to save notes");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    
    try {
      await api.delete(`/admin/contact-messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      setShowModal(false);
      alert("Message deleted successfully");
    } catch (error) {
      console.error("Delete message error:", error);
      alert("Failed to delete message");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'unread': 'badge-error',
      'read': 'badge-warning',
      'replied': 'badge-success',
      'archived': 'badge-secondary'
    };
    return badges[status] || 'badge-warning';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'general': 'General',
      'support': 'Support',
      'feedback': 'Feedback',
      'report': 'Report',
      'partnership': 'Partnership'
    };
    return labels[category] || category;
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === "all") return true;
    return msg.status === filter;
  });

  if (loading) {
    return <div className="spinner" style={{ margin: "4rem auto" }}></div>;
  }

  return (
    <div className="container" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
            <FiMail style={{ display: "inline", marginRight: "0.5rem" }} />
            Contact Messages
          </h1>
          <p style={{ color: "var(--text-light)" }}>
            Manage user inquiries and feedback
          </p>
        </div>
        <button 
          onClick={fetchMessages}
          className="btn btn-outline"
        >
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2" style={{ marginBottom: "2rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setFilter("all")}
          className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline"}`}
        >
          All ({messages.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`btn btn-sm ${filter === "unread" ? "btn-primary" : "btn-outline"}`}
        >
          Unread ({messages.filter(m => m.status === "unread").length})
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`btn btn-sm ${filter === "read" ? "btn-primary" : "btn-outline"}`}
        >
          Read ({messages.filter(m => m.status === "read").length})
        </button>
        <button
          onClick={() => setFilter("replied")}
          className={`btn btn-sm ${filter === "replied" ? "btn-primary" : "btn-outline"}`}
        >
          Replied ({messages.filter(m => m.status === "replied").length})
        </button>
        <button
          onClick={() => setFilter("archived")}
          className={`btn btn-sm ${filter === "archived" ? "btn-primary" : "btn-outline"}`}
        >
          Archived ({messages.filter(m => m.status === "archived").length})
        </button>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h2 className="empty-state-title">No messages found</h2>
          <p className="empty-state-text">
            {filter === "all" 
              ? "No contact messages yet" 
              : `No ${filter} messages`}
          </p>
        </div>
      ) : (
        <div className="grid" style={{ gap: "1rem" }}>
          {filteredMessages.map((msg) => (
            <div 
              key={msg._id} 
              className="card"
              style={{ 
                cursor: "pointer",
                borderLeft: msg.status === "unread" ? "8px solid var(--error)" : "8px solid transparent"
              }}
              onClick={() => handleViewMessage(msg._id)}
            >
              <div className="flex-between">
                <div className="flex" style={{ gap: "1rem", alignItems: "center" }}>
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "50%", 
                    background: "var(--bg-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    fontWeight: "bold"
                  }}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                      {msg.name}
                      {msg.status === "unread" && (
                        <span 
                          className="badge badge-error" 
                          style={{ marginLeft: "0.75rem", fontSize: "0.7rem" }}
                        >
                          NEW
                        </span>
                      )}
                    </h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
                      {msg.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${getStatusBadge(msg.status)}`} style={{ marginBottom: "0.5rem" }}>
                    {msg.status.toUpperCase()}
                  </span>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>
                    <FiClock style={{ display: "inline", marginRight: "0.25rem" }} />
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <div className="flex gap-2" style={{ marginBottom: "0.75rem", flexWrap: "wrap" }}>
                  <span className="badge" style={{ background: "var(--bg-light)", color: "var(--text-dark)" }}>
                    <FiTag style={{ marginRight: "0.25rem" }} />
                    {getCategoryLabel(msg.category)}
                  </span>
                  <span className="badge" style={{ background: "var(--bg-light)", color: "var(--text-dark)" }}>
                    <FiMessageSquare style={{ marginRight: "0.25rem" }} />
                    {msg.subject}
                  </span>
                </div>
                <p style={{ 
                  color: "var(--text-dark)", 
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {msg.message}
                </p>
              </div>

              <div className="flex-between" style={{ marginTop: "1rem" }}>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleViewMessage(msg._id); }}
                    className="btn btn-sm btn-outline"
                  >
                    <FiEye /> View
                  </button>
                  {msg.status !== "replied" && (
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleUpdateStatus(msg._id, "replied"); 
                      }}
                      className="btn btn-sm btn-outline"
                      style={{ borderColor: "var(--success)", color: "var(--success)" }}
                    >
                      <FiCheckCircle /> Mark Replied
                    </button>
                  )}
                  {msg.status !== "archived" && (
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleUpdateStatus(msg._id, "archived"); 
                      }}
                      className="btn btn-sm btn-outline"
                    >
                      <FiArchive /> Archive
                    </button>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg._id); }}
                  className="btn btn-sm btn-outline"
                  style={{ borderColor: "var(--error)", color: "var(--error)" }}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          padding: "1rem"
        }}>
          <div style={{
            background: "white",
            borderRadius: "1rem",
            maxWidth: "800px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            border: "4px solid var(--text-dark)",
            boxShadow: "var(--shadow-brutal)"
          }}>
            <div style={{ padding: "2rem" }}>
              <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem" }}>Message Details</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="btn btn-sm btn-outline"
                >
                  ✕ Close
                </button>
              </div>

              <div style={{ 
                background: "var(--bg-light)", 
                padding: "1.5rem",
                borderRadius: "0.5rem",
                marginBottom: "1.5rem"
              }}>
                <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>FROM</p>
                    <p style={{ fontWeight: 600 }}>{selectedMessage.name}</p>
                    <p style={{ fontSize: "0.9rem" }}>{selectedMessage.email}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>STATUS</p>
                    <span className={`badge ${getStatusBadge(selectedMessage.status)}`}>
                      {selectedMessage.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>CATEGORY</p>
                    <p style={{ fontWeight: 600 }}>{getCategoryLabel(selectedMessage.category)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>RECEIVED</p>
                    <p style={{ fontWeight: 600 }}>
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>SUBJECT</p>
                  <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>{selectedMessage.subject}</p>
                </div>

                <div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>MESSAGE</p>
                  <div style={{ 
                    background: "white", 
                    padding: "1rem",
                    border: "2px solid var(--border)",
                    borderRadius: "0.5rem",
                    whiteSpace: "pre-wrap"
                  }}>
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Admin Actions</h3>
                
                <div style={{ marginBottom: "1rem" }}>
                  <label className="form-label">Admin Notes</label>
                  <textarea
                    className="form-textarea"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add private notes about this inquiry..."
                    rows="3"
                  />
                  <button 
                    onClick={handleSaveNotes}
                    className="btn btn-sm btn-primary"
                    style={{ marginTop: "0.5rem" }}
                  >
                    Save Notes
                  </button>
                </div>

                <div>
                  <label className="form-label">Reply (Email draft)</label>
                  <textarea
                    className="form-textarea"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="4"
                  />
                  <div className="flex gap-1" style={{ marginTop: "0.5rem" }}>
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}&body=${encodeURIComponent(replyText)}`;
                      }}
                    >
                      <FiSend /> Open in Email Client
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => handleUpdateStatus(selectedMessage._id, "replied")}
                    >
                      <FiCheckCircle /> Mark as Replied
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-between" style={{ marginTop: "1rem" }}>
                <button
                  onClick={() => handleDeleteMessage(selectedMessage._id)}
                  className="btn btn-outline"
                  style={{ borderColor: "var(--error)", color: "var(--error)" }}
                >
                  <FiTrash2 /> Delete Message
                </button>
                <div className="flex gap-1">
                  {selectedMessage.status !== "archived" && (
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage._id, "archived")}
                      className="btn btn-outline"
                    >
                      <FiArchive /> Archive
                    </button>
                  )}
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-primary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
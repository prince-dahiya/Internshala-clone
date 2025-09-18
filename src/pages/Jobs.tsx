import React, { useState } from "react";
import { useApplication } from "./ApplicationContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Jobs: React.FC = () => {
  const { t } = useTranslation();
  const { addApplication } = useApplication();
  const { user, subscription, setSubscription } = useAuth();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const [jobs, setJobs] = useState([
    { title: t("Software Engineer"), company: "InnovateX", location: t("Bangalore"), salary: t("8 LPA"), type: t("Onsite"), responsibilities: t("Design, develop, and maintain software applications.") },
    { title: t("Data Analyst"), company: "DataWorks", location: t("Hyderabad"), salary: t("6 LPA"), type: t("Onsite"), responsibilities: t("Analyze datasets, create dashboards, and generate insights.") },
    { title: t("Frontend Developer"), company: "PixelPro", location: t("Chennai"), salary: t("7 LPA"), type: t("Remote"), responsibilities: t("Build user interfaces using React and modern web tools.") },
    { title: t("Cloud Engineer"), company: "Cloudify", location: t("Pune"), salary: t("9 LPA"), type: t("Onsite"), responsibilities: t("Deploy and manage cloud infrastructure and services.") },
    { title: t("Backend Developer"), company: "CodeHub", location: t("Delhi"), salary: t("8.5 LPA"), type: t("Hybrid"), responsibilities: t("Develop APIs, handle databases, and manage server logic.") },
    { title: t("AI Engineer"), company: "NeuralNet Labs", location: t("Bangalore"), salary: t("12 LPA"), type: t("Onsite"), responsibilities: t("Build and deploy AI/ML models for real-world applications.") },
    { title: t("Cybersecurity Specialist"), company: "SecureIT", location: t("Mumbai"), salary: t("10 LPA"), type: t("Onsite"), responsibilities: t("Monitor systems, detect threats, and implement security policies.") },
    { title: t("DevOps Engineer"), company: "BuildOps", location: t("Hyderabad"), salary: t("9.5 LPA"), type: t("Hybrid"), responsibilities: t("Automate deployments, CI/CD pipelines, and manage infrastructure.") },
    { title: t("Mobile App Developer"), company: "Appify", location: t("Chennai"), salary: t("7.5 LPA"), type: t("Remote"), responsibilities: t("Develop Android and iOS applications using React Native.") },
  ]);

  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "",
    responsibilities: "",
  });

  const [filters, setFilters] = useState({ location: "", type: "", company: "" });

  const getNumericLimit = () => {
    if (!subscription) return 0;
    return typeof subscription.limit === "number"
      ? subscription.limit
      : Number.POSITIVE_INFINITY;
  };

  const handleApply = (role: string, company: string) => {
    if (!user) {
      alert("Please log in to apply for jobs.");
      navigate("/login");
      return;
    }
    if (!subscription) {
      alert("You need an active subscription to apply for jobs.");
      navigate("/subscription");
      return;
    }
    const now = new Date();
    const expiry = new Date(subscription.expiry);
    if (now > expiry) {
      alert("Your subscription has expired. Please renew to continue applying.");
      navigate("/subscription");
      return;
    }
    const limitNum = getNumericLimit();
    const appliedNum =
      typeof subscription.applied === "number" ? subscription.applied : 0;
    if (appliedNum >= limitNum) {
      alert("You’ve reached your job application limit.");
      navigate("/subscription");
      return;
    }
    if (subscription.limit !== "Unlimited") {
      setSubscription({ ...subscription, applied: appliedNum + 1 });
    }
    setSelectedRole(role);
    addApplication({ type: "Job", title: role, company });
    setShowForm(true);
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Your application has been submitted successfully!");
    setShowForm(false);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJobs([...jobs, newJob]);
    setNewJob({ title: "", company: "", location: "", salary: "", type: "", responsibilities: "" });
    setShowPostForm(false);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      (filters.location
        ? job.location.toLowerCase().includes(filters.location.toLowerCase())
        : true) &&
      (filters.type
        ? job.type.toLowerCase().includes(filters.type.toLowerCase())
        : true) &&
      (filters.company
        ? job.company.toLowerCase().includes(filters.company.toLowerCase())
        : true)
  );

  return (
    <div className="page-container">
      <h2 className="section-title">Job Opportunities</h2>

      <div className="internships-layout">
        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search by location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
          <input
            type="text"
            placeholder="Search by work type (Remote, Onsite, Hybrid)"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          />
          <input
            type="text"
            placeholder="Search by company"
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          />
          <button
            className="btn"
            onClick={() => setFilters({ location: "", type: "", company: "" })}
          >
            Clear Filters
          </button>
          <button
            className="btn primary-btn"
            onClick={() => setShowPostForm(true)}
          >
            Post a Job
          </button>
        </div>

        {/* Job Cards */}
        <div className="card-grid">
          {filteredJobs.map((job, index) => (
            <div key={index} className="card">
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p><strong>Work Type:</strong> {job.type}</p>
              <div>
                <strong>Responsibilities:</strong>
                <ul>
                  {job.responsibilities
                    .split(".")
                    .filter((line) => line.trim() !== "")
                    .map((line, i) => (
                      <li key={i}>
                        {line.trim()}
                      </li>
                    ))}
                </ul>
              </div>
              <button
                className="btn apply-btn"
                onClick={() => handleApply(job.title, job.company)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Apply for {selectedRole}</h3>
            <form onSubmit={handleApplicationSubmit}>
              <input type="text" placeholder="Your full name" required />
              <input type="email" placeholder="Your email address" required />
              <textarea placeholder="Write a short cover letter" required></textarea>
              <input type="file" accept=".pdf,.doc,.docx" required />
              <div className="form-actions">
                <button type="submit" className="btn apply-btn">Submit Application</button>
                <button type="button" className="btn cancel" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostForm && (
        <div className="modal-overlay">
          <div className="modal post-modal">
            <h3>Post a New Job</h3>
            <form onSubmit={handlePostSubmit}>
              <input type="text" placeholder="Job title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} required />
              <input type="text" placeholder="Company name" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} required />
              <input type="text" placeholder="Location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} required />
              <input type="text" placeholder="Salary package" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} required />
              <input type="text" placeholder="Work type (Remote/Onsite/Hybrid)" value={newJob.type} onChange={(e) => setNewJob({ ...newJob, type: e.target.value })} required />
              <textarea placeholder="Job responsibilities" value={newJob.responsibilities} onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })} required></textarea>
              <div className="form-actions">
                <button type="submit" className="btn apply-btn">Post Job</button>
                <button type="button" className="btn cancel" onClick={() => setShowPostForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;

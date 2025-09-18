import React, { useState } from "react";
import { useApplication } from "./ApplicationContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Internships: React.FC = () => {
  const { addApplication } = useApplication();
  const { user, subscription, setSubscription, resumes } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showForm, setShowForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedResume, setSelectedResume] = useState("");

  const [filters, setFilters] = useState({
    location: "",
    type: "",
    minStipend: "",
    maxStipend: "",
  });

  const [internships, setInternships] = useState([
    { title: "React Developer Intern", company: "TechCorp", location: "Remote", stipend: 10000, type: "Remote", responsibilities: "Assist in frontend development using React.js" },
    { title: "Marketing Intern", company: "Marketify", location: "Mumbai", stipend: 8000, type: "Onsite", responsibilities: "Support marketing campaigns and social media" },
    { title: "UI/UX Design Intern", company: "Creative Minds", location: "Bangalore", stipend: 12000, type: "Onsite", responsibilities: "Work on UI/UX design projects and prototypes" },
    { title: "Content Writing Intern", company: "WordSmith", location: "Remote", stipend: 7000, type: "Remote", responsibilities: "Write blogs, case studies, and product descriptions" },
    { title: "HR Intern", company: "PeopleFirst", location: "Delhi", stipend: 9000, type: "Onsite", responsibilities: "Assist with hiring and onboarding" },
    { title: "Finance Intern", company: "FinEdge", location: "Pune", stipend: 11000, type: "Onsite", responsibilities: "Prepare reports and assist with accounting" },
    { title: "Operations Intern", company: "StartUpX", location: "Remote", stipend: 8500, type: "Remote", responsibilities: "Assist operations and process management" },
    { title: "Sales Intern", company: "SellWell", location: "Hyderabad", stipend: 9500, type: "Onsite", responsibilities: "Work on lead generation and client handling" },
  ]);

  const [newInternship, setNewInternship] = useState({
    title: "",
    company: "",
    location: "",
    stipend: "",
    type: "",
    responsibilities: "",
  });

  const getNumericLimit = () => {
    if (!subscription) return 0;
    return typeof subscription.limit === "number" ? subscription.limit : Number.POSITIVE_INFINITY;
  };

  const handleApply = (role: string, company: string) => {
    if (!user) {
      alert(t("please login"));
      navigate("/login");
      return;
    }

    if (!subscription) {
      alert(t("need subscription"));
      navigate("/subscription");
      return;
    }

    const now = new Date();
    const expiry = new Date(subscription.expiry);
    if (now > expiry) {
      alert(t("subscription expired"));
      navigate("/subscription");
      return;
    }

    const limitNum = getNumericLimit();
    const appliedNum = typeof subscription.applied === "number" ? subscription.applied : 0;

    // ✅ fixed comparison
    if (appliedNum >= limitNum) {
      alert(t("limit reached"));
      navigate("/subscription");
      return;
    }

    if (subscription.limit !== "Unlimited") {
      setSubscription({
        ...subscription,
        applied: appliedNum + 1,
      });
    }

    setSelectedRole(role);
    addApplication({ type: "Internship", title: role, company });
    setShowForm(true);
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedResume) {
      alert(t("resume required"));
      return;
    }

    alert(t("application submitted"));
    setShowForm(false);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInternships([
      ...internships,
      { ...newInternship, stipend: parseInt(newInternship.stipend) },
    ]);
    setNewInternship({
      title: "",
      company: "",
      location: "",
      stipend: "",
      type: "",
      responsibilities: "",
    });
    setShowPostForm(false);
  };

  const filteredInternships = internships.filter((intern) => {
    const matchesLocation = filters.location ? intern.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
    const matchesType = filters.type ? intern.type === filters.type : true;
    const matchesMin = filters.minStipend ? intern.stipend >= parseInt(filters.minStipend) : true;
    const matchesMax = filters.maxStipend ? intern.stipend <= parseInt(filters.maxStipend) : true;
    return matchesLocation && matchesType && matchesMin && matchesMax;
  });

  return (
    <div className="page-container">
      <h2 className="section-title">{t("Internships")}</h2>
      <button className="btn primary-btn" onClick={() => setShowPostForm(true)}>
        {t("POST INTERNSHIP")}
      </button>

      <div className="internships-layout">
        {/* Filters */}
        <div className="filters">
          <h3>{t("filters")}</h3>
          <input type="text" placeholder={t("location")} value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="auth-input" />
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="auth-input">
            <option value="">{t("all_types")}</option>
            <option value="Remote">{t("remote")}</option>
            <option value="Onsite">{t("onsite")}</option>
          </select>
          <input type="number" placeholder={t("min_stipend")} value={filters.minStipend} onChange={(e) => setFilters({ ...filters, minStipend: e.target.value })} className="auth-input" />
          <input type="number" placeholder={t("max_stipend")} value={filters.maxStipend} onChange={(e) => setFilters({ ...filters, maxStipend: e.target.value })} className="auth-input" />
          <button className="btn" onClick={() => setFilters({ location: "", type: "", minStipend: "", maxStipend: "" })}>
            {t("clear_filters")}
          </button>
        </div>

        {/* Internship Cards */}
        <div className="card-grid">
          {filteredInternships.map((job, index) => (
            <div key={index} className="card">
              <h3>{job.title}</h3>
              <p>{t("company")}: {job.company}</p>
              <p>{t("location")}: {job.location}</p>
              <p>{t("stipend")}: ₹{job.stipend}/month</p>
              <p>{t("type")}: {job.type}</p>
              <p><strong>{t("responsibilities")}:</strong> {job.responsibilities}</p>
              <button className="btn apply-btn" onClick={() => handleApply(job.title, job.company)}>
                {t("apply")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("apply for")} {selectedRole}</h3>
            <form onSubmit={handleApplicationSubmit} className="form">
              <input type="text" placeholder={t("your_name")} required />
              <input type="email" placeholder={t("your_email")} required />
              <textarea placeholder={t("cover_letter")} required></textarea>

              <label>{t("upload resume")}</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={() => setSelectedResume("uploaded")} />

              <label>{t("select resume")}</label>
              <select value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)}>
                <option value="">{t("choose resume")}</option>
                {resumes.length > 0 ? (
                  resumes.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.name} - {res.qualification}
                    </option>
                  ))
                ) : (
                  <option value="">{t("no resumes saved")}</option>
                )}
              </select>

              <div className="form-actions">
                <button type="submit" className="btn">{t("submit")}</button>
                <button type="button" className="btn cancel" onClick={() => setShowForm(false)}>
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Internship Modal */}
      {showPostForm && (
        <div className="modal-overlay">
          <div className="modal post-modal">
            <h3>{t("POST INTERNSHIP")}</h3>
            <form onSubmit={handlePostSubmit} className="form">
              <input type="text" placeholder={t("internship_title")} value={newInternship.title} onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })} required />
              <input type="text" placeholder={t("company_name")} value={newInternship.company} onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })} required />
              <input type="text" placeholder={t("location")} value={newInternship.location} onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })} required />
              <input type="text" placeholder={t("stipend")} value={newInternship.stipend} onChange={(e) => setNewInternship({ ...newInternship, stipend: e.target.value })} required />
              <input type="text" placeholder={t("type_placeholder")} value={newInternship.type} onChange={(e) => setNewInternship({ ...newInternship, type: e.target.value })} required />
              <textarea placeholder={t("responsibilities")} value={newInternship.responsibilities} onChange={(e) => setNewInternship({ ...newInternship, responsibilities: e.target.value })} required></textarea>
              <div className="form-actions">
                <button type="submit" className="btn">{t("post")}</button>
                <button type="button" className="btn cancel" onClick={() => setShowPostForm(false)}>
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Internships;

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
      alert(t("please login") as string);
      navigate("/login");
      return;
    }

    if (!subscription) {
      alert(t("need subscription") as string);
      navigate("/subscription");
      return;
    }

    const now = new Date();
    const expiry = new Date(subscription.expiry);
    if (now > expiry) {
      alert(t("subscription expired") as string);
      navigate("/subscription");
      return;
    }

    const limitNum = getNumericLimit();
    const appliedNum = typeof subscription.applied === "number" ? subscription.applied : 0;

    if (appliedNum >= limitNum) {
      alert(t("limit reached") as string);
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
      alert(t("resume required") as string);
      return;
    }

    alert(t("application submitted") as string);
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
      <h2 className="section-title">{t("Internships") as string}</h2>
      <button className="btn primary-btn" onClick={() => setShowPostForm(true)}>
        {t("POST INTERNSHIP") as string}
      </button>

      <div className="internships-layout">
        {/* Filters */}
        <div className="filters">
          <h3>{t("filters") as string}</h3>
          <input type="text" placeholder={t("location") as string} value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="auth-input" />
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="auth-input">
            <option value="">{t("all_types") as string}</option>
            <option value="Remote">{t("remote") as string}</option>
            <option value="Onsite">{t("onsite") as string}</option>
          </select>
          <input type="number" placeholder={t("min_stipend") as string} value={filters.minStipend} onChange={(e) => setFilters({ ...filters, minStipend: e.target.value })} className="auth-input" />
          <input type="number" placeholder={t("max_stipend") as string} value={filters.maxStipend} onChange={(e) => setFilters({ ...filters, maxStipend: e.target.value })} className="auth-input" />
          <button className="btn" onClick={() => setFilters({ location: "", type: "", minStipend: "", maxStipend: "" })}>
            {t("clear_filters") as string}
          </button>
        </div>

        {/* Internship Cards */}
        <div className="card-grid">
          {filteredInternships.map((job, index) => (
            <div key={index} className="card">
              <h3>{job.title}</h3>
              <p>{t("company") as string}: {job.company}</p>
              <p>{t("location") as string}: {job.location}</p>
              <p>{t("stipend") as string}: ₹{job.stipend}/month</p>
              <p>{t("type") as string}: {job.type}</p>
              <p><strong>{t("responsibilities") as string}:</strong> {job.responsibilities}</p>
              <button className="btn apply-btn" onClick={() => handleApply(job.title, job.company)}>
                {t("apply") as string}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("apply for") as string} {selectedRole}</h3>
            <form onSubmit={handleApplicationSubmit} className="form">
              <input type="text" placeholder={t("your_name") as string} required />
              <input type="email" placeholder={t("your_email") as string} required />
              <textarea placeholder={t("cover_letter") as string} required></textarea>

              <label>{t("upload resume") as string}</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={() => setSelectedResume("uploaded")} />

              <label>{t("select resume") as string}</label>
              <select value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)}>
                <option value="">{t("choose resume") as string}</option>
                {resumes.length > 0 ? (
                  resumes.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.name} - {res.qualification}
                    </option>
                  ))
                ) : (
                  <option value="">{t("no resumes saved") as string}</option>
                )}
              </select>

              <div className="form-actions">
                <button type="submit" className="btn">{t("submit") as string}</button>
                <button type="button" className="btn cancel" onClick={() => setShowForm(false)}>
                  {t("cancel") as string}
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
            <h3>{t("POST INTERNSHIP") as string}</h3>
            <form onSubmit={handlePostSubmit} className="form">
              <input type="text" placeholder={t("internship_title") as string} value={newInternship.title} onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })} required />
              <input type="text" placeholder={t("company_name") as string} value={newInternship.company} onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })} required />
              <input type="text" placeholder={t("location") as string} value={newInternship.location} onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })} required />
              <input type="text" placeholder={t("stipend") as string} value={newInternship.stipend} onChange={(e) => setNewInternship({ ...newInternship, stipend: e.target.value })} required />
              <input type="text" placeholder={t("type_placeholder") as string} value={newInternship.type} onChange={(e) => setNewInternship({ ...newInternship, type: e.target.value })} required />
              <textarea placeholder={t("responsibilities") as string} value={newInternship.responsibilities} onChange={(e) => setNewInternship({ ...newInternship, responsibilities: e.target.value })} required></textarea>
              <div className="form-actions">
                <button type="submit" className="btn">{t("post") as string}</button>
                <button type="button" className="btn cancel" onClick={() => setShowPostForm(false)}>
                  {t("cancel") as string}
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

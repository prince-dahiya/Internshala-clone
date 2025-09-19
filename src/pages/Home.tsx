import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  // ✅ helper so we don’t need to cast everywhere
  const tr = (key: string) => t(key) as string;

  const handleApply = (role: string) => {
    setSelectedRole(role);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(tr("application_submitted"));
    setShowForm(false);
  };

  // === Data ===
  const internships = [
    { title: "React Developer Intern", company: "TechCorp", location: "Remote" },
    { title: "Marketing Intern", company: "Marketify", location: "Mumbai" },
    { title: "Data Science Intern", company: "DataWorks", location: "Bangalore" },
    { title: "UI/UX Design Intern", company: "Creative Minds", location: "Pune" },
    { title: "Content Writing Intern", company: "WordSmith", location: "Remote" },
    { title: "Finance Intern", company: "FinEdge", location: "Delhi" },
  ];

  const jobs = [
    { title: "Software Engineer", company: "InnovateX", location: "Hyderabad" },
    { title: "UI/UX Designer", company: "Creatify", location: "Pune" },
    { title: "Data Analyst", company: "DataWorks", location: "Bangalore" },
    { title: "Backend Developer", company: "CodeBase", location: "Remote" },
    { title: "Product Manager", company: "InnovateX", location: "Mumbai" },
  ];

  const hackathons = [
    { title: "AI Innovation Hackathon", org: "TechWorld", mode: "Online" },
    { title: "FinTech Challenge", org: "FinSolve", mode: "Delhi" },
    { title: "Hack the Future", org: "StartUpX", mode: "Remote" },
  ];

  const ideas = [
    { title: "AI-powered Resume Builder", by: "Priya Sharma" },
    { title: "Blockchain Voting System", by: "Rahul Verma" },
    { title: "Green Energy Tracker", by: "Ananya Singh" },
    { title: "Smart Study Planner", by: "Karan Mehta" },
    { title: "Campus Event App", by: "Sneha Gupta" },
  ];

  // === Search ===
  const lowerQuery = searchQuery.toLowerCase();
  const filteredInternships = internships.filter(
    (i) =>
      i.title.toLowerCase().includes(lowerQuery) ||
      i.company.toLowerCase().includes(lowerQuery) ||
      i.location.toLowerCase().includes(lowerQuery)
  );
  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(lowerQuery) ||
      j.company.toLowerCase().includes(lowerQuery) ||
      j.location.toLowerCase().includes(lowerQuery)
  );
  const filteredHackathons = hackathons.filter(
    (h) =>
      h.title.toLowerCase().includes(lowerQuery) ||
      h.org.toLowerCase().includes(lowerQuery) ||
      h.mode.toLowerCase().includes(lowerQuery)
  );
  const filteredIdeas = ideas.filter(
    (id) =>
      id.title.toLowerCase().includes(lowerQuery) ||
      id.by.toLowerCase().includes(lowerQuery)
  );

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <h1>{tr("hero_title")}</h1>
        <p>{tr("hero_subtitle")}</p>
        <div className="hero-search">
          <input
            type="text"
            placeholder={tr("search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button>{tr("search")}</button>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <section className="section">
          <h2>
            {tr("search_results")} "{searchQuery}"
          </h2>

          {/* Internships */}
          {filteredInternships.length > 0 && (
            <>
              <h3>{tr("internships")}</h3>
              <div className="card-grid">
                {filteredInternships.map((i, idx) => (
                  <div className="card" key={idx}>
                    <h3>{i.title}</h3>
                    <p>{tr("company")}: {i.company}</p>
                    <p>{tr("location")}: {i.location}</p>
                    <button onClick={() => handleApply(i.title)}>{tr("apply")}</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Jobs */}
          {filteredJobs.length > 0 && (
            <>
              <h3>{tr("jobs")}</h3>
              <div className="card-grid">
                {filteredJobs.map((j, idx) => (
                  <div className="card" key={idx}>
                    <h3>{j.title}</h3>
                    <p>{tr("company")}: {j.company}</p>
                    <p>{tr("location")}: {j.location}</p>
                    <button onClick={() => handleApply(j.title)}>{tr("apply")}</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Hackathons */}
          {filteredHackathons.length > 0 && (
            <>
              <h3>{tr("hackathons")}</h3>
              <div className="card-grid">
                {filteredHackathons.map((h, idx) => (
                  <div className="card" key={idx}>
                    <h3>{h.title}</h3>
                    <p>{tr("organized_by")}: {h.org}</p>
                    <p>{tr("mode")}: {h.mode}</p>
                    <button onClick={() => handleApply(h.title)}>{tr("register")}</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Ideas */}
          {filteredIdeas.length > 0 && (
            <>
              <h3>{tr("ideas")}</h3>
              <div className="card-grid">
                {filteredIdeas.map((id, idx) => (
                  <div className="card" key={idx}>
                    <h3>{id.title}</h3>
                    <p>{tr("by")}: {id.by}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Normal Homepage */}
      {!searchQuery && (
        <>
          <section className="section">
            <h2>{tr("Internships")}</h2>
            <div className="card-grid">
              {internships.map((i, idx) => (
                <div className="card" key={idx}>
                  <h3>{i.title}</h3>
                  <p>{tr("company")}: {i.company}</p>
                  <p>{tr("location")}: {i.location}</p>
                  <button onClick={() => handleApply(i.title)}>{tr("apply")}</button>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <h2>{tr("latest jobs")}</h2>
            <div className="card-grid">
              {jobs.map((j, idx) => (
                <div className="card" key={idx}>
                  <h3>{j.title}</h3>
                  <p>{tr("company")}: {j.company}</p>
                  <p>{tr("location")}: {j.location}</p>
                  <button onClick={() => handleApply(j.title)}>{tr("apply")}</button>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <h2>{tr("upcoming hackathons")}</h2>
            <div className="card-grid">
              {hackathons.map((h, idx) => (
                <div className="card" key={idx}>
                  <h3>{h.title}</h3>
                  <p>{tr("organized_by")}: {h.org}</p>
                  <p>{tr("mode")}: {h.mode}</p>
                  <button onClick={() => handleApply(h.title)}>{tr("register")}</button>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <h2>{tr("student_ideas")}</h2>
            <div className="card-grid">
              {ideas.map((id, idx) => (
                <div className="card" key={idx}>
                  <h3>{id.title}</h3>
                  <p>{tr("by")}: {id.by}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{tr("apply_register")} {selectedRole}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder={tr("your_name")} required />
              <input type="email" placeholder={tr("your_email")} required />
              <textarea placeholder={tr("cover_letter")} required></textarea>
              <input type="file" accept=".pdf,.doc,.docx" required />
              <div className="form-actions">
                <button type="submit" className="btn">{tr("submit")}</button>
                <button
                  type="button"
                  className="btn cancel"
                  onClick={() => setShowForm(false)}
                >
                  {tr("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

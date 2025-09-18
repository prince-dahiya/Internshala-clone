import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Idea {
  title: string;
  author: string;
  description: string;
}

const Ideas: React.FC = () => {
  const { t } = useTranslation();

  const [ideas, setIdeas] = useState<Idea[]>([
    {
      title: t("AI-powered Resume Builder"),
      author: t("Priya Sharma"),
      description: t("This project uses AI to help job seekers create professional resumes instantly."),
    },
    {
      title: t("Blockchain Voting System"),
      author: t("Rahul Verma"),
      description: t("A secure blockchain-based platform for conducting transparent elections."),
    },
    {
      title: t("Green Energy Tracker"),
      author: t("Ananya Singh"),
      description: t("Track & analyze renewable energy consumption in households and industries."),
    },
    {
      title: t("Smart Campus App"),
      author: t("Karan Mehta"),
      description: t("An app for managing campus events, assignments, and student communities."),
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [newIdea, setNewIdea] = useState<Idea>({
    title: "",
    author: "",
    description: "",
  });

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIdea.title && newIdea.author && newIdea.description) {
      setIdeas([...ideas, newIdea]);
      setNewIdea({ title: "", author: "", description: "" });
      setShowForm(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">{t("Student Ideas")}</h1>
      <p className="page-subtitle">
        {t("Explore innovative ideas submitted by students & young innovators.")}
      </p>

      <div className="card-grid">
        {ideas.map((idea, idx) => (
          <div className="card" key={idx}>
            <h2>{idea.title}</h2>
            <p>
              <strong>{t("By:")}</strong> {idea.author}
            </p>
            <p>{idea.description}</p>
          </div>
        ))}
      </div>

      {/* Button to submit new idea */}
      <div style={{ marginTop: "30px" }}>
        <button className="btn apply-btn" onClick={() => setShowForm(true)}>
          {t("+ Submit Your Idea")}
        </button>
      </div>

      {/* Add Idea Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{t("Submit a New Idea")}</h2>
            <form onSubmit={handleAddIdea}>
              <label>
                {t("Title")}
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  required
                />
              </label>
              <label>
                {t("Your Name")}
                <input
                  type="text"
                  value={newIdea.author}
                  onChange={(e) => setNewIdea({ ...newIdea, author: e.target.value })}
                  required
                />
              </label>
              <label>
                {t("Description")}
                <textarea
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  required
                ></textarea>
              </label>
              <div className="form-actions">
                <button type="submit" className="btn apply-btn">
                  {t("Add Idea")}
                </button>
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  {t("Cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ideas;

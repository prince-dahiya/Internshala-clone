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
      title: t("AI-powered Resume Builder") as string,
      author: t("Priya Sharma") as string,
      description: t(
        "This project uses AI to help job seekers create professional resumes instantly."
      ) as string,
    },
    {
      title: t("Blockchain Voting System") as string,
      author: t("Rahul Verma") as string,
      description: t(
        "A secure blockchain-based platform for conducting transparent elections."
      ) as string,
    },
    {
      title: t("Green Energy Tracker") as string,
      author: t("Ananya Singh") as string,
      description: t(
        "Track & analyze renewable energy consumption in households and industries."
      ) as string,
    },
    {
      title: t("Smart Campus App") as string,
      author: t("Karan Mehta") as string,
      description: t(
        "An app for managing campus events, assignments, and student communities."
      ) as string,
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
      <h1 className="page-title">{t("Student Ideas") as string}</h1>
      <p className="page-subtitle">
        {t("Explore innovative ideas submitted by students & young innovators.") as string}
      </p>

      <div className="card-grid">
        {ideas.map((idea, idx) => (
          <div className="card" key={idx}>
            <h2>{idea.title}</h2>
            <p>
              <strong>{t("By:") as string}</strong> {idea.author}
            </p>
            <p>{idea.description}</p>
          </div>
        ))}
      </div>

      {/* Button to submit new idea */}
      <div style={{ marginTop: "30px" }}>
        <button className="btn apply-btn" onClick={() => setShowForm(true)}>
          {t("+ Submit Your Idea") as string}
        </button>
      </div>

      {/* Add Idea Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{t("Submit a New Idea") as string}</h2>
            <form onSubmit={handleAddIdea}>
              <label>
                {t("Title") as string}
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  required
                />
              </label>
              <label>
                {t("Your Name") as string}
                <input
                  type="text"
                  value={newIdea.author}
                  onChange={(e) => setNewIdea({ ...newIdea, author: e.target.value })}
                  required
                />
              </label>
              <label>
                {t("Description") as string}
                <textarea
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  required
                ></textarea>
              </label>
              <div className="form-actions">
                <button type="submit" className="btn apply-btn">
                  {t("Add Idea") as string}
                </button>
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  {t("Cancel") as string}
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

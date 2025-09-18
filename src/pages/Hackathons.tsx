import React, { useState } from "react";
import { useApplication } from "./ApplicationContext";

interface Hackathon {
  title: string;
  organizer: string;
  mode: string;
  date: string;
}

const Hackathons: React.FC = () => {
  const { addApplication } = useApplication();

  const [hackathons, setHackathons] = useState<Hackathon[]>([
    { title: "AI Vision Hackathon", organizer: "InnovateX", mode: "Online", date: "12 Sep 2025" },
    { title: "FinTech Future Lab", organizer: "MoneyMinds", mode: "Delhi", date: "22 Sep 2025" },
    { title: "GreenTech Hack Sprint", organizer: "EcoVision", mode: "Bangalore", date: "5 Oct 2025" },
    { title: "HealthTech Innovators", organizer: "MediNext", mode: "Mumbai", date: "15 Oct 2025" },
    { title: "Blockchain Builders", organizer: "BlockForge", mode: "Hyderabad", date: "23 Oct 2025" },
    { title: "EdTech Revolution", organizer: "LearnHub", mode: "Online", date: "30 Oct 2025" },
    { title: "Smart City Challenge", organizer: "UrbanMinds", mode: "Pune", date: "7 Nov 2025" },
    { title: "Women in STEM Sprint", organizer: "TechQueens", mode: "Delhi", date: "14 Nov 2025" },
    { title: "AgriTech Innovators", organizer: "AgroTech Labs", mode: "Chennai", date: "21 Nov 2025" },
    { title: "CyberSec Hackathon", organizer: "SecureWave", mode: "Online", date: "28 Nov 2025" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showAddHackathon, setShowAddHackathon] = useState(false);

  const [newHackathon, setNewHackathon] = useState<Hackathon>({
    title: "",
    organizer: "",
    mode: "",
    date: "",
  });

  const handleAddHackathon = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHackathon.title && newHackathon.organizer && newHackathon.mode && newHackathon.date) {
      setHackathons([...hackathons, newHackathon]);
      setNewHackathon({ title: "", organizer: "", mode: "", date: "" });
      setShowAddHackathon(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Hackathons</h1>
      <p className="page-subtitle">Explore and register for upcoming hackathons</p>

      <div className="card-grid">
        {hackathons.map((hack, idx) => (
          <div className="card" key={idx}>
            <h2 style={{ textAlign: "center" }}>{hack.title}</h2>
            <p><strong>Organizer:</strong> {hack.organizer}</p>
            <p><strong>Mode:</strong> {hack.mode}</p>
            <p><strong>Date:</strong> {hack.date}</p>
            <button
              className="btn apply-btn"
              onClick={() => {
                addApplication({
                  type: "Hackathon",
                  title: hack.title,
                  company: hack.organizer,
                  date: hack.date,
                });
                setShowForm(true);
              }}
            >
              Register
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "30px" }}>
        <button className="btn apply-btn" onClick={() => setShowAddHackathon(true)}>
          Add Hackathon
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Registration Form</h2>
            <form>
              <label>Full Name<input type="text" required /></label>
              <label>Email<input type="email" required /></label>
              <label>Organization<input type="text" required /></label>
              <label>Why Join?<textarea required></textarea></label>
              <div className="form-actions">
                <button type="submit" className="btn apply-btn">Submit</button>
                <button type="button" className="btn cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddHackathon && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Hackathon</h2>
            <form onSubmit={handleAddHackathon}>
              <label>Title<input type="text" value={newHackathon.title} onChange={(e) => setNewHackathon({ ...newHackathon, title: e.target.value })} required /></label>
              <label>Organizer<input type="text" value={newHackathon.organizer} onChange={(e) => setNewHackathon({ ...newHackathon, organizer: e.target.value })} required /></label>
              <label>Mode<input type="text" value={newHackathon.mode} onChange={(e) => setNewHackathon({ ...newHackathon, mode: e.target.value })} required /></label>
              <label>Date<input type="text" value={newHackathon.date} onChange={(e) => setNewHackathon({ ...newHackathon, date: e.target.value })} required /></label>
              <div className="form-actions">
                <button type="submit" className="btn apply-btn">Add</button>
                <button type="button" className="btn cancel-btn" onClick={() => setShowAddHackathon(false)}>
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

export default Hackathons;

import React from "react";

interface InternshipProps {
  title: string;
  company: string;
  location: string;
  stipend: string;
  duration: string;
}

const InternshipCard: React.FC<InternshipProps> = ({ title, company, location, stipend, duration }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p className="company">{company}</p>
      <p>{location}</p>
      <p>Stipend: {stipend}</p>
      <p>Duration: {duration}</p>
      <button className="btn-apply">Apply Now</button>
    </div>
  );
};

export default InternshipCard;

import React from "react";

interface JobProps {
  title: string;
  company: string;
  location: string;
  salary: string;
}

const JobCard: React.FC<JobProps> = ({ title, company, location, salary }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p className="company">{company}</p>
      <p>{location}</p>
      <p>Salary: {salary}</p>
      <button className="btn-apply">Apply Now</button>
    </div>
  );
};

export default JobCard;

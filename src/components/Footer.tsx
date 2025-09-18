import React from "react";

interface FooterProps {
  currentLang: string;
}

const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  return (
    <footer className="footer">
      <div className="footer-sections">
        <div>
          <h4>Internships by places</h4>
          <ul>
            <li>Internship in India</li>
            <li>Internship in Delhi</li>
            <li>Internship in Bangalore</li>
            <li>Internship in Mumbai</li>
            <li>View all internships</li>
          </ul>
        </div>
        <div>
          <h4>Internships by Stream</h4>
          <ul>
            <li>Computer Science Internship</li>
            <li>Electronics Internship</li>
            <li>Mechanical Internship</li>
            <li>Civil Internship</li>
            <li>Marketing Internship</li>
          </ul>
        </div>
        <div>
          <h4>Jobs by Places</h4>
          <ul>
            <li>Jobs in Delhi</li>
            <li>Jobs in Mumbai</li>
            <li>Jobs in Bangalore</li>
            <li>Jobs in Pune</li>
            <li>View all jobs</li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li>About us</li>
            <li>Careers</li>
            <li>Contact us</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Shiftmate. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

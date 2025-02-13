import React from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '../../assets/aws-exports';
import { FaCalendar, FaSearch, FaStar, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Footer.css';
Amplify.configure(awsExports);



interface FooterProps {
  signOut: () => void;
  onSelectPage: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ signOut, onSelectPage }) => {
  return (
    <footer className="footer">
      <div className="footer-icons">
        <button className="footer-button" onClick={() => onSelectPage('calendar')}>
          <FaCalendar />
        </button>
        <button className="footer-button" onClick={() => onSelectPage('search')}>
          <FaSearch />
        </button>
        <button className="footer-button" onClick={() => onSelectPage('star')}>
          <FaStar />
        </button>
        <button className="footer-button" onClick={() => onSelectPage('user')}>
          <FaUser />
        </button>
        <button onClick={() => signOut && signOut()} className="footer-button">
          <FaSignOutAlt />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
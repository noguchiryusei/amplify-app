import React from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '../../assets/aws-exports';
import { FaCalendar, FaSearch, FaStar, FaPen, FaSignOutAlt } from 'react-icons/fa';
import './Footer.css';
Amplify.configure(awsExports);



interface FooterProps {
  signOut: () => void;
  onSelectPage: (page: string) => void;
  resetData?: () => void;
}

const Footer: React.FC<FooterProps> = ({ signOut, onSelectPage, resetData }) => {
  const clickFooterButton = (page: string) => {
    resetData && resetData();
    onSelectPage(page)
  }
  return (
    <footer className="footer">
      <div className="footer-icons">
        <button className="footer-button" onClick={() => clickFooterButton('pen')}>
          <FaPen />
        </button>
        <button className="footer-button" onClick={() => clickFooterButton('calendar')}>
          <FaCalendar />
        </button>
        <button className="footer-button" onClick={() => onSelectPage('search')}>
          <FaSearch />
        </button>
        <button className="footer-button" onClick={() => clickFooterButton('star')}>
          <FaStar />
        </button>
        <button onClick={() => signOut && signOut()} className="footer-button">
          <FaSignOutAlt />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
import logo from "../assets/logo.svg";
import React, { useState, useEffect } from "react";
import "./App.css";
import Footer from "../components/Footer/Footer.tsx"; 
import Searcher from "../components/Search/Search.tsx"; 
import GetNoteById from "../components/Search/ShowSearch"; 
import AddData from "../components/AddData/AddData.tsx"; 
import CalendarRender from "../components/Calendar/Calendar.tsx"; 
import "@aws-amplify/ui-react/styles.css";
import {
  Heading,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";

const App = ({ signOut }) => {
  const [currentPage, setCurrentPage] = useState('calendar');
  const [id, setId] = useState(null);
  const renderPage = () => {
    switch (currentPage) {
      case 'calendar':
        return <CalendarRender />;
      case 'star':
        return <div>star</div>;
      case 'search':
        return <Searcher onSelectPage={setCurrentPage} setId={setId}/>;
      case 'pen':
        return <AddData onSelectPage={setCurrentPage}/>;
      case 'show':
        return <GetNoteById id={id}/>;
      default:
        return <Searcher />;
    }
  };

  return (
    <View className="App">
      <Heading level={1}>My Notes App</Heading>
      {renderPage()}
      <Footer signOut={signOut ?? (() => {})} onSelectPage={setCurrentPage} />
    </View>
  );
};

export default withAuthenticator(App, { hideSignUp: true });

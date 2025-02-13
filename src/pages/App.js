import logo from "../assets/logo.svg";
import React, { useState, useEffect } from "react";
import "./App.css";
import Footer from "../components/Footer/Footer.tsx"; 
import Searcher from "../components/Search/Search.tsx"; 
import AddData from "../components/AddData/AddData.tsx"; 
import "@aws-amplify/ui-react/styles.css";
import {
  Heading,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";

const App = ({ signOut }) => {
  const [currentPage, setCurrentPage] = useState('calendar');
  const renderPage = () => {
    switch (currentPage) {
      case 'calendar':
        return <Searcher />;
      case 'star':
        return <div>star</div>;
      case 'search':
        return <div>user</div>;
      case 'pen':
        return <AddData />;
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

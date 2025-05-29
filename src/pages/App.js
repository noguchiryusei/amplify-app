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
  const [targetDate, setTargetDate] = useState("");
  const [returnData, setReturnData] = useState([]);

  const resetData = () => {
    setId(null);
    setTargetDate("");
    setReturnData([]);
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'calendar':
        return <CalendarRender onSelectPage={setCurrentPage} setId={setId} initialDateFromShow={targetDate}/>;
      case 'star':
        return <div>star</div>;
      case 'search':
        return <Searcher onSelectPage={setCurrentPage} setId={setId} setReturnData={setReturnData} returnData={returnData}/>;
      case 'pen':
        return <AddData onSelectPage={setCurrentPage}/>;
      case 'show':
        return <GetNoteById id={id} onSelectPage={setCurrentPage} setTargetDate={setTargetDate} returnData={returnData}/>;
      default:
        return <Searcher />;
    }
  };

  return (
    <View className="App">
      <Heading level={1}>My Notes App</Heading>
      {renderPage()}
      <Footer signOut={signOut ?? (() => {})} onSelectPage={setCurrentPage} resetData={resetData}/>
    </View>
  );
};

export default withAuthenticator(App, { hideSignUp: true });

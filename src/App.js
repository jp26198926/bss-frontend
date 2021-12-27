import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

//components
import AppNavBar from "./components/AppNavBar";
import AppLogin from "./components/AppLogin";
import AppToast from "./components/AppToast";

//pages
import Pages from "./pages/Pages";
import Landing from "./pages/Landing";
import ViewTicket from "./pages/viewticket/ViewTicket";
import Knowledgebase from "./pages/knowledgebase/Knowledgebase";

//form modal
import SetStatus from "./pages/ticket/SetStatus";
import AssignedTech from "./pages/ticket/AssignedTech";

function App() {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);

  document.title = settings?.appName; //change page title name

  useEffect(() => {
    //get data and save to redux
    axios.get(settings?.API_URL + "/TicketCategory").then((result) => {
      dispatch({ type: "SET_TICKET_CATEGORY", payload: result.data.result });
    });

    axios.get(settings?.API_URL + "/TicketStatus").then((result) => {
      dispatch({ type: "SET_TICKET_STATUS", payload: result.data.result });
    });
  }, []);

  return (
    <div className="App">
      <AppNavBar />

      <Container>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path=":pageName" element={<Pages />} />
          <Route
            path="ViewTicket/:id"
            element={<ViewTicket title="ViewTicket" />}
          />
          <Route
            path="Knowledgebase/:mysearch"
            element={<Knowledgebase title="Knowledgebase" />}
          />
        </Routes>
      </Container>

      {/* popup components */}
      <AssignedTech />
      <SetStatus />
      <AppLogin />
      <AppToast />
    </div>
  );
}

export default App;

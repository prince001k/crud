/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateAccount from './CreateAccount';
import Login from './Login';
import Table from './table';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/table" element={<Table />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

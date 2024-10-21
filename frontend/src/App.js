import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadXLS from './components/UploadXLS';
import SearchEmployee from './components/SearchEmployee';
import UploadEmployeeInfo from './components/UploadEmployeeInfo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/upload-xls" element={<UploadXLS />} />
        <Route path="/search-employee" element={<SearchEmployee />} />
        <Route path="/upload-employee" element={<UploadEmployeeInfo />} />
      </Routes>
    </Router>
  );
}

export default App;

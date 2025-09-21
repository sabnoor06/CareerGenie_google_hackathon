import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css';
import Dashboard from './Dashboard/Dashboard';
import Signup from './Landing_Page/Signup';
import Accounts from './DashboardComponents/Accounts';
import Customers from './DashboardComponents/Customers';
import Settings from './DashboardComponents/Settings';
import MedicalPath from './overview/MedicalPath';
import EngineeringPath from './overview/EngineeringPath';

import Overview from './overview/overview';
// import { AuthProvider } from './Auththorization';
//  import PrivateRoute from './Privateroute';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <BrowserRouter> <Routes>
    <Route path="/" element={<Signup/>}/>
    <Route path = "/dashboard" element = {<Dashboard/>}/>
    <Route path = "/Overview" element = {<Overview/>}/>
    <Route path="/GenAI" element= {<Dashboard/>} />
    <Route path="/Accounts" element={<Accounts />} />
    <Route path="/Customers" element={<Customers />} />
     <Route path="/settings" element={<Settings />} />
     <Route path="/medical-path" element={<MedicalPath />} />
     <Route path="/engineering-path" element={<EngineeringPath />} />
  </Routes>
  </BrowserRouter>
);



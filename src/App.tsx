import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Hosts from './pages/Hosts';
import HostsNewUser from './pages/HostsNewUser';
import Servers from './pages/Servers';
import ServersNewUser from './pages/ServersNewUser';
import Profiles from './pages/Profiles';
import ProfilesNewUser from './pages/ProfilesNewUser';
import Settings from './pages/Settings';
import Introduction2 from './pages/Introduction2';
import Introduction3 from './pages/Introduction3';
import Discovery from './pages/Discovery';
import DiscoveryNoNetwork from './pages/DiscoveryNoNetwork';
import NewUserDashboard from './pages/NewUserDashboard';
import TrayPopup from './pages/TrayPopup';
import NewUserTrayPopup from './pages/NewUserTrayPopup';
import NewLayout from './pages/NewLayout';
import HostNewlayout from './pages/HostNewlayout';
import EmptyDashboard from './pages/EmptyDashboard';
import ProfileLandingPage from './pages/ProfileLandingPage';
import ServerLandingPage from './pages/ServerLandingPage';
import NotFound from './pages/NotFound';
import ProfileExpiredPage from './pages/ProfileExpiredPage';
import ServerExpiredPage from './pages/ServerExpiredPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hosts" element={<Hosts />} />
        <Route path="/hosts-new-user" element={<HostsNewUser />} />
        <Route path="/servers" element={<Servers />} />
        <Route path="/servers-new-user" element={<ServersNewUser />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/profiles-new-user" element={<ProfilesNewUser />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/introduction-2" element={<Introduction2 />} />
        <Route path="/introduction-3" element={<Introduction3 />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/discovery-no-network" element={<DiscoveryNoNetwork />} />
        <Route path="/new-user-dashboard" element={<NewUserDashboard />} />
        <Route path="/tray-popup" element={<TrayPopup />} />
        <Route path="/new-user-tray-popup" element={<NewUserTrayPopup />} />
        <Route path="/new-layout" element={<NewLayout />} />
        <Route path="/host-newlayout" element={<HostNewlayout />} />
        <Route path="/empty-dashboard" element={<EmptyDashboard />} />
        <Route path="/shared-profile/:shareId" element={<ProfileLandingPage />} />
        <Route path="/shared-server/:shareId" element={<ServerLandingPage />} />
        <Route path="/shared-profile-expired" element={<ProfileExpiredPage />} />
        <Route path="/shared-server-expired" element={<ServerExpiredPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

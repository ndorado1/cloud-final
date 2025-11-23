import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DeviceList from './pages/DeviceList';
import DeviceDetails from './pages/DeviceDetails';
import AddDevice from './pages/AddDevice';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/devices" element={<DeviceList />} />
        <Route path="/devices/new" element={<AddDevice />} />
        <Route path="/devices/:id" element={<DeviceDetails />} />
        <Route path="/devices/:id/edit" element={<AddDevice />} />
      </Routes>
    </Router>
  );
}

export default App;


import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/mainPage';
import ProtectedRoute from './utilities/ProtectedRoute';
import FacePage from './pages/face';

export default function App() {

  return (
    <Routes>
      <Route path='/' element={<FacePage />}/>
      <Route
        path="/mainPage"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
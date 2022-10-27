import './app.css'
import Home from './pages/Home/Home'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Authenticate from './pages/authenticate/Authenticate';
import Navigation from './components/Shared/Navigation/Navigation';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css';

import { useSelector } from 'react-redux';


function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <ToastContainer
        theme={"dark"}
        // theme='dark'
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        <Route path='/' element={
          <Home />
        } />
        <Route
          path="/authenticate"
          element={
            <GuestRoute>
              <Authenticate />
            </GuestRoute>
          }
        />
        <Route
          path="/activate"
          element={
            <SemiPrivateRoute>
              <Activate />
            </SemiPrivateRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <PrivateRoute>
              <Rooms />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}



function GuestRoute({ children }) {
  const { isAuth } = useSelector((state) => state.auth)
  const location = useLocation()
  return isAuth ? <Navigate to="/rooms" state={{ from: location }} /> : children;
}

function SemiPrivateRoute({ children, ...rest }) {
  const { isAuth, user } = useSelector((state) => state.auth)

  const location = useLocation()
  return !isAuth ? <Navigate to="/" state={{ from: location }} /> : isAuth && !user.activated ? children : <Navigate to="/rooms" state={{ from: location }} />;
}

function PrivateRoute({ children, ...rest }) {
  const { isAuth, user } = useSelector((state) => state.auth)
  const location = useLocation()
  return !isAuth ? <Navigate to="/" state={{ from: location }} /> : isAuth && !user.activated ? <Navigate to="/activate" state={{ from: location }} /> : children;
}
export default App;

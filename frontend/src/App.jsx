import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import RecipeGenerator from "./components/Recipe";
import PrivateRoute from './routes/PrivateRoute';
import LandingPage from "./components/Landing";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipe" element={<PrivateRoute><RecipeGenerator /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;

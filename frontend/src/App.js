import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Assignments from "./pages/Assignments";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Enrollments from "./pages/Enrollments";
import Grades from "./pages/Grades";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";

function App() {
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState("login");
  const [currentPage, setCurrentPage] = useState("Dashboard");

  useEffect(() => {
    const savedUser = localStorage.getItem("lmsUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuth = (loggedUser) => {
    setUser(loggedUser);
    localStorage.setItem("lmsUser", JSON.stringify(loggedUser));
    setCurrentPage("Dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("lmsUser");
    setUser(null);
    setAuthPage("login");
  };

  if (!user) {
    return authPage === "login" ? (
      <Login onLogin={handleAuth} goToRegister={() => setAuthPage("register")} />
    ) : (
      <Register onRegister={handleAuth} goToLogin={() => setAuthPage("login")} />
    );
  }

  return (
    <div className="app-shell">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} onLogout={handleLogout} />
      {currentPage === "Dashboard" && <Dashboard user={user} />}
      {currentPage === "Courses" && <Courses />}
      {currentPage === "Users" && <Users />}
      {currentPage === "Enrollments" && <Enrollments />}
      {currentPage === "Assignments" && <Assignments />}
      {currentPage === "Grades" && <Grades />}
    </div>
  );
}

export default App;

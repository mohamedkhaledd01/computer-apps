function Navbar({ currentPage, setCurrentPage, user, onLogout }) {
  const links = ["Dashboard", "Courses", "Users"];

  return (
    <header className="navbar">
      <button className="brand" onClick={() => setCurrentPage("Dashboard")}>
        LMS
      </button>
      <nav className="nav-links">
        {links.map((link) => (
          <button
            key={link}
            className={currentPage === link ? "active" : ""}
            onClick={() => setCurrentPage(link)}
          >
            {link}
          </button>
        ))}
      </nav>
      <div className="nav-user">
        <span>{user?.name}</span>
        <span className="role">{user?.role}</span>
        <button onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Navbar;

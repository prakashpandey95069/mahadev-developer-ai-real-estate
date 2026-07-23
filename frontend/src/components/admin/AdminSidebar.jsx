import { Link } from "react-router-dom";

function AdminSidebar({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
  stats,
  onLogout,
}) {
  const menuItems = [
    {
      id: "overview",
      icon: "▦",
      label: "Overview",
    },
    {
      id: "buyers",
      icon: "♟",
      label: "Buyer Leads",
    },
    {
      id: "enquiries",
      icon: "✉",
      label: "Enquiries",
    },
    {
      id: "notifications",
      icon: "♢",
      label: "Notifications",
      count:
        stats.unreadNotifications,
    },
  ];

  const selectSection = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      <aside
        className={`admin-sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >

        <div className="admin-brand">

          <div className="admin-brand-logo">
            MD
          </div>

          <div>
            <strong>
              MAHADEV
            </strong>

            <span>
              DEVELOPER
            </span>
          </div>

        </div>

        <div className="sidebar-label">
          MANAGEMENT
        </div>

        <nav className="admin-navigation">

          {menuItems.map((item) => (
            <button
              key={item.id}
              className={
                activeSection ===
                item.id
                  ? "admin-nav-item active"
                  : "admin-nav-item"
              }
              onClick={() =>
                selectSection(
                  item.id
                )
              }
            >

              <span className="nav-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

              {item.count > 0 && (
                <span className="nav-count">
                  {item.count}
                </span>
              )}

            </button>
          ))}

        </nav>

        <div className="sidebar-label">
          PROPERTY
        </div>

        <div className="admin-navigation">

          <Link
            to="/admin"
            className="admin-nav-item"
          >
            <span className="nav-icon">
              +
            </span>

            <span>
              Add Property
            </span>
          </Link>

          <Link
            to="/properties"
            className="admin-nav-item"
          >
            <span className="nav-icon">
              ◇
            </span>

            <span>
              View Website
            </span>
          </Link>

        </div>

        <div className="sidebar-footer">

          <div className="admin-profile">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>
                Administrator
              </strong>

              <span>
                Mahadev Developer
              </span>
            </div>

          </div>

          <button
            className="admin-logout"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </aside>
    </>
  );
}

export default AdminSidebar;
import { Link } from "react-router-dom";

function DashboardHeader({
  activeSection,
  setSidebarOpen,
  refreshing,
  onRefresh,
}) {
  const titles = {
    overview: {
      title: "Dashboard Overview",
      description:
        "Monitor your properties, customers and leads.",
    },

    buyers: {
      title: "Buyer Leads",
      description:
        "Manage buyer requirements and property matches.",
    },

    enquiries: {
      title: "Customer Enquiries",
      description:
        "Track customer enquiries and follow-ups.",
    },

    notifications: {
      title: "Notifications",
      description:
        "Review automated property matching alerts.",
    },
  };

  const current =
    titles[activeSection] ||
    titles.overview;

  return (
    <header className="admin-topbar">

      <div className="topbar-left">

        <button
          className="admin-menu-button"
          onClick={() =>
            setSidebarOpen(true)
          }
        >
          ☰
        </button>

        <div>
          <h1>
            {current.title}
          </h1>

          <p>
            {current.description}
          </p>
        </div>

      </div>

      <div className="topbar-actions">

        <button
          className="refresh-dashboard"
          onClick={onRefresh}
          disabled={refreshing}
        >
          {refreshing
            ? "Refreshing..."
            : "↻ Refresh"}
        </button>

        <Link
          to="/admin"
          className="add-property-button"
        >
          + Add Property
        </Link>

      </div>

    </header>
  );
}

export default DashboardHeader;
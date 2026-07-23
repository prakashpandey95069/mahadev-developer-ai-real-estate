import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import AdminSidebar from "./AdminSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import BuyerLeadsTable from "./BuyerLeadsTable";
import EnquiriesTable from "./EnquiriesTable";
import NotificationsPanel from "./NotificationsPanel";

import "../../styles/admin-dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      /*
        Promise.allSettled use kar rahe hain.

        Agar ek API fail ho jaye to poora
        dashboard fail nahi hoga.
      */

      const results = await Promise.allSettled([
        api.get("/properties"),
        api.get("/enquiries"),
        api.get("/buyers"),
        api.get("/notifications"),
      ]);

      const [
        propertyResult,
        enquiryResult,
        buyerResult,
        notificationResult,
      ] = results;

      // Properties

      if (propertyResult.status === "fulfilled") {
        const data = propertyResult.value.data;

        setProperties(
          Array.isArray(data)
            ? data
            : data.properties || []
        );
      }

      // Enquiries

      if (enquiryResult.status === "fulfilled") {
        const data = enquiryResult.value.data;

        setEnquiries(
          Array.isArray(data)
            ? data
            : data.enquiries || []
        );
      }

      // Buyers

      if (buyerResult.status === "fulfilled") {
        const data = buyerResult.value.data;

        setBuyers(
          Array.isArray(data)
            ? data
            : data.buyers || []
        );
      }

      // Notifications

      if (notificationResult.status === "fulfilled") {
        const data = notificationResult.value.data;

        setNotifications(
          Array.isArray(data)
            ? data
            : data.notifications || []
        );
      }

      const failedRequests = results.filter(
        (result) => result.status === "rejected"
      );

      if (failedRequests.length > 0) {
        setError(
          "Some dashboard data could not be loaded."
        );
      }

    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );

      setError(
        "Dashboard data load nahi ho paya."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
  // UPDATE ENQUIRY
  // ==========================================

  const updateStatus = async (id, status) => {
    try {
      await api.patch(
        `/enquiries/${id}/status`,
        {
          status,
        }
      );

      setEnquiries((previous) =>
        previous.map((enquiry) =>
          enquiry._id === id
            ? {
                ...enquiry,
                status,
              }
            : enquiry
        )
      );

    } catch (error) {
      console.error(
        "Status Update Error:",
        error.response?.data ||
          error.message
      );

      alert(
        "Status update nahi ho paya."
      );
    }
  };

  // ==========================================
  // DELETE ENQUIRY
  // ==========================================

  const deleteEnquiry = async (id) => {
    const confirmed = window.confirm(
      "Kya aap is enquiry ko delete karna chahte hain?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/enquiries/${id}`
      );

      setEnquiries((previous) =>
        previous.filter(
          (enquiry) =>
            enquiry._id !== id
        )
      );

    } catch (error) {
      console.error(
        "Delete Error:",
        error
      );

      alert(
        "Enquiry delete nahi ho payi."
      );
    }
  };

  // ==========================================
  // MARK NOTIFICATION READ
  // ==========================================

  const markNotificationAsRead = async (id) => {
    try {
      await api.patch(
        `/notifications/${id}/read`
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

    } catch (error) {
      console.error(
        "Notification Error:",
        error
      );
    }
  };

  // ==========================================
  // CONTACT BUYER
  // ==========================================

  const contactBuyer = (buyer) => {
    let propertyDetails = "";

    if (buyer.matchedProperty) {
      propertyDetails = `

Matching Property:

Property: ${
        buyer.matchedProperty.title ||
        "Available Property"
      }

Location: ${
        buyer.matchedProperty.location ||
        buyer.location
      }

Price: ₹${Number(
        buyer.matchedProperty.price || 0
      ).toLocaleString("en-IN")}

Match Score: ${
        buyer.bestMatchScore || 0
      }%`;
    }

    const message = `
Namaste ${buyer.name} Ji,

This is Mahadev Developer.

Aapne hamari website par property requirement submit ki thi.

Requirement:

Location: ${buyer.location}
Property Type: ${buyer.propertyType}
Budget: ₹${Number(
      buyer.budget || 0
    ).toLocaleString("en-IN")}

${propertyDetails}

Property details aur site visit ke liye humse contact karein.

Thank You
Mahadev Developer
Gorakhpur
`;

    const phone = String(
      buyer.phone || ""
    )
      .replace(/\D/g, "")
      .replace(/^91/, "");

    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Kya aap logout karna chahte hain?"
    );

    if (!confirmed) return;

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "admin"
    );

    navigate("/admin/login");
  };

  // ==========================================
  // STATS
  // ==========================================

  const stats = {
    properties: properties.length,

    enquiries: enquiries.length,

    newLeads: enquiries.filter(
      (item) =>
        item.status === "New"
    ).length,

    closedDeals: enquiries.filter(
      (item) =>
        item.status === "Closed"
    ).length,

    hotLeads: buyers.filter(
      (item) =>
        item.leadType === "Hot"
    ).length,

    warmLeads: buyers.filter(
      (item) =>
        item.leadType === "Warm"
    ).length,

    matchedBuyers: buyers.filter(
      (item) =>
        item.status === "Matched"
    ).length,

    watchlistBuyers: buyers.filter(
      (item) =>
        item.status === "Watchlist"
    ).length,

    unreadNotifications:
      notifications.filter(
        (item) => !item.isRead
      ).length,
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-dashboard-loader">
        <div className="dashboard-spinner" />

        <h2>
          Loading Dashboard
        </h2>

        <p>
          Fetching latest CRM data...
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-layout">

      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        stats={stats}
        onLogout={handleLogout}
      />

      <main className="admin-main">

        <DashboardHeader
          activeSection={activeSection}
          setSidebarOpen={setSidebarOpen}
          refreshing={refreshing}
          onRefresh={() =>
            fetchDashboardData(true)
          }
        />

        {error && (
          <div className="dashboard-warning">
            <span>
              ⚠ {error}
            </span>

            <button
              onClick={() =>
                fetchDashboardData(true)
              }
            >
              Retry
            </button>
          </div>
        )}

        {activeSection ===
          "overview" && (
          <>
            <DashboardStats
              stats={stats}
            />

            <div className="dashboard-overview-grid">

              <div className="overview-panel">

                <div className="panel-heading">
                  <div>
                    <span>
                      LEAD PIPELINE
                    </span>

                    <h2>
                      Business Overview
                    </h2>
                  </div>
                </div>

                <div className="lead-summary">

                  <div>
                    <span>
                      Hot Leads
                    </span>

                    <strong>
                      {stats.hotLeads}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Warm Leads
                    </span>

                    <strong>
                      {stats.warmLeads}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Matched
                    </span>

                    <strong>
                      {stats.matchedBuyers}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Watchlist
                    </span>

                    <strong>
                      {stats.watchlistBuyers}
                    </strong>
                  </div>

                </div>

              </div>

              <div className="overview-panel">

                <div className="panel-heading">
                  <div>
                    <span>
                      QUICK SUMMARY
                    </span>

                    <h2>
                      CRM Status
                    </h2>
                  </div>
                </div>

                <div className="crm-summary">

                  <p>
                    <span>
                      Total Buyers
                    </span>

                    <strong>
                      {buyers.length}
                    </strong>
                  </p>

                  <p>
                    <span>
                      New Enquiries
                    </span>

                    <strong>
                      {stats.newLeads}
                    </strong>
                  </p>

                  <p>
                    <span>
                      Closed Deals
                    </span>

                    <strong>
                      {stats.closedDeals}
                    </strong>
                  </p>

                  <p>
                    <span>
                      Unread Alerts
                    </span>

                    <strong>
                      {
                        stats.unreadNotifications
                      }
                    </strong>
                  </p>

                </div>

              </div>

            </div>
          </>
        )}

        {activeSection ===
          "buyers" && (
          <BuyerLeadsTable
            buyers={buyers}
            contactBuyer={
              contactBuyer
            }
          />
        )}

        {activeSection ===
          "enquiries" && (
          <EnquiriesTable
            enquiries={enquiries}
            updateStatus={
              updateStatus
            }
            deleteEnquiry={
              deleteEnquiry
            }
          />
        )}

        {activeSection ===
          "notifications" && (
          <NotificationsPanel
            notifications={
              notifications
            }
            markNotificationAsRead={
              markNotificationAsRead
            }
          />
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;
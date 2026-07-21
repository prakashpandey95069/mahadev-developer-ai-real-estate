import { useEffect, useState } from "react";
import api from "../services/api";
function AdminDashboard() {
  // ==========================================
  // STATES
  // ==========================================

  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH ALL DASHBOARD DATA
  // ==========================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        propertyResponse,
        enquiryResponse,
        buyerResponse,
        notificationResponse,
      ] = await Promise.all([
        api.get("/properties"),

        api.get("/enquiries"),

        api.get("/buyers"),

        api.get("/notifications"),
      ]);

      // Properties
      setProperties(
        Array.isArray(propertyResponse.data)
          ? propertyResponse.data
          : propertyResponse.data.properties || [],
      );

      // Enquiries
      setEnquiries(
        Array.isArray(enquiryResponse.data)
          ? enquiryResponse.data
          : enquiryResponse.data.enquiries || [],
      );

      // Buyer Requirements
      setBuyers(buyerResponse.data.buyers || []);

      // Notifications
      setNotifications(notificationResponse.data.notifications || []);
    } catch (error) {
      console.log("Dashboard Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RUN FETCH
  // ==========================================

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // UPDATE ENQUIRY STATUS
  // ==========================================

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/enquiries/${id}/status`, { status });

      setEnquiries((previousEnquiries) =>
        previousEnquiries.map((enquiry) =>
          enquiry._id === id
            ? {
                ...enquiry,
                status,
              }
            : enquiry,
        ),
      );
    } catch (error) {
      console.log("Status Update Error:", error);

      alert("Status update nahi ho paya.");
    }
  };

  // ==========================================
  // DELETE ENQUIRY
  // ==========================================

  const deleteEnquiry = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap is enquiry ko delete karna chahte hain?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/enquiries/${id}`);
      setEnquiries((previousEnquiries) =>
        previousEnquiries.filter((enquiry) => enquiry._id !== id),
      );
    } catch (error) {
      console.log("Delete Error:", error);

      alert("Enquiry delete nahi ho payi.");
    }
  };

  // ==========================================
  // MARK NOTIFICATION AS READ
  // ==========================================

  const markNotificationAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );
    } catch (error) {
      console.log("Notification Error:", error);
    }
  };

  // ==========================================
  // WHATSAPP BUYER
  // ==========================================

  const contactBuyer = (buyer) => {
    let propertyDetails = "";

    if (buyer.matchedProperty) {
      propertyDetails = `

We found a matching property for you:

Property: ${buyer.matchedProperty.title || "Available Property"}

Location: ${buyer.matchedProperty.location || buyer.location}

Price: ₹${Number(buyer.matchedProperty.price || 0).toLocaleString("en-IN")}

Match Score: ${buyer.bestMatchScore || 0}%`;
    }

    const message = `
Namaste ${buyer.name} Ji,

This is Mahadev Developer.

Aapne hamari website par property requirement submit ki thi.

Requirement Details:

Location: ${buyer.location}
Property Type: ${buyer.propertyType}
Budget: ₹${Number(buyer.budget).toLocaleString("en-IN")}
${propertyDetails}

Property ki complete details aur site visit ke liye humse contact karein.

Thank You
Mahadev Developer
Gorakhpur
`;

    // Remove spaces and +91 if already present
    const cleanPhone = String(buyer.phone)
      .replace(/\D/g, "")
      .replace(/^91/, "");

    const whatsappURL = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappURL, "_blank");
  };

  // ==========================================
  // DASHBOARD CALCULATIONS
  // ==========================================

  const newLeads = enquiries.filter(
    (enquiry) => enquiry.status === "New",
  ).length;

  const closedDeals = enquiries.filter(
    (enquiry) => enquiry.status === "Closed",
  ).length;

  const hotLeads = buyers.filter((buyer) => buyer.leadType === "Hot").length;

  const warmLeads = buyers.filter((buyer) => buyer.leadType === "Warm").length;

  const watchlistBuyers = buyers.filter(
    (buyer) => buyer.status === "Watchlist",
  ).length;

  const matchedBuyers = buyers.filter(
    (buyer) => buyer.status === "Matched",
  ).length;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-dashboard">
      {/* ======================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">
        <div>
          <p>MAHADEV DEVELOPER</p>

          <h1>Admin CRM Dashboard</h1>

          <span>Manage properties, buyers, enquiries and smart matches.</span>
        </div>

        <a href="/admin" className="dashboard-add-btn">
          + Add Property
        </a>
      </div>

      {/* ======================================
          MAIN STATS
      ====================================== */}

      <div className="dashboard-stats">
        <div className="stat-card">
          <span>Properties</span>

          <h2>{properties.length}</h2>

          <p>Total listed properties</p>
        </div>

        <div className="stat-card">
          <span>Enquiries</span>

          <h2>{enquiries.length}</h2>

          <p>Total customer enquiries</p>
        </div>

        <div className="stat-card">
          <span>New Leads</span>

          <h2>{newLeads}</h2>

          <p>Waiting for response</p>
        </div>

        <div className="stat-card">
          <span>Closed</span>

          <h2>{closedDeals}</h2>

          <p>Successfully closed leads</p>
        </div>
      </div>

      {/* ======================================
          AUTOMATION STATS
      ====================================== */}

      <div className="dashboard-stats automation-stats">
        <div className="stat-card">
          <span>🔥 Hot Leads</span>

          <h2>{hotLeads}</h2>

          <p>High priority buyers</p>
        </div>

        <div className="stat-card">
          <span>👀 Watchlist</span>

          <h2>{watchlistBuyers}</h2>

          <p>Waiting for property</p>
        </div>

        <div className="stat-card">
          <span>🎯 Matched</span>

          <h2>{matchedBuyers}</h2>

          <p>Buyers with strong matches</p>
        </div>

        <div className="stat-card">
          <span>🔔 Match Alerts</span>

          <h2>{unreadNotifications}</h2>

          <p>Unread notifications</p>
        </div>
      </div>

      {/* ======================================
          BUYER LEADS
      ====================================== */}

      <div className="dashboard-section">
        <div className="dashboard-section-title">
          <div>
            <h2>Smart Buyer Leads</h2>

            <p>Buyer requirements, lead scores and property matches.</p>
          </div>

          <div>Total Buyers: {buyers.length}</div>
        </div>

        {buyers.length === 0 ? (
          <div className="no-enquiries">
            <h3>No buyer requirements yet</h3>

            <p>Requirements submitted from Find Property will appear here.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="enquiry-table">
              <thead>
                <tr>
                  <th>Buyer</th>

                  <th>Requirement</th>

                  <th>Budget</th>

                  <th>Lead</th>

                  <th>Status</th>

                  <th>Match</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {buyers.map((buyer) => (
                  <tr key={buyer._id}>
                    {/* BUYER */}

                    <td>
                      <strong>{buyer.name}</strong>

                      <small>{buyer.phone}</small>
                    </td>

                    {/* REQUIREMENT */}

                    <td>
                      <strong>{buyer.propertyType}</strong>

                      <small>{buyer.location}</small>

                      <small>
                        {buyer.minArea || 0}
                        {" - "}
                        {buyer.maxArea || "Any"}
                        {" Sq. Ft."}
                      </small>
                    </td>

                    {/* BUDGET */}

                    <td>₹{Number(buyer.budget).toLocaleString("en-IN")}</td>

                    {/* LEAD TYPE */}

                    <td>
                      <span
                        className={`lead-badge lead-${(
                          buyer.leadType || "Cold"
                        ).toLowerCase()}`}
                      >
                        {buyer.leadType || "Cold"}
                      </span>

                      <small>
                        Score: {buyer.leadScore || 0}
                        /100
                      </small>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={`buyer-status buyer-${(
                          buyer.status || "New"
                        ).toLowerCase()}`}
                      >
                        {buyer.status || "New"}
                      </span>
                    </td>

                    {/* MATCH */}

                    <td>
                      {buyer.bestMatchScore > 0 ? (
                        <div className="dashboard-match">
                          <strong>{buyer.bestMatchScore}% Match</strong>

                          {buyer.matchedProperty && (
                            <small>{buyer.matchedProperty.title}</small>
                          )}
                        </div>
                      ) : (
                        <span>Waiting for match</span>
                      )}
                    </td>

                    {/* ACTION */}

                    <td>
                      <button
                        className="dashboard-whatsapp"
                        onClick={() => contactBuyer(buyer)}
                      >
                        WhatsApp
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================
          NOTIFICATIONS
      ====================================== */}

      <div className="dashboard-section">
        <div className="dashboard-section-title">
          <div>
            <h2>Automation Notifications</h2>

            <p>New buyers and automatic property match alerts.</p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="no-enquiries">
            <h3>No notifications yet</h3>

            <p>Automatic match notifications will appear here.</p>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-card ${
                  notification.isRead
                    ? "notification-read"
                    : "notification-unread"
                }`}
              >
                <div>
                  <span className="notification-type">{notification.type}</span>

                  <h3>{notification.title}</h3>

                  <p>{notification.message}</p>

                  {notification.buyer && (
                    <small>Buyer: {notification.buyer.name}</small>
                  )}

                  {notification.property && (
                    <small>Property: {notification.property.title}</small>
                  )}
                </div>

                {!notification.isRead && (
                  <button
                    onClick={() => markNotificationAsRead(notification._id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================
          CUSTOMER ENQUIRIES
      ====================================== */}

      <div className="dashboard-section">
        <div className="dashboard-section-title">
          <div>
            <h2>Customer Enquiries</h2>

            <p>Manage customer leads and follow-ups.</p>
          </div>
        </div>

        {enquiries.length === 0 ? (
          <div className="no-enquiries">
            <h3>No enquiries yet</h3>

            <p>Customer enquiries will automatically appear here.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="enquiry-table">
              <thead>
                <tr>
                  <th>Customer</th>

                  <th>Property</th>

                  <th>Location</th>

                  <th>Status</th>

                  <th>Contact</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={enquiry._id}>
                    <td>
                      <strong>{enquiry.name}</strong>

                      <small>{enquiry.phone}</small>
                    </td>

                    <td>{enquiry.propertyType}</td>

                    <td>{enquiry.location}</td>

                    <td>
                      <select
                        className={`status-select status-${(
                          enquiry.status || "New"
                        )
                          .toLowerCase()
                          .replace(" ", "-")}`}
                        value={enquiry.status}
                        onChange={(e) =>
                          updateStatus(enquiry._id, e.target.value)
                        }
                      >
                        <option value="New">New</option>

                        <option value="Contacted">Contacted</option>

                        <option value="Site Visit">Site Visit</option>

                        <option value="Negotiation">Negotiation</option>

                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td>
                      <div className="contact-actions">
                        <a
                          href={`tel:${enquiry.phone}`}
                          className="dashboard-call"
                        >
                          Call
                        </a>

                        <a
                          href={`https://wa.me/91${String(enquiry.phone)
                            .replace(/\D/g, "")
                            .replace(/^91/, "")}?text=${encodeURIComponent(
                            `Hello ${enquiry.name}, this is Mahadev Developer regarding your ${enquiry.propertyType} enquiry.`,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="dashboard-whatsapp"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </td>

                    <td>
                      <button
                        className="delete-enquiry"
                        onClick={() => deleteEnquiry(enquiry._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================
          AUTOMATION SUMMARY
      ====================================== */}

      <div className="dashboard-section">
        <div className="dashboard-section-title">
          <div>
            <h2>Property Automation Status</h2>

            <p>Current status of your automated matching system.</p>
          </div>
        </div>

        <div className="automation-summary">
          <div>
            <span>Total Buyer Leads</span>

            <strong>{buyers.length}</strong>
          </div>

          <div>
            <span>Hot Leads</span>

            <strong>{hotLeads}</strong>
          </div>

          <div>
            <span>Warm Leads</span>

            <strong>{warmLeads}</strong>
          </div>

          <div>
            <span>Watchlist</span>

            <strong>{watchlistBuyers}</strong>
          </div>

          <div>
            <span>Successful Matches</span>

            <strong>{matchedBuyers}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

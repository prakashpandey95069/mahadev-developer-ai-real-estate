function NotificationsPanel({
  notifications,
  markNotificationAsRead,
}) {
  return (
    <section className="admin-content-card">

      <div className="content-card-header">

        <div>
          <span>
            AUTOMATION
          </span>

          <h2>
            Notifications
          </h2>

          <p>
            Property matching and
            buyer activity alerts.
          </p>
        </div>

      </div>

      {notifications.length === 0 ? (
        <div className="admin-empty-state">

          <div>♢</div>

          <h3>
            No notifications
          </h3>

          <p>
            New automatic alerts
            will appear here.
          </p>

        </div>
      ) : (
        <div className="admin-notification-list">

          {notifications.map(
            (notification) => (

              <article
                key={
                  notification._id
                }
                className={`admin-notification ${
                  notification.isRead
                    ? "read"
                    : "unread"
                }`}
              >

                <div className="notification-indicator" />

                <div className="notification-content">

                  <span>
                    {notification.type ||
                      "Notification"}
                  </span>

                  <h3>
                    {
                      notification.title
                    }
                  </h3>

                  <p>
                    {
                      notification.message
                    }
                  </p>

                  {notification.buyer && (
                    <small>
                      Buyer:{" "}
                      {
                        notification
                          .buyer.name
                      }
                    </small>
                  )}

                  {notification.property && (
                    <small>
                      Property:{" "}
                      {
                        notification
                          .property.title
                      }
                    </small>
                  )}

                </div>

                {!notification.isRead && (
                  <button
                    onClick={() =>
                      markNotificationAsRead(
                        notification._id
                      )
                    }
                  >
                    Mark Read
                  </button>
                )}

              </article>

            )
          )}

        </div>
      )}

    </section>
  );
}

export default NotificationsPanel;

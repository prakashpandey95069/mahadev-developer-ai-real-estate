function EnquiriesTable({
  enquiries,
  updateStatus,
  deleteEnquiry,
}) {
  return (
    <section className="admin-content-card">

      <div className="content-card-header">

        <div>
          <span>
            CUSTOMER CRM
          </span>

          <h2>
            Customer Enquiries
          </h2>

          <p>
            Track customer communication
            and deal progress.
          </p>
        </div>

        <div className="record-count">
          {enquiries.length} Enquiries
        </div>

      </div>

      {enquiries.length === 0 ? (
        <div className="admin-empty-state">

          <div>✉</div>

          <h3>
            No enquiries
          </h3>

          <p>
            Customer enquiries will
            appear here.
          </p>

        </div>
      ) : (
        <div className="admin-table-wrapper">

          <table className="admin-data-table">

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

              {enquiries.map(
                (enquiry) => (

                  <tr
                    key={
                      enquiry._id
                    }
                  >

                    <td>
                      <div className="table-primary">
                        {enquiry.name}
                      </div>

                      <div className="table-secondary">
                        {enquiry.phone}
                      </div>
                    </td>

                    <td>
                      {
                        enquiry.propertyType
                      }
                    </td>

                    <td>
                      {enquiry.location}
                    </td>

                    <td>

                      <select
                        className="admin-status-select"
                        value={
                          enquiry.status ||
                          "New"
                        }
                        onChange={(e) =>
                          updateStatus(
                            enquiry._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="New">
                          New
                        </option>

                        <option value="Contacted">
                          Contacted
                        </option>

                        <option value="Site Visit">
                          Site Visit
                        </option>

                        <option value="Negotiation">
                          Negotiation
                        </option>

                        <option value="Closed">
                          Closed
                        </option>
                      </select>

                    </td>

                    <td>

                      <div className="table-contact-actions">

                        <a
                          href={`tel:${enquiry.phone}`}
                          className="table-call-button"
                        >
                          Call
                        </a>

                        <a
                          href={`https://wa.me/91${String(
                            enquiry.phone
                          )
                            .replace(
                              /\D/g,
                              ""
                            )
                            .replace(
                              /^91/,
                              ""
                            )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="table-whatsapp-button"
                        >
                          WhatsApp
                        </a>

                      </div>

                    </td>

                    <td>
                      <button
                        className="table-delete-button"
                        onClick={() =>
                          deleteEnquiry(
                            enquiry._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>
      )}

    </section>
  );
}

export default EnquiriesTable;
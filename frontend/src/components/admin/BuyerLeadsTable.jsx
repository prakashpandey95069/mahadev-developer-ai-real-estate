function BuyerLeadsTable({
  buyers,
  contactBuyer,
}) {
  return (
    <section className="admin-content-card">

      <div className="content-card-header">

        <div>
          <span>
            CRM LEADS
          </span>

          <h2>
            Smart Buyer Leads
          </h2>

          <p>
            Buyer requirements and
            automatic property matches.
          </p>
        </div>

        <div className="record-count">
          {buyers.length} Buyers
        </div>

      </div>

      {buyers.length === 0 ? (
        <div className="admin-empty-state">
          <div>♟</div>

          <h3>
            No buyer leads
          </h3>

          <p>
            New buyer requirements
            will appear here.
          </p>
        </div>
      ) : (
        <div className="admin-table-wrapper">

          <table className="admin-data-table">

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

                  <td>
                    <div className="table-primary">
                      {buyer.name}
                    </div>

                    <div className="table-secondary">
                      {buyer.phone}
                    </div>
                  </td>

                  <td>
                    <div className="table-primary">
                      {buyer.propertyType}
                    </div>

                    <div className="table-secondary">
                      {buyer.location}
                    </div>

                    <div className="table-secondary">
                      {buyer.minArea || 0}
                      {" - "}
                      {buyer.maxArea ||
                        "Any"}{" "}
                      Sq. Ft.
                    </div>
                  </td>

                  <td>
                    ₹
                    {Number(
                      buyer.budget || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td>
                    <span
                      className={`lead-badge lead-${(
                        buyer.leadType ||
                        "cold"
                      ).toLowerCase()}`}
                    >
                      {buyer.leadType ||
                        "Cold"}
                    </span>

                    <div className="table-secondary">
                      Score:{" "}
                      {buyer.leadScore ||
                        0}
                      /100
                    </div>
                  </td>

                  <td>
                    <span className="table-status">
                      {buyer.status ||
                        "New"}
                    </span>
                  </td>

                  <td>

                    {buyer.bestMatchScore >
                    0 ? (
                      <div className="match-result">

                        <strong>
                          {
                            buyer.bestMatchScore
                          }
                          % Match
                        </strong>

                        {buyer.matchedProperty && (
                          <span>
                            {
                              buyer
                                .matchedProperty
                                .title
                            }
                          </span>
                        )}

                      </div>
                    ) : (
                      <span className="waiting-match">
                        Waiting
                      </span>
                    )}

                  </td>

                  <td>
                    <button
                      className="table-whatsapp-button"
                      onClick={() =>
                        contactBuyer(
                          buyer
                        )
                      }
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

    </section>
  );
}

export default BuyerLeadsTable;
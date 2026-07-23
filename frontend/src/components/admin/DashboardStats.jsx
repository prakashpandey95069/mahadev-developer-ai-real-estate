function DashboardStats({
  stats,
}) {
  const cards = [
    {
      title: "Properties",
      value: stats.properties,
      description:
        "Active property listings",
      icon: "⌂",
    },
    {
      title: "Buyer Leads",
      value:
        stats.hotLeads +
        stats.warmLeads,
      description:
        "Active qualified buyers",
      icon: "♟",
    },
    {
      title: "New Enquiries",
      value: stats.newLeads,
      description:
        "Waiting for follow-up",
      icon: "✉",
    },
    {
      title: "Closed Deals",
      value: stats.closedDeals,
      description:
        "Successfully completed",
      icon: "✓",
    },
  ];

  return (
    <section className="admin-stat-grid">

      {cards.map((card) => (
        <article
          className="admin-stat-card"
          key={card.title}
        >

          <div className="stat-card-top">

            <div className="stat-card-icon">
              {card.icon}
            </div>

            <span>
              {card.title}
            </span>

          </div>

          <strong className="stat-value">
            {card.value}
          </strong>

          <p>
            {card.description}
          </p>

        </article>
      ))}

    </section>
  );
}

export default DashboardStats;
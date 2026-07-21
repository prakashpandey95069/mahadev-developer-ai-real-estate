function Contact() {
  return (
    <div className="contact-page">
      <p className="section-label">CONTACT US</p>

      <h1>Let's Find Your Property</h1>

      <p>
        Contact Mahadev Developer for buying, selling and property
        investment opportunities.
      </p>

      <div className="contact-grid">

        {/* Phone */}
        <div className="contact-card">
          <h3>📞 Phone</h3>

          <a href="tel:+919935926414">
            +91 99359 26414
          </a>
        </div>

        {/* Email */}
        <div className="contact-card">
          <h3>✉️ Email</h3>

          <a href="arunpandey1998@gmail.com">
            arunpandey1998@gmail.com
          </a>
        </div>

        {/* Location */}
        <div className="contact-card">
          <h3>📍 Location</h3>

          <p>
            Gorakhpur, Uttar Pradesh - 273007
          </p>
        </div>

        {/* WhatsApp */}
        <div className="contact-card">
          <h3>💬 WhatsApp</h3>

          <a
            href={`https://wa.me/919935926414?text=${encodeURIComponent(
              "Namaste Mahadev Developer, mujhe property ke baare mein jankari chahiye."
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            Chat With Us
          </a>
        </div>

      </div>
    </div>
  );
}

export default Contact;
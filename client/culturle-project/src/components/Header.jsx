function Header() {
  return (
    <header className="heading">
      {" "}
      <h1 className="toolbar">Nationwise</h1>
      <div className="header-actions">
        <div className="info-wrap" aria-label="How to play">
          <span className="info-icon">i</span>
          <div className="info-tooltip">
            Use the hints to guess the correct nation wisely.
          </div>
        </div>
        <button className="feedback-btn">Criticise Me!</button>
      </div>
    </header>
  );
}

export default Header;

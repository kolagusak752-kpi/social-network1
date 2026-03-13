import "./HomePage.css"
export default function HomePage() {
    return (
<div className="app-layout">
  {/* Левая панель: Навигация */}
  <aside className="navigation-panel">
    <header className="panel-header">
      <div className="menu-toggle">☰</div>
      <input type="text" placeholder="Пошук..." className="search-input" />
    </header>
    
    <nav className="menu-list">
      <a href="/home" className="menu-item active">
        <div className="icon-box primary">🏠</div>
        <span className="item-label">Стрічка</span>
      </a>
      <a href="/friends" className="menu-item">
        <div className="icon-box secondary">👥</div>
        <span className="item-label">Друзі</span>
      </a>
    </nav>
  </aside>

  {/* Основная область */}
  <main className="content-area">
    <header className="top-bar">
      <div className="top-bar-info">
        <h3 className = "main-title">Головна</h3>
        <span>124 нових записи</span>
      </div>
    </header>

    <section className="scroll-container">
      <div className="feed-wrapper">
        <article className="content-card">
          <header className="card-header">
            <div className="user-avatar">JD</div>
            <div className="user-meta">
              <span className="username">Джон Доу</span>
              <span className="post-date">15:42</span>
            </div>
          </header>
          <div className="card-body">
            <p>Тепер класи називаються нормально. Чиста логіка, ніякого зайвого брендингу. 🚀</p>
          </div>
          <footer className="card-footer">
            <button className="action-btn">❤️ 42</button>
            <button className="action-btn">💬 5</button>
          </footer>
        </article>
      </div>
    </section>
  </main>
</div>
    )
}
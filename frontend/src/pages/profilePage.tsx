import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Grid, Bookmark, Settings, Edit3 } from 'lucide-react';

export default function ProfilePage() {

  const user = {
    username: "user_name",
    fullName: "Имя Пользователя",
    bio: "Software Engineering Student | Building something great 🚀",
    stats: {
      posts: 0,
      followers: 0,
      following: 0
    }
  };

  return (
    <div className="profile-layout">
      <Header />

      <main className="profile-container">
        

        <section className="profile-info-section">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-placeholder"></div>
          </div>

          <div className="profile-details">
            <div className="profile-action-row">
              <h2 className="profile-display-name">{user.username}</h2>
              <button className="profile-btn">
                <Edit3 size={16} />
                Редактировать
              </button>
              <button className="profile-btn-icon">
                <Settings size={20} />
              </button>
            </div>

            <div className="profile-stats-row">
              <div className="stat"><span className="stat-count">{user.stats.posts}</span> публикаций</div>
              <div className="stat"><span className="stat-count">{user.stats.followers}</span> подписчиков</div>
              <div className="stat"><span className="stat-count">{user.stats.following}</span> подписок</div>
            </div>

            <div className="profile-bio-content">
              <div className="real-name">{user.fullName}</div>
              <div className="bio-text">{user.bio}</div>
            </div>
          </div>
        </section>


        <nav className="profile-nav-tabs">
          <div className="tab active">
            <Grid size={16} />
            <span>Публикации</span>
          </div>
          <div className="tab">
            <Bookmark size={16} />
            <span>Сохраненное</span>
          </div>
        </nav>


        <section className="profile-posts-grid">

          <div className="empty-grid-item"></div>
          <div className="empty-grid-item"></div>
          <div className="empty-grid-item"></div>
          <div className="empty-grid-item"></div>
          <div className="empty-grid-item"></div>
          <div className="empty-grid-item"></div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
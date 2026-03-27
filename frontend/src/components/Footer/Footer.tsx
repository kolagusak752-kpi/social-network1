import { Home, Search, Plus, Heart, User } from 'lucide-react';


export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-icon" title="Главная">
          <Home />
        </div>

        <div className="footer-icon" title="Поиск">
          <Search />
        </div>

        <div className="footer-add-btn" title="Создать пост">
          <Plus size={28} />
        </div>

        <div className="footer-icon" title="Уведомления">
          <Heart />
        </div>

        <div className="footer-icon" title="Профиль">
          <User />
        </div>

      </div>
    </footer>
  );
};
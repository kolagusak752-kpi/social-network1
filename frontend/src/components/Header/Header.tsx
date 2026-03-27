import { Link } from "react-router-dom";
import { Home, MessageCircle, Search, User, Plus } from "lucide-react";

export const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">SocioNet</div>

        <div className="header-search">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Поиск" className="search-input" />
        </div>

        <nav className="header-nav">
           <div className="footer-add-btn" title="Создать пост">
              <Plus size={28} />
            </div>
          <div className="nav-icon" title="Главная">
            <Home />
          </div>
          <div className="nav-icon" title="Сообщения">
            <MessageCircle />
          </div>
          <div className="nav-icon" title="Профиль">
            <Link className="nav-link" to="/profile">
              <User />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

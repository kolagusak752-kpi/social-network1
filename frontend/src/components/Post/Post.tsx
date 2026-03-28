import { Heart, MessageCircle, Send, MoreHorizontal, Bookmark } from 'lucide-react';


export const Post = () => {
  const usernamePlaceholder = "user_name";
  const likesPlaceholder = "1,234";
  const captionPlaceholder = "Тут буде опис вашої публікації. Чистий, красивий та структурований. #socionet #react";
  const timePlaceholder = "3 ГОДИНИ ТОМУ";

  return (
    <article className="post-card">
      

      <div className="post-header">

        <div className="post-avatar-placeholder"></div>
        <span className="post-username">{usernamePlaceholder}</span>
        <button className="post-more-btn">
          <MoreHorizontal size={20} />
        </button>
      </div>


      <div className="post-image-container">
        <img 
          src="https://placehold.co/600x600/1e293b/334155.png?text=Image" 
          alt="Post content placeholder" 
          className="post-image" 
        />
      </div>

    
      <div className="post-actions">
        <div className="post-actions-left">
          <button className="action-btn-icon" title="Лайк">
            <Heart size={24} />
          </button>
          <button className="action-btn-icon" title="Коментувати">
            <MessageCircle size={24} />
          </button>
          <button className="action-btn-icon" title="Поділитися">
            <Send size={24} />
          </button>
        </div>
        <button className="action-btn-icon" title="Зберегти">
          <Bookmark size={24} />
        </button>
      </div>

      <div className="post-likes">{likesPlaceholder} позначок "Подобається"</div>
      
      <div className="post-caption">
        <span className="post-username">{usernamePlaceholder}</span>
        {captionPlaceholder}
      </div>
      
      <div className="post-time">{timePlaceholder}</div>
      
    </article>
  );
};
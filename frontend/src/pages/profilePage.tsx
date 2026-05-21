import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { User } from "../types/interfaces";
import { usersApi } from "../api/users";
import { Heart, MessageCircle } from "lucide-react";

export default function ProfilePage() {
  const { userId } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [isPostClicked, setIsPostClicked] = useState<boolean>(false);
  const [clickedPost, setClickedPost] = useState<any>(null);
  useEffect(() => {
    if (!userId) return;
    usersApi.getProfile(userId).then(setUserData).catch(console.log);
  }, [userId]);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPostClicked(false);
        setClickedPost(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  },[]);
  return (
    <div className="main-wrapper-profile">
      {isPostClicked && (
        <div className="post-clicked-wrapper">
          <div className="post-container">
            <div className="post-user-info">
              <div className="post-user-avatar">
                <img src={userData?.avatars?.url} className="avatar-img"></img>
              </div>
              <p className="post-user-name">{userData?.username}</p>
            </div>
            <div className="post-image-wrapper">
              <img
                className="post-image"
                src={
                   clickedPost?.media?.length > 0
                    ? clickedPost.media[0].url
                    : ""
                }
                alt="Post"
              />
            </div>
            <div className="post-desc">
              {clickedPost?.description}
            </div>
            <div className="like-comment">
              <button className="like">
                <Heart className="heart-icon" />
              </button>
              <button className="comment">
                <MessageCircle className="comment-icon" />
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="info-block">
        <div className="avatar-image">
          <img src={userData?.avatars?.url} alt="Avatar" />
        </div>
        <div className="user-info">
          <p>{userData?.username}</p>
          <p className="bio">{userData?.bio}</p>
        </div>
      </section>
      <section className="posts-grid">
        {userData?.posts.map((post) => (
          <div
            className="one-post"
            onClick={() => {
              setIsPostClicked(true);
              setClickedPost(post)
            }}
          >
            <img
              className="profile-post-image"
              src={post.media.length > 0 ? post.media[0].url : ""}
            ></img>
          </div>
        ))}
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { User } from "../types/interfaces";
import { usersApi } from "../api/users";

export default function ProfilePage() {
  const { userId } = useParams();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (!userId) return;
    usersApi.getProfile(userId)
      .then(setUserData)
      .catch(console.log);
  }, [userId]);

  return (
    <div className="main-wrapper-profile">
      <section className="info-block">
        <div className="avatar-image">
          <img src={userData?.avatar}></img>
        </div>
        <div className="user-info">
          <p>{userData?.username}</p>
          <p className="bio">{userData?.bio}</p>
        </div>
      </section>
      <section className="posts"></section>
    </div>
  );
}

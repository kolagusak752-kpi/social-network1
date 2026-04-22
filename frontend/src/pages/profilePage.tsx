import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { User } from "../types/interfaces";
export default function ProfilePage() {
  const { accessToken } = useAuth();
  const { userId } = useParams();
  const [userData, setUserData] = useState<User | null>(null)
  useEffect(() => {
    async function getUser() {
      try{
      const res = await fetch(`/api/users/profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setUserData(data)
    } catch(e) {
      console.log(e)
    }
  }
      getUser()
  },[userId]);
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

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
export default function Settings() {
  const { user, accessToken } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  async function handleChangeAvatar() {
    const formData = new FormData();
    if (selectedAvatar) {
      formData.append("avatar", selectedAvatar);
    }
    const res = await fetch("/api/users/changeAvatar", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });
  }
  return (
    <>
      <div className="user-avatar">
        <img src={user?.avatar || ""} alt="Ава"></img>
        <input
          type="file"
          onChange={(e) => {
            setSelectedAvatar(e.target.files ? e.target.files[0] : null);
          }}
        />
        <button onClick={() => handleChangeAvatar()}>Изменить аватар</button>
      </div>
    </>
  );
}

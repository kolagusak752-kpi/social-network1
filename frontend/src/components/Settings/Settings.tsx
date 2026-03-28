import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
export default function Settings() {
  const { user, accessToken, checkAuth } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarURL, setAvatarURL] = useState<string | null>(null)
  useEffect(()=> {
     if(selectedAvatar) {
    setAvatarURL(URL.createObjectURL(selectedAvatar))
  }
  }, [selectedAvatar])
  async function handleChangeAvatar() {
    const formData = new FormData();
    if (selectedAvatar) {
      formData.append("avatar", selectedAvatar);
    }
      await fetch("/api/users/changeAvatar", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });
    checkAuth()
  }
  return (
    <div className="main-wrapper-settings">
      <div className="user-avatar">
        <div className="avatar-image">
          <img src={ avatarURL||user?.avatar|| ''} alt="Ава"></img>
        </div>
        <div className="avatar-buttons">
          <input
            id = "input-avatar"
            className="input-avatar"
            type="file"
            onChange={(e) => {
              setSelectedAvatar(e.target.files ? e.target.files[0] : null);
            }}
          />
          <label htmlFor="input-avatar" className = "btn-choose-avatar">Змінити аву</label>
          <button
            className="btn-save-avatar"
            onClick={() => handleChangeAvatar()}
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
}

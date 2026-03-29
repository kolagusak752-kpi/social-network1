import { useEffect, useState } from "react";
import { useAuth, type User } from "../../context/AuthContext";

export default function Settings() {
  const { user, accessToken, checkAuth } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<User | null>(user);

  useEffect(() => {
    if (selectedAvatar) {
      setAvatarURL(URL.createObjectURL(selectedAvatar));
    }
  }, [selectedAvatar]);
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
    checkAuth();
  }
  return (
    <div className="main-wrapper-settings">
      <section className="profile-block">
        <div className="user-avatar">
          <div className="avatar-image">
            <img src={avatarURL || user?.avatar || ""} alt="Ава"></img>
          </div>
          <div className="avatar-buttons">
            <input
              id="input-avatar"
              className="input-avatar"
              type="file"
              onChange={(e) => {
                setSelectedAvatar(e.target.files ? e.target.files[0] : null);
              }}
            />
            <label htmlFor="input-avatar" className="btn-choose-avatar">
              Змінити аву
            </label>
            <button
              className="btn-save-avatar"
              onClick={() => handleChangeAvatar()}
            >
              Зберегти
            </button>
          </div>
        </div>
        <form className="user-info">
          <input
            type="text"
            defaultValue={user?.username}
            onChange={(e) =>
              setNewUser((prev: any) => ({ ...prev, username: e.target.value }))
            }
          />
          <input
            type="text"
            defaultValue={user?.bio === null ? "" : user?.bio}
            onChange={(e) =>
              setNewUser((prev: any) => ({ ...prev, bio: e.target.value }))
            }
          />
          <p>{user?.email}</p>
          <input
            type="checkbox"
            defaultChecked={user?.isPrivate}
            onChange={(e) =>
              setNewUser((prev: any) => ({
                ...prev,
                isPrivate: e.target.checked,
              }))
            }
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              handleUpdateProfile();
            }}
          >
            Зберегти
          </button>
        </form>
      </section>
    </div>
  );

  async function handleUpdateProfile() {
    if(newUser === null) return
    const {updatedAt, createdAt, isVerified,email, id,  ...newUserWithoutOthers}  = newUser
    const res = await fetch("/api/users/updateProfile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newUserWithoutOthers),
    });
    const data = await res.json();
    console.log(data);
  }
}

import { useEffect, useState } from "react";
import { useAuth, type User } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Settings() {
  const location = useLocation();
  const { user, accessToken, checkAuth } = useAuth();
  const [originalAvatar, setOriginalAvatar] = useState<File | null | Blob>(
    null,
  );
  const [originalAvatarURL, setOriginalAvatarURL] = useState<string | null>(
    null,
  );
  const [croppedAvatar, setCroppedAvatar] = useState<File | null | Blob>(null);
  const [croppedAvatarURL, setCroppedAvatarURL] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<User | null>(user);
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.croppedAvatar) {
      setCroppedAvatar(location.state.croppedAvatar);
      const url = URL.createObjectURL(location.state.croppedAvatar);
      setCroppedAvatarURL(url);
      if (location.state?.originalAvatar) {
        setOriginalAvatar(location.state.originalAvatar);
      }
    }
    window.history.replaceState({}, document.title);
  }, [location.state]);
  useEffect(() => {
    if (originalAvatar) {
      setOriginalAvatarURL(URL.createObjectURL(originalAvatar));
    }
  }, [originalAvatar]);
  async function handleChangeAvatar() {
    const formData = new FormData();
    const fileAvatar = croppedAvatar || originalAvatar;
    if (fileAvatar) {
      formData.append("avatar", fileAvatar);
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
          <div
            className="avatar-image"
            onClick={() =>
              navigate("/editAvatar", {
                state: { originalAvatar: originalAvatar },
              })
            }
          >
            <img
              src={croppedAvatarURL || originalAvatarURL || user?.avatar || ""}
              alt="Ава"
            ></img>
          </div>
          <div className="avatar-buttons">
            <input
              id="input-avatar"
              className="input-avatar"
              type="file"
              onChange={(e) => {
                setCroppedAvatarURL(null);
                setOriginalAvatar(e.target.files ? e.target.files[0] : null);
              }}
            />
            <label htmlFor="input-avatar" className="btn-choose-avatar">
              Вибрати аву
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
          <div className = "users-info-divs">
          <label>Нікнейм</label>
          <input
            type="text"
            defaultValue={user?.username}
            onChange={(e) =>
              setNewUser((prev: any) => ({ ...prev, username: e.target.value }))
            }
          />
          </div>
          <div className="users-info-divs">
          <label>Опис</label>
          <textarea
            className="input-description"
            defaultValue={user?.bio === null ? "" : user?.bio}
            placeholder="Розкажи про себе"
            onChange={(e) =>
              setNewUser((prev: any) => ({ ...prev, bio: e.target.value }))
            }
          />
          </div>
          <div className="users-info-divs">
          <label>Пошта</label>
          <input
            type="email"
            defaultValue={user?.email === null ? "" : user?.email}
            onChange={(e) =>
              setNewUser((prev: any) => ({ ...prev, email: e.target.value }))
            }
          />
          </div>
          <div className = "isPrivateDiv">
          <label>Приватний</label>
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
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleUpdateProfile();
            }}
          >
            Зберегти зміни
          </button>
        </form>
      </section>
    </div>
  );

  async function handleUpdateProfile() {
    if (newUser === null) return;
    const {
      updatedAt,
      createdAt,
      isVerified,
      email,
      id,
      ...newUserWithoutOthers
    } = newUser;
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

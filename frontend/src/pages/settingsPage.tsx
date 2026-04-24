import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import type { User } from "../types/interfaces";

export default function Settings() {
  const location = useLocation();
  const { user, accessToken, checkAuth } = useAuth();
  const [avatarIsSaved, setAvaIsSаved] = useState(false);
  const [originalAvatar, setOriginalAvatar] = useState<File | null | Blob>(
    null,
  );
  const [originalAvatarURL, setOriginalAvatarURL] = useState<string | null>(
    null,
  );
  const [croppedAvatar, setCroppedAvatar] = useState<File | null | Blob>(null);
  const [croppedAvatarURL, setCroppedAvatarURL] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<User | null>(user);
  const [exitDiv, setExitDiv] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    let url = ""
    if (location.state?.croppedAvatar) {
      setCroppedAvatar(location.state.croppedAvatar);
       url = URL.createObjectURL(location.state.croppedAvatar);
      setCroppedAvatarURL(url);
    }
    if (location.state?.originalAvatar) {
      setOriginalAvatar(location.state.originalAvatar);
    }


    window.history.replaceState({}, document.title);
    return () => URL.revokeObjectURL(url)
  }, [location.state]);
  useEffect(() => {
    let url = ""
    if (originalAvatar) {
      url = URL.createObjectURL(originalAvatar)
      setOriginalAvatarURL(url);
    }
    return () => URL.revokeObjectURL(url)
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
    await checkAuth();
  }
  return (
    <>
      <div className="main-wrapper-settings">
        <section className="profile-block">
          <div className="user-avatar-settings">
            <div
              className="avatar-image-settings"
              onClick={() =>
                navigate("/editAvatar", {
                  state: { originalAvatar: originalAvatar },
                })
              }
            >
              <img
                src={
                  croppedAvatarURL || originalAvatarURL || user?.avatar || ""
                }
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
              <div className="save-avatar">
                <button
                  className="btn-save-avatar"
                  onClick={() => {
                    handleChangeAvatar();
                    setAvaIsSаved(true);
                  }}
                >
                  Зберегти
                  {avatarIsSaved && <p>Аву збережено</p>}
                </button>
              </div>
            </div>
          </div>
          <form className="user-info-settings">
            <div className="users-info-divs">
              <label>Нікнейм</label>
              <input
                type="text"
                defaultValue={user?.username}
                onChange={(e) =>
                  setNewUser((prev: any) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              />
            </div>
            <div className="users-info-divs">
              <label>Опис</label>
              <textarea
                maxLength={90}
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
                  setNewUser((prev: any) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="isPrivateDiv">
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
              className="btn-save-changes"
              onClick={(e) => {
                e.preventDefault();
                handleUpdateProfile();
              }}
            >
              Зберегти зміни
            </button>
          </form>
          <button
            className="btn-leave-acc"
            onClick={() => {
              setExitDiv(true);
            }}
          >
            Вийти з акаунту
          </button>
        </section>
      </div>
      {exitDiv && (
        <div className="exit-overlay">
          <div
            tabIndex={0}
            className="exit-container"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setExitDiv(false);
              }
            }}
          >
            Ви впевнені?
            <div className="exit-buttons">
              <button
                onClick={() => {
                  setExitDiv(false);
                }}
              >
                Ні
              </button>
              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                      deviceId: localStorage.getItem("deviceId"),
                    }),
                  });
                  await checkAuth();
                }}
              >
                Так
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
    await checkAuth()
  }
}

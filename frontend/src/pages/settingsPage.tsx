import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import type { User } from "../types/interfaces";
import { usersApi } from "../api/users";
import { authApi } from "../api/auth";
import CropContainer from "../components/CropContainer/CropContainer";

export default function Settings() {
  const location = useLocation();
  const { user, checkAuth } = useAuth();
  const [avatarIsSaved, setAvatarIsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [originalAvatar, setOriginalAvatar] = useState<File | null | Blob>(
    null,
  );
  const [originalAvatarURL, setOriginalAvatarURL] = useState<string | null>(
    null,
  );
  const [croppedAvatarURL, setCroppedAvatarURL] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<User | null>(user);
  const [exitDiv, setExitDiv] = useState(false);
  useEffect(() => {
    if(user) {
      setOriginalAvatarURL(user.avatars?.originalAvatarUrl || null);
      setCroppedAvatarURL(user.avatars?.url || null);
    }
  }, [user]);
  useEffect(() => {
    let url = ""
    if (originalAvatar) {
      url = URL.createObjectURL(originalAvatar)
      setOriginalAvatarURL(url);
    }
    return () => URL.revokeObjectURL(url)
  }, [originalAvatar]);
  async function handleSelectedFile(e: React.ChangeEvent<HTMLInputElement>) {
    setOriginalAvatar(e.target.files ? e.target.files[0] : null);
    setIsModalOpen(true);
    e.target.value = "";
  }
  async function handleChangeAvatar(croppedFile: File) {
    const formData = new FormData();
    const originalFile = originalAvatar
    if(!croppedFile) return
      formData.append("croppedAvatar", croppedFile)
    if (originalFile) {
      formData.append("originalAvatar", originalFile);
    }
    try {
      await usersApi.changeAvatar(formData);
      await checkAuth();
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>{isModalOpen && (
      <CropContainer fileURL = {originalAvatarURL} onClose={() => setIsModalOpen(false)} handleUpload={handleChangeAvatar}/>
    )}
      <div className="main-wrapper-settings">
        <section className="profile-block">
          <div className="user-avatar-settings">
            <div
              className="avatar-image-settings"
              onClick={() => {
                if (originalAvatarURL) {
                  setIsModalOpen(true)}
                }
              }
            >
              <img
                src={
                  croppedAvatarURL || ""
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
                  handleSelectedFile(e)
                }}
              />
              <label htmlFor="input-avatar" className="btn-choose-avatar">
                Вибрати аву
              </label>
              <div className="save-avatar">
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
                  await authApi.logout();
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
        avatars,
        posts,
        ...newUserWithoutOthers
      } = newUser;
      await usersApi.updateProfile(newUserWithoutOthers);
      await checkAuth();
    }
  }

import { useAuth } from "../context/AuthContext";
import { FilePlusCornerIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { postsApi } from "../api/posts";
export default function CreatePost() {
  const { user } = useAuth();
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [isShared, setIsShared] = useState(false);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files ? e.target.files[0] : null);
    e.target.value = "";
  }
  async function handleSharePost() {
    if (!description && !file) {
      return;
    }
    const formData = new FormData();
    if (file) {
      formData.append("post-files", file);
    }
    if (description) {
      formData.append("post-description", description);
    }
    try {
      const data = await postsApi.sharePost(formData);
      setDescription("");
      setFile(null);
      setIsShared(true);
      console.log("Post shared successfully", data);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    let url = "";
    if (!file) {
      setFileURL(null);
      return;
    }
    url = URL.createObjectURL(file);
    console.log(url);
    setFileURL(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return (
    <div className="main-post-wrapper">
      {isShared && (
        <p className="post-shared-message">Post shared successfully!</p>
      )}
      <div className="post-wrapper">
        <div className="post-container">
          <div className="post-user-info">
            <div className="post-user-avatar">
              <img src={user?.avatars?.url} className="avatar-img" />
            </div>
            <p className="post-user-name">{user?.username}</p>
          </div>
          <div className="post-add-file">
            {fileURL && <img src={fileURL} className="post-image"></img>}
          </div>
          <textarea
            className="post-description"
            placeholder="Опис вашого поста"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="post-buttons">
          <input
            type="file"
            id="file-input"
            style={{ display: "none" }}
            onChange={(e) => handleFileSelect(e)}
          />
          <label htmlFor="file-input" className="add-file-label">
            <FilePlusCornerIcon className="add-file-icon" />
          </label>
          <button className="share-post" onClick={() => handleSharePost()}>
            share post
          </button>
        </div>
      </div>
    </div>
  );
}

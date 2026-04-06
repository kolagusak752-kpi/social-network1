import { useState, useRef, type ReactEventHandler } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, type User } from "../../context/AuthContext";
export default function CropContainer() {
  const navigate = useNavigate()
  const location = useLocation()
  const avatarURL= location.state.avatarURL
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(false);
  const [scale, setScale] = useState(1);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null);
  function onMouseDown(e: any) {
    setDrag(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }
  function onMouseMove(e: any) {
    if (!drag) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPosition({ x: dx, y: dy });
  }
  function onMouseUp() {
    setDrag(false);
  }
  function onWheel(e: any) {
    if (e.deltaY > 0) {
      if (scale < 0.5) return;
      setScale(scale - 0.05);
    }
    if (e.deltaY < 0) {
      if (scale > 3) return;
      setScale(scale + 0.05);
    }
  }
  function onSave() {
    if (!imageRef.current) {
      console.error("Картинка еще не загрузилась!");
      return;
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const circleSize = 200;
    canvas.width = circleSize;
    canvas.height = circleSize;
    ctx?.beginPath;
    ctx?.arc(circleSize / 2, circleSize / 2, circleSize / 2, 0, Math.PI * 2);
    ctx?.clip();
    const offsetX = 1000 / 2 - 100;
    const offsetY = 700 / 2 - 100;
    const sx = (offsetX - position.x) / scale;
    const sy = (offsetY - position.y) / scale;
    const sSize = circleSize / scale;
    ctx?.drawImage(
      imageRef?.current,
      sx,
      sy,
      sSize,
      sSize,
      0,
      0,
      circleSize,
      circleSize,
    );
    canvas.toBlob((blob) => {
        if(!blob) return 
    const croppedFile = new File ([blob], "avatar.png", {type: "image/png"})
    navigate("/settings", {state: {
        croppedImage: croppedFile
    }})
        
    })
  }
  const avatarImgStyle = {
    posititon: "absolute",
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
    transformOrigin: "0 0"
  };
  return (
    <div className="wrapper">
      <div
        className="crop-container"
        onMouseDown={(e) => onMouseDown(e)}
        onMouseUp={onMouseUp}
        onMouseMove={(e) => onMouseMove(e)}
        onMouseLeave={onMouseUp}
        onWheel={(e) => {
          onWheel(e);
        }}
      >
        <img
          src={avatarURL}
          style={avatarImgStyle}
          draggable={false}
          ref={imageRef}
        ></img>
        <div className="crop-circle"></div>
      </div>
      <button className="save-button" onClick = {onSave}>Готово</button>
    </div>
  );
}

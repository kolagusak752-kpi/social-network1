import { useState, useRef } from "react";

export default function CropContainer({
  fileURL,
  handleUpload,
  onClose,
}: {
  fileURL: string | null;
  handleUpload: (croppedAvatar: File) => void;
  onClose: () => void;
}) {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  function onMouseDown(e: any) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    let dragX = e.clientX - rect.left;
    let dragY = e.clientY - rect.top;
    dragStart.current = { x: dragX, y: dragY };
  }
  function onMouseUp() {
    dragStart.current = null;
  }
  function onMouseMove(e: any) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !dragStart.current) return;
    let afterMoveX = e.clientX - rect.left;
    let afterMoveY = e.clientY - rect.top;
    let dx = afterMoveX - dragStart.current.x;
    let dy = afterMoveY - dragStart.current.y;
    setPosition({ x: position.x + dx, y: position.y + dy });
    dragStart.current.x = afterMoveX;
    dragStart.current.y = afterMoveY;
  }
  function onMouseLeave() {
    dragStart.current = null;
  }
  function onWheel(e: any) {
    if (e.deltaY > 0 && scale > 0.3) {
      setScale(scale - 0.04);
    }
    if (e.deltaY < 0 && scale < 3) {
      setScale(scale + 0.04);
    }
  }
  function onSave() {
    if(!imageRef.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const circleSize = 170;
    canvas.width = 170;
    canvas.height = 170;
    const imageX = (rect.width / 2 - circleSize / 2 - position.x) / scale;
    const imageY = (rect.height / 2 - circleSize / 2 - position.y) / scale;
    context?.arc(85, 85, 85, 0, Math.PI * 2);
    context?.clip();
    context?.drawImage(
      imageRef.current,
      imageX,
      imageY,
      circleSize/scale,
      circleSize/scale,
      0,
      0,
      circleSize,
      circleSize,
    );
    canvas.toBlob(async (blob) => {
      const croppedAvatar = new File([blob!], "croppedAvatar")
      await handleUpload(croppedAvatar)
      onClose()
    })
  }
  const avatarImgStyle = {
    position: "absolute" as const,
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
    transformOrigin: "0 0",
  };
  return (
    <div className="main-wrapper-crop">
      <div
        className="crop-container"
        ref={containerRef}
        onMouseLeave={onMouseLeave}
        onMouseDown={(e) => onMouseDown(e)}
        onMouseUp={onMouseUp}
        onMouseMove={(e) => onMouseMove(e)}
        onWheel={(e) => onWheel(e)}
      >
        <img
          src={fileURL ? fileURL : ""}
          style={avatarImgStyle}
          draggable={false}
          ref={imageRef}
        ></img>
        <div className="crop-circle"></div>
      </div>
      <div className="crop-buttons">
        <button className="save-button" onClick = {onSave}>Зберегти</button>
        <button
          onClick={() => {
            onClose();
          }}
        >
          Назад
        </button>
      </div>
    </div>
  );
}

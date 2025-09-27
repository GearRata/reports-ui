import { FaCamera } from "react-icons/fa";

interface CameraButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function CameraButton({
  onClick,
  disabled = false,
}: CameraButtonProps) {
  return (
    <div className="relative aspect-square animate-scaleIn">
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex"
        aria-label="Take photo"
        type="button"
      >
        <FaCamera size={25} />
      </button>
    </div>
  );
}

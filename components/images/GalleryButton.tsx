import { AiFillPicture } from "react-icons/ai";

interface GalleryButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function GalleryButton({
  onClick,
  disabled = false,
}: GalleryButtonProps) {
  return (
    <div className="relative aspect-square animate-scaleIn">
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex"
        aria-label="Add image"
        type="button"
      >
        <AiFillPicture size={25}  />
      </button>
    </div>
  );
}

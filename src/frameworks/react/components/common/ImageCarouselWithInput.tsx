import { useState, useRef } from "react";
import { Modal, Image } from "react-bootstrap";

type Props = {
  previews: string[];
  onAdd: (files: FileList | null) => void;
  onDelete: (index: number) => void;
  isSubmitting: boolean;
};

export default function ImageCarouselWithInput({ previews, onAdd, onDelete, isSubmitting }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="image-carousel-wrapper">
        {/* Add Image */}
        <div
          className={`image-add-box ${isSubmitting ? "disabled" : ""}`}
          onClick={() => !isSubmitting && fileInputRef.current?.click()}
        >
          +
        </div>

        {/* Hidden input file*/}
        <input
          ref={fileInputRef}
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => {
            onAdd(e.target.files);
            e.target.value = "";
          }}
          disabled={isSubmitting}
        />

        {/* Previews */}
        {previews.map((src, idx) => (
          <div
            key={idx}
            className={`image-preview-wrapper ${isSubmitting ? "disabled" : ""}`}
          >
            <img
              src={src}
              alt={`Preview ${idx}`}
              onClick={() => {
                if (!isSubmitting) {
                  setModalImage(src);
                  setShowModal(true);
                }
              }}
            />
            {!isSubmitting && (
              <button
                type="button"
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(idx);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Body className="text-center">
          <Image src={modalImage} fluid />
        </Modal.Body>
      </Modal>
    </>
  );
}

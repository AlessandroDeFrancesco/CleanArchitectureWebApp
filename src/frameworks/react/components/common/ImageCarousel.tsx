import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

type Props = {
  images: string[];
};

export default function ImageCarousel({ images }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState<number>(0);

  const openImage = (index: number) => {
    setModalIndex(index);
    setShowModal(true);
  };

  const nextImage = () => {
    setModalIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setModalIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className="d-flex overflow-auto mt-2 gap-2" style={{ paddingBottom: "0.5rem" }}>
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt="Preview"
            onClick={() => openImage(idx)}
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: 4,
              flex: "0 0 auto",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="p-0 position-relative">
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={images[modalIndex]}
              alt="Preview Full"
              style={{
                maxWidth: "90vw",
                maxHeight: "80vh",
                borderRadius: 4,
                display: "block",
              }}
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="light"
                  onClick={prevImage}
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    borderRadius: "50%",
                    padding: "0.4rem",
                    opacity: 0.8,
                  }}
                >
                  <ChevronLeft size={24} />
                </Button>
                <Button
                  variant="light"
                  onClick={nextImage}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    borderRadius: "50%",
                    padding: "0.4rem",
                    opacity: 0.8,
                  }}
                >
                  <ChevronRight size={24} />
                </Button>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

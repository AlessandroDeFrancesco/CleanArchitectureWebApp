import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import ImageCarouselWithInput from "../common/ImageCarouselWithInput";
import { resizeAndCompressImage } from "../../../../utils/ImagesUtils";
import { base64ToBlob } from "../../../../utils/FilesUtils";
import { getFileContentAsBase64 } from "../../../../utils/FilesUtils";
import type { FormImageUIDto } from "../../dtos/ImageUIDto";
import type { FormItemUIDto, ItemUIDto } from "../../dtos/ItemUIDto";
import { v4 as uuid } from 'uuid';


type Props = {
  item: ItemUIDto | null;
  onSubmit: (item: FormItemUIDto) => void;
  onAbort: () => void;
};

const MAX_IMAGE_SIZE = 1024;
const IMAGE_COMPRESSION_QUALITY = 0.85;
const IMAGE_MIME_TYPE = "image/jpeg";
const IMAGE_FILE_EXTENSION = "jpeg";

export default function ItemForm({ item, onSubmit, onAbort }: Props) {
  const id = item?.id;
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [images, setImages] = useState<FormImageUIDto[]>(item?.images ?? []);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setImages(item.images);
      loadPreviews(item.images);
    } else {
      setName("");
      setDescription("");
      setImages([]);
      setPreviews([]);
    }
  }, [item]);

  const loadPreviews = async (images: FormImageUIDto[]) => {
    if (!images || images.length === 0) {
      setPreviews([]);
      return;
    }

    const urls: string[] = [];
    for (const image of images) {
      if (image.contentBase64) {
        const blob = base64ToBlob(image.contentBase64, image.mimeType);
        const url = URL.createObjectURL(blob);
        urls.push(url);
      }
    }
    setPreviews(urls);
  };

  const handleImageAdd = async (files: FileList | null) => {
    if (!files)
      return;
    const newImages: FormImageUIDto[] = [];
    const newPreviews: string[] = [];

    for (const file of Array.from(files)) {
      const resizedBlob = await resizeAndCompressImage(file, MAX_IMAGE_SIZE, IMAGE_COMPRESSION_QUALITY, IMAGE_MIME_TYPE);
      const resizedFileName = `${uuid()}.${IMAGE_FILE_EXTENSION}`.replaceAll('-', '');
      const resizedFile = new File([resizedBlob], resizedFileName, { type: IMAGE_MIME_TYPE });
      const resizedFileContent = await getFileContentAsBase64(resizedFile);
      if (!resizedFileContent) {
        alert(`Couldn't add ${file.name}`);
        return;
      }
      const image = {
        name: resizedFile.name,
        mimeType: resizedFile.type,
        contentBase64: resizedFileContent
      };
      newImages.push(image);
      newPreviews.push(URL.createObjectURL(resizedBlob));
    }
    setImages((prev) => [...prev, ...newImages]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleImageDelete = async (indexToDelete: number) => {
    if (!window.confirm("Are you sure?"))
      return;
    setImages((prev) => prev.filter((_, i) => i !== indexToDelete));
    setPreviews((prev) => prev.filter((_, i) => i !== indexToDelete));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        id,
        name,
        description,
        images
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbort = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(false);
    await onAbort();
  }

  return (
    <>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Images</Form.Label>
          <ImageCarouselWithInput
            previews={previews}
            onAdd={handleImageAdd}
            onDelete={handleImageDelete}
            isSubmitting={isSubmitting}
          />
        </Form.Group>

        <div className="footer-buttons bg-surface">
          <button className="save-btn" onClick={handleSubmit}>Save</button>
          <button className="cancel-btn" onClick={handleAbort}>Cancel</button>
        </div>
      </Form>

      <Modal show={isSubmitting} backdrop="static" keyboard={false} centered>
        <Modal.Body className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p>Saving...</p>
        </Modal.Body>
      </Modal>
    </>
  );
}
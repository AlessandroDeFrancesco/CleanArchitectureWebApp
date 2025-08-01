import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import ImageCarousel from "../common/ImageCarousel";
import { base64ToBlob } from "../../../../utils/FilesUtils";
import type { ItemUIDto } from "../../dtos/ItemUIDto";

type Props = {
  item: ItemUIDto;
  onEdit: (updated: ItemUIDto) => void;
  onDelete: (houseId: string) => void;
};

export default function ItemCard({ item, onEdit, onDelete }: Props) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const loadPreviews = async () => {
      if (!item.images || item.images.length === 0) {
        setPreviews([]);
        return;
      }

      const urls: string[] = [];
      for (const image of item.images) {
        if (image.contentBase64) {
          const blob = base64ToBlob(image.contentBase64, image.mimeType);
          const url = URL.createObjectURL(blob);
          urls.push(url);
        }
      }
      setPreviews(urls);
    };

    loadPreviews();

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [item]);

  return (
    <Card className="mb-4 border-0 shadow-sm bg-dark text-light rounded-4">
      <Card.Header
        className="px-4 pt-3 pb-2 border-bottom"
        style={{
          backgroundColor: "#171a1d",
          color: "#f1f1f1",
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
        }}
      >
        <h5 className="mb-0">{item.name}</h5>
      </Card.Header>

      <Card.Body className="px-4 py-3">
        <Card.Text className="mb-3 text-secondary">
          {item.description || "No description available."}
        </Card.Text>

        <div className="rounded overflow-hidden">
          <ImageCarousel images={previews} />
        </div>
      </Card.Body>

      <Card.Footer className="bg-surface border-0 p-0">
        <div className="d-flex btn-group-footer overflow-hidden">
          <Button
            variant="outline-success"
            className="flex-fill py-2"
            onClick={() => onEdit(item)}
            title="Edit"
          >
            <Pencil size={16} className="me-2" />
            Edit
          </Button>

          <Button
            variant="outline-danger"
            className="flex-fill py-2"
            onClick={() => {
              if (window.confirm(`Delete "${item.name}"?`)) {
                onDelete(item.id);
              }
            }}
            title="Delete"
          >
            <Trash size={16} className="me-2" />
            Delete
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}

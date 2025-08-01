import { Row, Col } from "react-bootstrap";
import ItemCard from "./ItemCard";
import type { ItemUIDto } from "../../dtos/ItemUIDto";

type Props = {
  items: ItemUIDto[];
  onEdit: (item: ItemUIDto) => void;
  onDelete: (id: string) => void;
};

export default function ItemList({ items, onEdit, onDelete }: Props) {
  if (items.length === 0) {
    return <p>Nothing.</p>;
  }

  const sortedList = items.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Row>
      {sortedList.map((item) => (
        <Col md={6} lg={4} key={item.id}>
          <ItemCard
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Col>
      ))}
    </Row>
  );
}

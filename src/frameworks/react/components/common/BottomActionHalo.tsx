import { ArrowDownUp, Funnel, Plus } from "react-bootstrap-icons";

type Props = {
  handleAction: (action: 'filter' | 'add' | 'sort') => void;
};

const actionButtons = [
  { key: 'filter', icon: <Funnel size={20} />, title: 'Filter' },
  { key: 'add', icon: <Plus size={20} />, title: 'Add' },
  { key: 'sort', icon: <ArrowDownUp size={20} />, title: 'Sort' },
] as const;

export default function BottomActionHalo(props: Props) {
  const centerIndex = Math.floor(actionButtons.length / 2);

  return (
    <div className="halo-actions">
      {actionButtons.map((btn, idx) => {
        const distance = Math.abs(idx - centerIndex);
        const scale = 1.2 - 0.2 * distance;

        return (
          <button
            key={btn.key}
            className="halo-button"
            title={btn.title}
            onClick={() => props.handleAction(btn.key)}
            style={{ transform: `scale(${scale})`, transition: 'transform 0.2s ease' }}
          >
            {btn.icon}
          </button>
        );
      })}
    </div>
  );
}

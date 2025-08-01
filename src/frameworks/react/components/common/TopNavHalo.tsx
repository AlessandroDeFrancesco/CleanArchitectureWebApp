import { Info, House, Gear } from "react-bootstrap-icons";

type Props = {
  handleNavigation: (page: 'info' | 'main' | 'settings') => void;
};

const navButtons = [
  { key: 'info', icon: <Info size={18} />, title: 'Info' },
  { key: 'main', icon: <House size={20} />, title: 'Home' },
  { key: 'settings', icon: <Gear size={18} />, title: 'Settings' },
] as const;

export default function TopNavHalo({ handleNavigation }: Props) {
  const centerIndex = Math.floor(navButtons.length / 2);

  return (
    <div className="halo-nav">
      {navButtons.map((btn, idx) => {
        const distance = Math.abs(idx - centerIndex);
        const scale = 1.2 - 0.2 * distance;

        return (
          <button
            key={btn.key}
            className="halo-button"
            title={btn.title}
            onClick={() => handleNavigation(btn.key)}
            style={{ transform: `scale(${scale})`, transition: 'transform 0.2s ease' }}
          >
            {btn.icon}
          </button>
        );
      })}
    </div>
  );
}

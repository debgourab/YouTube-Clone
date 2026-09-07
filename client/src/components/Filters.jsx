import { categories } from "../utils/categories.js";

export default function Filters({ selected, onSelect }) {
  return (
    <div className="filters" aria-label="Video categories">
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          className={selected === category ? "active" : ""}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

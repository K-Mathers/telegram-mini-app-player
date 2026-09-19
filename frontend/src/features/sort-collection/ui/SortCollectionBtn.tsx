import { ListFilter, Check } from "lucide-react";
import "./SortCollectionBtn.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { setSortBy, selectSortBy } from "../model/slice";
import { useState } from "react";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { SORT_OPTIONS } from "../model/config";

const SortCollectionBtn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sortBy = useSelector(selectSortBy);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false))

  const handleSelect = (key: string) => {
    dispatch(setSortBy(key));
    setIsOpen(false);
  };

  return (
    <div className="sort-btn-wrapper" ref={ref}>
      <button
        className="sort-trigger-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Sort options"
      >
        <ListFilter size={16} />
      </button>

      {isOpen && (
        <div className="sort-dropdown">
          <div className="sort-dropdown-header">
            <span>SORT BY</span>
            <button className="sort-dropdown-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="sort-dropdown-options">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.key}
                className={`sort-option${sortBy === option.key ? " sort-option--active" : ""}`}
                onClick={() => handleSelect(option.key)}
              >
                <div className="sort-option-icon">{option.icon}</div>
                <div className="sort-option-text">
                  <span className="sort-option-label">{option.label}</span>
                  <span className="sort-option-desc">{option.description}</span>
                </div>
                {sortBy === option.key && (
                  <Check size={16} className="sort-option-check" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortCollectionBtn;

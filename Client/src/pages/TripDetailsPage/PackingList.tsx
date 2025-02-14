import { useState } from "react";

export type PackingItem = {
  name: string;
  isChecked: boolean;
};

type PackingListProps = {
  packingList: PackingItem[];
  setPackingList: (list: PackingItem[]) => void;
};

export default function PackingList({
  packingList,
  setPackingList,
}: PackingListProps) {
  const [newItem, setNewItem] = useState("");

  const handleToggle = (index: number) => {
    setPackingList(
      packingList.map((item, i) =>
        i === index ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setPackingList([...packingList, { name: newItem, isChecked: false }]);
    setNewItem("");
  };

  const handleRemoveItem = (index: number) => {
    setPackingList(packingList.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-md p-4 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-3">Packing List</h2>
      <ul className="space-y-2">
        {packingList.map((item, index) => (
          <li key={index} className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={() => handleToggle(index)}
                className="w-5 h-5"
              />
              <span
                className={item.isChecked ? "line-through text-gray-400" : ""}
              >
                {item.name}
              </span>
            </label>
            <button
              onClick={() => handleRemoveItem(index)}
              className="text-red-400 hover:text-red-500"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          placeholder="Add an item..."
        />
        <button
          onClick={handleAddItem}
          className="px-3 py-2 bg-green-600 rounded-lg hover:bg-green-500"
        >
          +
        </button>
      </div>
    </div>
  );
}

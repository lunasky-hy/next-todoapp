'use client'

import { useEffect } from "react";

type AddCategoryPopOverProps = {
  onBlur?: () => void;
  onClose?: () => void; 
}

export default function AddCategoryPopOver({onBlur, onClose}: AddCategoryPopOverProps) {
  useEffect(() => {
    document.getElementById('popover-input')?.focus();
  }, []);

  return (
    <div id="add-category-popover" className="absolute top-full left-0 mt-3 bg-white border border-gray-200 rounded-lg shadow-xl z-10 w-max" onBlur={onBlur}>
      <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
      
      <form id="add-category-form" className="p-4">
        <label htmlFor="popover-input" className="block text-sm font-medium text-gray-700 mb-3 w-full">新しいカテゴリの表示名</label>
        <div className="flex flex-row">
          <input id="popover-input" type="text" placeholder="カテゴリ名を入力" className="w-64 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
          <button type="button" className="bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm ml-1 w-max" onClick={onClose}>追加</button>
        </div>
      </form>
    </div>
  );
}

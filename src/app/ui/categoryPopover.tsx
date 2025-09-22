'use client'

import { FocusEvent, useEffect, useState } from "react";
import { createCategory } from "@/app/lib/actions/categoryActions";

type AddCategoryPopOverProps = {
  closePopOver: () => void;
  handleCreate: (text: string) => void;
}

export default function AddCategoryPopOver({closePopOver, handleCreate}: AddCategoryPopOverProps) {
  const [input, onChangeInput] = useState('');
  useEffect(() => {
    document.getElementById('popover-input')?.focus();
  }, []);

  const onBlur = (event: FocusEvent<HTMLDivElement, Element>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    else closePopOver();
  }

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCreate(input);
  }

  return (
    <div 
      id="add-category-popover" 
      className="absolute top-full left-0 mt-3 bg-white border border-gray-200 rounded-lg shadow-xl z-10 w-max" 
      onBlur={(e) => onBlur(e)}
    >
      <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
      
      <form id="add-category-form" className="p-4" onSubmit={onCreate}>
        <label htmlFor="popover-input" className="block text-sm font-medium text-gray-700 mb-3 w-full">新しいカテゴリの表示名</label>
        <div className="flex flex-row">
          <input 
            id="popover-input" 
            type="text" 
            placeholder="カテゴリ名を入力" 
            value={input}
            onChange={(elem) => onChangeInput(elem.target.value)}
            className="w-64 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm ml-1 w-max disabled:bg-gray-700" 
            disabled={!input.trim()}
          >
            追加
          </button>
        </div>
      </form>
    </div>
  );
}

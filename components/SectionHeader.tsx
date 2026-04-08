'use client';
import { useEffect } from 'react';

interface Params {
  title?: string
  description?: string
  buttonLabel?: string
  buttonAction?: () => void
}

export function SectionHeader({ title, description, buttonLabel, buttonAction }:Params) {

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{ title }</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{ description }</p>
      </div>
      {
        (!!buttonLabel && buttonAction) &&
          <button
            onClick={buttonAction}
            className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
          >
            <PlusIcon /> { buttonLabel }
          </button>
      }
    </div>
  );
}

const PlusIcon = () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
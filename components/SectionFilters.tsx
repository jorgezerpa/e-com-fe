'use client';
import { ChangeEvent, useEffect } from 'react';

interface Params {
  title?: string
  description?: string
  buttonLabel?: string
  buttonAction?: () => void
}

/*
- searchbar
- dropdowns
- datepickers
*/
interface Dropdown {
  title: string
  items: { value: string | number, label: string }[]
  value: string | number
  handleChangeValue: (event: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => void
} 

interface DatePicker {
  title: string
  date: string|number
  handleChangeDate: (event: ChangeEvent<HTMLInputElement, HTMLDataElement>) => void
}

interface SearchBar {
  title: string
  placeholder: string
  value: string
  handleChangeValue: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
}

interface Params {
  dropdowns: Dropdown[]
  datePickers: DatePicker[]
  searchBars: SearchBar[]
  //
  dropdownAllSelectedLabel?: string
}

export function SectionFilters({ dropdowns, datePickers, searchBars, dropdownAllSelectedLabel }:Params) {

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap justify-start items-center gap-5">
      {
        searchBars.map(searchBar => {
          return (
            <div className="relative w-full max-w-50">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{ searchBar.title }</label>
              <input
                type="text"
                placeholder={searchBar.placeholder}
                value={searchBar.value}
                onChange={searchBar.handleChangeValue}
                className="w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          )
        })
      }


      {
        dropdowns.map(dropdown => {
          return (
            <div className='relative w-full max-w-50'>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{ dropdown.title }</label>
              <select
                value={dropdown.value}
                onChange={dropdown.handleChangeValue}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">{ dropdownAllSelectedLabel }</option>
                {dropdown.items.map(item => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
          )
        })
      }

      {
        datePickers.map(datePicker => {
          return (
            <div className='relative w-full max-w-50'>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{ datePicker.title }</label>
              <input
                type="date"
                value={datePicker.date}
                onChange={datePicker.handleChangeDate}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          )
        })
      }

    </div>
  );
}

const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;


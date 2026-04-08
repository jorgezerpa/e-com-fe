'use client';
import { DisableIcon, EditIcon, TrashIcon } from '@/icons';
import { MouseEventHandler, useEffect } from 'react';

interface ActionButton {
  handleClick: (id:string|number) => void
  label: string
  icon: "edit"|"delete"|"disable" 
}

interface TableCells extends Record<string, any> {
  type: "string"|"image"|"titleAndSubtitle"|"coloredTag"
}

export interface RowItem extends Record<string, any> {
  id: string | number; // This is now mandatory
  isDisabled: boolean
  cells: TableCells[]
}

interface Params {
  columns: { label: string, key: string }[] // key must match with the rows' items keys
  rows: RowItem[];
  actions: ActionButton[];
}

export function SectionTable({ columns, rows, actions }:Params) {

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
            {
              columns.map(column => {
                return (
                  <th className="p-4 font-medium">{ column.label }</th>
                )
              })
            }
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                No products found. Adjust your filters or create a new one.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors ${
                  row.isDisabled ? 'opacity-60 grayscale' : ''
                }`}
              >
                {
                  row.cells.map(cell => {
                    return (
                      <td className="p-4">
                        {
                          cell.type === "image" && 
                            <>
                              {
                                !!cell.value 
                                  ?
                                    <img
                                      src={cell.value}
                                      alt={row.alt || ""}
                                      className="w-12 h-12 rounded-md object-cover border border-gray-200 dark:border-gray-600"
                                    />
                                  :
                                    <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-xs border border-gray-200 dark:border-gray-600">
                                      No Img
                                    </div>
                              }
                            </>
                        }
                        {
                          cell.type === "titleAndSubtitle" && 
                            <>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {cell.title}
                                {row.isDisabled && (
                                  <span className="ml-2 text-[10px] uppercase tracking-wide bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">Disabled</span>
                                )}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                SKU: {cell.subtitle}
                              </div>
                            </>
                        }
                        {
                          cell.type === "string" && 
                            <>
                              <p className='font-medium'>{ cell.value }</p>
                            </>
                        }
                        {
                          cell.type === "coloredTag" && 
                            <>
                              <div className="flex flex-wrap gap-1.5">
                                {cell.tags.length > 0 ? (
                                  cell.tags.map((tag:any) => (
                                    <span
                                      key={tag.id}
                                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${tag.colorClasses}`}
                                    >
                                      {tag.name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-400 text-xs italic">-</span>
                                )}
                              </div>
                            </>
                        }
                      </td>
                    )
                  })
                }

                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {
                      actions.map(action => (
                        <button
                          onClick={() => action.handleClick(row.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                          title={action.label}
                        >
                          { action.icon === "disable" && <DisableIcon />}
                          { action.icon === "edit" && <EditIcon />}
                          { action.icon === "delete" && <TrashIcon />}
                        </button>
                      ))
                    }
                  </div>
                </td>


              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
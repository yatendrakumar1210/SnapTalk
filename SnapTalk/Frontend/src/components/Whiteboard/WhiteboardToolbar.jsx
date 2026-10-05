import React from 'react';
import {
  MousePointer,
  Pencil,
  Highlighter,
  Eraser,
  Minus,
  Square,
  Circle,
  ArrowRight,
  Type,
  RotateCcw,
  RotateCw,
  Trash2,
  Plus
} from 'lucide-react';

const WhiteboardToolbar = ({
  tool,
  setTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  onUndo,
  onRedo,
  onClear,
  canDraw,
  pages,
  activePageId,
  onSelectPage,
  onAddPage
}) => {
  const tools = [
    { id: 'select', label: 'Select', icon: MousePointer },
    { id: 'pen', label: 'Pen', icon: Pencil },
    { id: 'highlighter', label: 'Highlighter', icon: Highlighter },
    { id: 'eraser', label: 'Eraser', icon: Eraser },
    { id: 'line', label: 'Line', icon: Minus },
    { id: 'rectangle', label: 'Rectangle', icon: Square },
    { id: 'circle', label: 'Circle', icon: Circle },
    { id: 'arrow', label: 'Arrow', icon: ArrowRight },
    { id: 'text', label: 'Text', icon: Type }
  ];

  const colors = ['#000000', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-2 flex flex-wrap items-center justify-between gap-2 shadow-xs">
      
      {/* Board Pages */}
      <div className="flex items-center space-x-1 overflow-x-auto">
        {pages.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => onSelectPage(p.id)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              activePageId === p.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {p.title || `Board ${idx + 1}`}
          </button>
        ))}
        {canDraw && (
          <button
            onClick={onAddPage}
            className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Add Page"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Drawing Tools */}
      {canDraw ? (
        <div className="flex items-center space-x-1">
          {tools.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`p-2 rounded-lg transition-colors ${
                  tool === t.id
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={t.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Color Palette */}
          <div className="flex items-center space-x-1">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 ${
                  color === c ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Stroke Width */}
          <select
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500"
          >
            <option value={2}>Thin</option>
            <option value={4}>Medium</option>
            <option value={8}>Thick</option>
          </select>

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Undo / Redo / Clear */}
          <button onClick={onUndo} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="Undo">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={onRedo} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="Redo">
            <RotateCw className="w-4 h-4" />
          </button>
          <button onClick={onClear} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg" title="Clear Canvas">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium px-2 py-1 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
          🔒 Read-only Mode (Teacher disabled student drawing)
        </span>
      )}

    </div>
  );
};

export default WhiteboardToolbar;

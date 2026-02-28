import { Clock, Trash2 } from 'lucide-react';
import { Location } from '../types';

interface RecentSearchesProps {
  searches: Location[];
  onSelect: (location: Location) => void;
  onClear: () => void;
}

export default function RecentSearches({ searches, onSelect, onClear }: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent Searches
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((location) => (
          <button
            key={location.id}
            onClick={() => onSelect(location)}
            className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all shadow-sm"
          >
            {location.name}
          </button>
        ))}
      </div>
    </div>
  );
}

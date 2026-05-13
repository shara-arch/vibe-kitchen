import { SlidersHorizontal } from "lucide-react";

const FILTER_OPTIONS = {
  'Dietary': ['High Protein', 'Low Carb', 'Vegetarian', 'Vegan'],
  'Allergies': ['No Nuts', 'No Dairy', 'No Eggs', 'No Soy', 'No Fish'],
}
export default function FilterPanel({activeFilters, onFilterChange}){
    function toggleFilter(filter) {
        onFilterChange(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev,filter]
        );
    }
    return(
        <div className="bg-white border border-stone-200 rounded-xl p-5 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal size={16} className="text-amber-500"/><h3 className="text-sm font-semibold text-stone-700">Filter Options</h3>
                 {activeFilters.length > 0 && (
                    <span className="ml-auto text-xs text-amber-600 font-medium cursor-pointer hover:text-amber-700"  onClick={() => onFilterChange([])}>
                        Clear all ({activeFilters.length})
                    </span>
                    )}
            </div>
            <div className="space-y-4">
                 {Object.entries(FILTER_OPTIONS).map(([group, options]) => (
                    <div key={group}>
                        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">{group}</p>
                        <div className="flex flex-wrap gap-2">
                        {options.map(opt => (
                            <button
                            key={opt}
                            onClick={() => toggleFilter(opt)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            activeFilters.includes(opt)
                            ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-600'
                            }`}
                            >
                            {opt}
                            </button>
                        ))}
                        </div>
                    </div>
                    ))}
            </div>
        </div>
    )
}
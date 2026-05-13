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
        <div>
            <div>
                <SlidersHorizontal size={16}/><h3>Filter Options</h3>
                 {activeFilters.length > 0 && (
                    <span className=""  onClick={() => onFilterChange([])}>
                        Clear all ({activeFilters.length})
                    </span>
                    )}
            </div>
            <div>
                 {Object.entries(FILTER_OPTIONS).map(([group, options]) => (
                    <div key={group}>
                        <p className="">{group}</p>
                        <div className="">
                        {options.map(opt => (
                            <button
                            key={opt}
                            onClick={() => toggleFilter(opt)}
                            className={}
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
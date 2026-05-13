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
}
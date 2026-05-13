import { useRef } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({value, onChange}) {
    const inputRef = useRef(null);
    // Clear SearchBar
    function handleClear() {
        onChange("");
        inputRef.current?.focus();
    }
    return(
        <div className="">
            <Search size={18}/>
            <input ref={inputRef} type="text" placeholder="Search for recipes... (e.g. chicken, pasta, salad)"
            value={value}
            onChange={e => onChange(e.target.value)} className="" />
        </div>
    )
}
import { useRef } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({value, onChange}) {
    const inputRef = useRef(null);
    // Clear SearchBar
    function handleClear() {
        onChange("");
        inputRef.current?.focus();
    }
}
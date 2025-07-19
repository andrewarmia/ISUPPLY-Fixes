import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../css/Select2Search.css'; // You'll create this CSS file

const Select2Search = ({ apiUrl, onItemSelected, placeholder = "Search..." }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const componentRef = useRef(null); // Ref to handle clicks outside the component

    // Debounce function (simple implementation)
    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    // Function to fetch data from the API
    const fetchData = useCallback(
        debounce(async (query) => {
            if (query.length < 2) { // Optional: Minimum characters to trigger search
                setSearchResults([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // IMPORTANT: Replace with your actual API endpoint and parameters
                // This is a placeholder. Your API might expect 'q', 'search', etc.
                const response = await fetch(`${apiUrl}?query=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // IMPORTANT: Adjust this based on your API's response structure
                // Assuming your API returns an array of items, each with an 'id' and 'name'
                setSearchResults(data);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 500), // Debounce by 500ms
        [apiUrl]
    );

    // Effect to call API when searchTerm changes
    useEffect(() => {
        if (searchTerm) {
            fetchData(searchTerm);
            setShowDropdown(true); // Show dropdown when searching
        } else {
            setSearchResults([]); // Clear results if search term is empty
            setShowDropdown(false); // Hide dropdown
        }
    }, [searchTerm, fetchData]);

    // Handle clicks outside the component to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleInputFocus = () => {
        // Show dropdown if there are results or if searching
        if (searchResults.length > 0 || searchTerm) {
            setShowDropdown(true);
        }
    };

    const handleResultClick = (item) => {
        setSearchTerm(item.name || item.title || item.id); // Set input text to selected item's name/title
        setSearchResults([]); // Clear results
        setShowDropdown(false); // Hide dropdown
        if (onItemSelected) {
            onItemSelected(item); // Pass selected item to parent component
        }
    };

    return (
        <div className="select2-container" ref={componentRef}>
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                // onBlur is tricky with immediate clicks on results,
                // so we rely more on handleClickOutside for closing.
                // You might need a slight delay for onBlur if you use it to hide the dropdown.
                className="select2-input"
            />

            {isLoading && <div className="select2-loading">Loading...</div>}

            {showDropdown && searchResults.length > 0 && (
                <ul className="select2-dropdown">
                    {searchResults.map((item) => (
                        <li key={item.id} onClick={() => handleResultClick(item)} className="select2-result-item">
                            {/* Customize how you display each result item */}
                            {item.name || item.title || `Item ID: ${item.id}`}
                        </li>
                    ))}
                </ul>
            )}

            {showDropdown && !isLoading && searchTerm.length >= 2 && searchResults.length === 0 && (
                <div className="select2-no-results">No results found.</div>
            )}
        </div>
    );
};

export default Select2Search;

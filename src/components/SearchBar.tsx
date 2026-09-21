type SearchBarProps = {
  query: string;
  onChange: (newQuery: string) => void;
};

const SearchBar = ({ query, onChange }: SearchBarProps) => {
  return (
    <input
      type="text"
      className="search-input"
      placeholder="Search movies..."
      value={query}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

export default SearchBar;

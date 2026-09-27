import { SearchField } from '@/components/forms/SearchField';
import { SelectField } from '@/components/forms/SelectField';

interface BlogFiltersProps {
  searchId: string;
  categoryId: string;
  searchLabel: string;
  searchPlaceholder: string;
  categoryLabel: string;
  allCategoriesLabel: string;
  categories: readonly string[];
  query: string;
  category: string;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function BlogFilters(props: BlogFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
      <SearchField id={props.searchId} label={props.searchLabel} onChange={props.onQueryChange} placeholder={props.searchPlaceholder} value={props.query} />
      <SelectField id={props.categoryId} label={props.categoryLabel} onChange={props.onCategoryChange} value={props.category} options={[{ value: 'all', label: props.allCategoriesLabel }, ...props.categories.map((item) => ({ value: item, label: item }))]} />
    </div>
  );
}

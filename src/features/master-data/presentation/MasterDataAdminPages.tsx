import { DataTable, type DataTableColumn } from '@/components/data-display/DataTable';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { PageShell } from '@/shell/PageShell';
import type { MasterDataAdminViewProvider } from '../application/master-data.contracts';
import type { MasterDataBrandDto, MasterDataCategoryDto, MasterDataDeviceModelDto } from '../application/master-data.dto';
import type { MasterDataProvider } from '../application/master-data.contracts';

interface MasterDataAdminPageProps {
  masterDataProvider: MasterDataProvider;
  viewProvider: MasterDataAdminViewProvider;
}

const status = (active: boolean) => <StatusBadge label={active ? 'Activo' : 'Inactivo'} tone={active ? 'success' : 'neutral'} />;
const yesNo = (enabled: boolean) => <StatusBadge label={enabled ? 'Visible' : 'Oculto'} tone={enabled ? 'info' : 'neutral'} />;

function breadcrumbItems(labels: readonly string[]) {
  return labels.map((label) => ({ label }));
}

function textSearch(values: readonly (string | number | null | undefined)[]) {
  return values.filter((value) => value !== null && value !== undefined).join(' ');
}

export function MasterDataBrandsPage({ masterDataProvider, viewProvider }: MasterDataAdminPageProps) {
  const view = viewProvider.getView('brands');
  const brands = masterDataProvider.getBrands();
  const models = masterDataProvider.getDeviceModels();
  const modelCountByBrand = new Map<string, number>();
  for (const model of models) modelCountByBrand.set(model.brandId, (modelCountByBrand.get(model.brandId) ?? 0) + 1);

  const columns: readonly DataTableColumn<MasterDataBrandDto>[] = [
    { id: 'name', header: view.columns.find((column) => column.id === 'name')?.header ?? 'Marca', cell: (brand) => <div><strong className="text-slate-900">{brand.name}</strong><div className="text-xs text-slate-400">{brand.id}</div></div>, sortable: true, sortValue: (brand) => brand.name, searchValue: (brand) => textSearch([brand.name, brand.slug, brand.id]) },
    { id: 'slug', header: view.columns.find((column) => column.id === 'slug')?.header ?? 'Slug', cell: (brand) => <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">{brand.slug}</code>, sortable: true, sortValue: (brand) => brand.slug, searchValue: (brand) => brand.slug },
    { id: 'models', header: view.columns.find((column) => column.id === 'models')?.header ?? 'Modelos', cell: (brand) => `${modelCountByBrand.get(brand.id) ?? 0} modelos`, align: 'right', sortable: true, sortValue: (brand) => modelCountByBrand.get(brand.id) ?? 0, searchValue: (brand) => String(modelCountByBrand.get(brand.id) ?? 0) },
    { id: 'status', header: view.columns.find((column) => column.id === 'status')?.header ?? 'Estado', cell: (brand) => status(brand.active), sortable: true, sortValue: (brand) => Number(brand.active), searchValue: (brand) => (brand.active ? 'activo' : 'inactivo') },
    { id: 'sortOrder', header: view.columns.find((column) => column.id === 'sortOrder')?.header ?? 'Orden', cell: (brand) => brand.sortOrder, align: 'right', sortable: true, sortValue: (brand) => brand.sortOrder, searchValue: (brand) => String(brand.sortOrder) },
  ];

  return <PageShell breadcrumbs={breadcrumbItems(view.breadcrumbs)} description={view.description} title={view.title}>
    <div data-master-data-brands>
      <DataTable caption={view.title} columns={columns} emptyMessage={view.emptyMessage} getRowId={(brand) => brand.id} initialPageSize={5} pageSizeOptions={[5, 10, 25]} rows={brands} searchable searchLabel={view.searchLabel} searchPlaceholder={view.searchPlaceholder} />
    </div>
  </PageShell>;
}

export function MasterDataDeviceModelsPage({ masterDataProvider, viewProvider }: MasterDataAdminPageProps) {
  const view = viewProvider.getView('deviceModels');
  const brandsById = new Map(masterDataProvider.getBrands().map((brand) => [brand.id, brand]));
  const models = masterDataProvider.getDeviceModels();

  const columns: readonly DataTableColumn<MasterDataDeviceModelDto>[] = [
    { id: 'name', header: view.columns.find((column) => column.id === 'name')?.header ?? 'Modelo', cell: (model) => <div><strong className="text-slate-900">{model.name}</strong><div className="text-xs text-slate-400">{model.id}</div></div>, sortable: true, sortValue: (model) => model.name, searchValue: (model) => textSearch([model.name, model.slug, model.id]) },
    { id: 'brand', header: view.columns.find((column) => column.id === 'brand')?.header ?? 'Marca', cell: (model) => brandsById.get(model.brandId)?.name ?? model.brandId, sortable: true, sortValue: (model) => brandsById.get(model.brandId)?.name ?? model.brandId, searchValue: (model) => brandsById.get(model.brandId)?.name ?? model.brandId },
    { id: 'code', header: view.columns.find((column) => column.id === 'code')?.header ?? 'Código', cell: (model) => model.modelCode ?? 'Sin código', sortable: true, sortValue: (model) => model.modelCode ?? '', searchValue: (model) => model.modelCode ?? '' },
    { id: 'slug', header: view.columns.find((column) => column.id === 'slug')?.header ?? 'Slug', cell: (model) => <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">{model.slug}</code>, sortable: true, sortValue: (model) => model.slug, searchValue: (model) => model.slug },
    { id: 'status', header: view.columns.find((column) => column.id === 'status')?.header ?? 'Estado', cell: (model) => status(model.active), sortable: true, sortValue: (model) => Number(model.active), searchValue: (model) => (model.active ? 'activo' : 'inactivo') },
    { id: 'sortOrder', header: view.columns.find((column) => column.id === 'sortOrder')?.header ?? 'Orden', cell: (model) => model.sortOrder, align: 'right', sortable: true, sortValue: (model) => model.sortOrder, searchValue: (model) => String(model.sortOrder) },
  ];

  return <PageShell breadcrumbs={breadcrumbItems(view.breadcrumbs)} description={view.description} title={view.title}>
    <div data-master-data-device-models>
      <DataTable caption={view.title} columns={columns} emptyMessage={view.emptyMessage} getRowId={(model) => model.id} initialPageSize={5} pageSizeOptions={[5, 10, 25]} rows={models} searchable searchLabel={view.searchLabel} searchPlaceholder={view.searchPlaceholder} />
    </div>
  </PageShell>;
}

export function MasterDataCategoriesPage({ masterDataProvider, viewProvider }: MasterDataAdminPageProps) {
  const view = viewProvider.getView('categories');
  const categories = masterDataProvider.getCategories();
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  const columns: readonly DataTableColumn<MasterDataCategoryDto>[] = [
    { id: 'name', header: view.columns.find((column) => column.id === 'name')?.header ?? 'Categoría', cell: (category) => <div><strong className="text-slate-900">{category.name}</strong><div className="max-w-md text-xs text-slate-400">{category.description}</div></div>, sortable: true, sortValue: (category) => category.name, searchValue: (category) => textSearch([category.name, category.slug, category.description, category.id]) },
    { id: 'parent', header: view.columns.find((column) => column.id === 'parent')?.header ?? 'Padre', cell: (category) => category.parentId ? categoriesById.get(category.parentId)?.name ?? category.parentId : 'Raíz', sortable: true, sortValue: (category) => category.parentId ? categoriesById.get(category.parentId)?.name ?? category.parentId : 'Raíz', searchValue: (category) => category.parentId ? categoriesById.get(category.parentId)?.name ?? category.parentId : 'Raíz' },
    { id: 'storefront', header: view.columns.find((column) => column.id === 'storefront')?.header ?? 'Storefront', cell: (category) => yesNo(category.showInStorefront), sortable: true, sortValue: (category) => Number(category.showInStorefront), searchValue: (category) => (category.showInStorefront ? 'visible' : 'oculto') },
    { id: 'status', header: view.columns.find((column) => column.id === 'status')?.header ?? 'Estado', cell: (category) => status(category.active), sortable: true, sortValue: (category) => Number(category.active), searchValue: (category) => (category.active ? 'activo' : 'inactivo') },
    { id: 'sortOrder', header: view.columns.find((column) => column.id === 'sortOrder')?.header ?? 'Orden', cell: (category) => category.sortOrder, align: 'right', sortable: true, sortValue: (category) => category.sortOrder, searchValue: (category) => String(category.sortOrder) },
  ];

  return <PageShell breadcrumbs={breadcrumbItems(view.breadcrumbs)} description={view.description} title={view.title}>
    <div data-master-data-categories>
      <DataTable caption={view.title} columns={columns} emptyMessage={view.emptyMessage} getRowId={(category) => category.id} initialPageSize={5} pageSizeOptions={[5, 10, 25]} rows={categories} searchable searchLabel={view.searchLabel} searchPlaceholder={view.searchPlaceholder} />
    </div>
  </PageShell>;
}

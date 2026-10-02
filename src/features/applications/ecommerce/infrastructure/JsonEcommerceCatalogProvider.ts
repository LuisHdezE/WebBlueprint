import rawProducts from './products.catalog.json';
import rawProductsView from './products.view.json';
import rawShopView from './shop.view.json';
import rawDetailView from './detail.view.json';
import type { EcommerceCatalogProvider } from '../application/ecommerce.contracts';
import type { ProductDetailViewDto } from '../application/detail.dto';
import type { ProductDto, ProductsViewDto } from '../application/ecommerce.dto';
import type { ShopViewDto } from '../application/shop.dto';

const statuses = new Set(['Publicado', 'Borrador', 'Agotado']);
function isProduct(value: unknown): value is ProductDto {
  if (!value || typeof value !== 'object') return false;
  const product = value as Record<string, unknown>;
  return ['id', 'sku', 'name', 'category', 'price', 'summary'].every((key) => typeof product[key] === 'string' && product[key])
    && typeof product.stock === 'number' && typeof product.status === 'string' && statuses.has(product.status)
    && typeof product.featured === 'boolean';
}
function assertStringFields(view: Record<string, unknown>, fields: readonly string[], label: string) {
  for (const field of fields) if (typeof view[field] !== 'string' || !view[field]) throw new Error(`Invalid ${label} view field: ${field}`);
}
function assertBreadcrumbs(view: Record<string, unknown>, label: string) {
  if (!Array.isArray(view.breadcrumbs) || !view.breadcrumbs.every((value) => typeof value === 'string' && value)) throw new Error(`Invalid ${label} breadcrumbs.`);
}
const validated = rawProducts.filter(isProduct);
if (validated.length !== rawProducts.length) throw new Error('Invalid ecommerce catalog.');
const [firstProduct, ...remainingProducts] = validated;
if (!firstProduct) throw new Error('Ecommerce catalog must contain at least one product.');
const products: [ProductDto, ...ProductDto[]] = [firstProduct, ...remainingProducts];

export class JsonEcommerceCatalogProvider implements EcommerceCatalogProvider {
  getProducts() { return products; }
  getProductsView(): ProductsViewDto {
    const view = rawProductsView as Record<string, unknown>;
    assertStringFields(view, ['title', 'description', 'searchLabel', 'searchPlaceholder', 'categoryLabel', 'allCategoriesLabel', 'productsLabel', 'skuLabel', 'priceLabel', 'stockLabel', 'statusLabel'], 'products');
    assertBreadcrumbs(view, 'products');
    const categories = [...new Set(products.map((product) => product.category))];
    return { ...rawProductsView, categories, products } as ProductsViewDto;
  }
  getProductDetailView(): ProductDetailViewDto {
    const view = rawDetailView as Record<string, unknown>;
    assertStringFields(view, ['title', 'description', 'productId', 'skuLabel', 'categoryLabel', 'stockLabel', 'featuredLabel', 'relatedProductsLabel'], 'detail');
    assertBreadcrumbs(view, 'detail');
    if (!products.some((product) => product.id === rawDetailView.productId)) throw new Error('Detail product must exist in the canonical ecommerce catalog.');
    return rawDetailView as ProductDetailViewDto;
  }
  getShopView(): ShopViewDto {
    const view = rawShopView as Record<string, unknown>;
    assertStringFields(view, ['title', 'description', 'searchLabel', 'searchPlaceholder', 'categoryLabel', 'allCategoriesLabel', 'featuredLabel', 'availableLabel', 'outOfStockLabel'], 'shop');
    assertBreadcrumbs(view, 'shop');
    return rawShopView as ShopViewDto;
  }
}

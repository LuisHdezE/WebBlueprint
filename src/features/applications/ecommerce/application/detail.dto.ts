export interface ProductDetailViewDto {
  title: string;
  description: string;
  breadcrumbs: readonly string[];
  productId: string;
  skuLabel: string;
  categoryLabel: string;
  stockLabel: string;
  featuredLabel: string;
  relatedProductsLabel: string;
}

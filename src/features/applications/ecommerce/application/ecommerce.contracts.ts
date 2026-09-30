import type { ProductDto,ProductsViewDto } from './ecommerce.dto';export interface EcommerceCatalogProvider{getProducts():readonly [ProductDto,...ProductDto[]];getProductsView():ProductsViewDto}

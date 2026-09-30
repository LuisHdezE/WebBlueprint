export type ProductStatusDto='Publicado'|'Borrador'|'Agotado';
export interface ProductDto{id:string;sku:string;name:string;category:string;price:string;stock:number;status:ProductStatusDto;summary:string;featured:boolean}
export interface ProductsViewDto{title:string;description:string;breadcrumbs:readonly string[];searchLabel:string;searchPlaceholder:string;categoryLabel:string;allCategoriesLabel:string;productsLabel:string;skuLabel:string;priceLabel:string;stockLabel:string;statusLabel:string;categories:readonly string[];products:readonly [ProductDto,...ProductDto[]]}

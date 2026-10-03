import rawStorefront from './storefront.view.json';
import type { StorefrontProvider } from '../application/storefront.contracts';
import type { StorefrontHomeViewDto, StorefrontShellViewDto, StorefrontViewDto } from '../application/storefront.dto';

export class JsonStorefrontProvider implements StorefrontProvider {
  getStorefrontView(): StorefrontViewDto {
    const view = rawStorefront as StorefrontViewDto;
    if (!view.shell?.storeName || !view.shell.primaryNav.length || !view.shell.categoryNav.length || !view.home?.title || !view.home.ctas.length) {
      throw new Error('Storefront demo data is incomplete.');
    }
    return view;
  }

  getShellView(): StorefrontShellViewDto {
    return this.getStorefrontView().shell;
  }

  getHomeView(): StorefrontHomeViewDto {
    return this.getStorefrontView().home;
  }
}

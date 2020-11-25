import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';

export class CustomUrl implements UrlSerializer {
  private defaultUrlSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

  parse(url: string): UrlTree {
    // Encode "%20" to "+"
    if (url.match(/\/search/gi)) {
      url = url.replace(/\%20|\%2B/gi, '+');
    }
    // Use the default serializer.
    return this.defaultUrlSerializer.parse(url);
  }

  serialize(tree: UrlTree): string {
    if (this.defaultUrlSerializer.serialize(tree).match(/\/search/gi)) {
      return this.defaultUrlSerializer.serialize(tree).replace(/\%20|\%2B/gi, '+');
    } else {
      return this.defaultUrlSerializer.serialize(tree);
    }
  }
}

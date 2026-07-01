import { AsciiSpriteCache } from "../index";

export class AoeSpriteCache {
  private cache: AsciiSpriteCache;

  constructor(cache: AsciiSpriteCache) {
    this.cache = cache;
  }

  public preRenderAll() {
    this.cache.preRender('ISO_GRASS',
`   /\\
  /  \\
  \\  /
   \\/   `, '#005500');

    this.cache.preRender('VILLAGER',
` [v_v]
 /| |\\
  / \\  `, '#FFFF33');

    this.cache.preRender('CLUBMAN',
` [>_<]P
 /| |
 / \\   `, '#FF3333');

    this.cache.preRender('TOWN_CENTER',
`   /\\
  /  \\
 /____\\
 |    |
 |____| `, '#AAAAAA');

   this.cache.preRender('TREE',
`  /\\
 //\\\\
  ||  `, '#00AA00');
  }
}

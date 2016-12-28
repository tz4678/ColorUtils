/**
  * @author Sergei Snegirev <tz4678@gmail.com>
  * @copyright Sergei Snegirev 2016
  */
;(() => {
  'use strict';
  let COLOR_NAMES = Object.freeze({
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32',
  });

  function hasOwn(prop, o) {
    if (o === void 0 || o === null) {
      return false;
    } else {
      return Object.prototype.hasOwnProperty.call(o, prop);
    }
  }

  /**
   * Обрезает значение меньше 0 и больше max
   */
  function clamp(n, max, min = 0) {
    if (min > max) {
      [max, min] = [min, max];
    }
    return Math.min(max, Math.max(min, n));
  }

  // bound(n, max)
  // bound(n, max, min)
  // bound(n, min, max)
  // bound(-480, 0, 360) -> 240
  function bound(n, max, min = 0) {
    if (min > max) {
      let temp = max;
      max = min;
      min = temp;
    }
    let diff = max - min;
    while (n < min) {
      n += diff;
    }
    while (n > max) {
      n -= diff;
    }
    return n;
  }

  class Hsl {
    constructor(h, s, l) {
      this.h = h; // 0-360°
      this.s = s; // 0-100%
      this.l = l; // 0-100%
    }

    set h(v) {
      this._h = bound(v, 360);
    }

    set s(v) {
      this._s = clamp(v, 100);
    }

    set l(v) {
      this._l = clamp(v, 100);
    }

    get h() {
      return this._h;
    }

    get s() {
      return this._s;
    }

    get l() {
      return this._l;
    }

    eq(o) {
      return o instanceof Hsl &&
        this.h === o.h &&
        this.s === o.s &&
        this.l === o.l;
    }

    toRgb() {
      // https://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
      // if H is undefined - это какое-то неожиданное значение
      // http://math.stackexchange.com/questions/1228586/what-does-the-term-undefined-actually-mean
      let h = this.h / 60
        , s = this.s / 100
        , l = this.l / 100
        , c = (1 - Math.abs(2 * l - 1)) * s
        , x = c * (1 - Math.abs(h % 2 - 1))
        , i = ~~h
        , r = [c, x, 0, 0, x, c][i]
        , g = [x, c, c, x, 0, 0][i]
        , b = [0, 0, x, c, c, x][i]
        , m = l - c / 2;
      return new Rgb((r + m) * 255, (g + m) * 255, (b + m) * 255);
    }
  }

  class Hsv /* = Hsb */ {
    constructor(h, s, v) {
      // https://ru.wikipedia.org/wiki/HSV_(цветовая_модель)
      // Тон
      this.h = h; // 0-360°
      // Насыщенность
      this.s = s; // 0-100%
      // Яркость
      this.v = v; // 0-100%
    }

    set h(v) {
      this._h = bound(v, 360);
    }

    set s(v) {
      this._s = clamp(v, 100);
    }

    set v(v) {
      this._v = clamp(v, 100);
    }

    get h() {
      return this._h;
    }

    get s() {
      return this._s;
    }
    
    get v() {
      return this._v;
    }

    eq(o) {
      return o instanceof Hsv &&
        this.h === o.h &&
        this.s === o.s &&
        this.v === o.v;
    }

    toRgb() {
      // https://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
      let h = this.h / 60
        , s = this.s / 100
        , v = this.v / 100
        , c = v * s
        , x = c * (1 - Math.abs(h % 2 - 1))
        , i = ~~h
        , r = [c, x, 0, 0, x, c][i]
        , g = [x, c, c, x, 0, 0][i]
        , b = [0, 0, x, c, c, x][i]
        , m = v - c;
      return new Rgb((r + m) * 255, (g + m) * 255, (b + m) * 255);
    }
  }

  class Cmyk {
    constructor(c, m, y, k) {
      this.c = c; // 0-100%
      this.m = m; // 0-100%
      this.y = y; // 0-100%
      this.k = k; // 0-100%
    }

    set c(v) {
      this._c = clamp(v, 100);
    }

    set m(v) {
      this._m = clamp(v, 100);
    }

    set y(v) {
      this._y = clamp(v, 100);
    }

    set k(v) {
      this._k = clamp(v, 100);
    }

    get c() {
      return this._c;
    }

    get m() {
      return this._m;
    }

    get y() {
      return this._y;
    }

    get k() {
      return this._k;
    }

    eq(o) {
      return o instanceof Cmyk &&
        this.c === o.c &&
        this.m === o.m &&
        this.y === o.y &&
        this.k === k;
    }

    toRgb() {
      let c = this.c / 100
        , m = this.m / 100
        , y = this.y / 100
        , k = this.k / 100
        , d = 1 - k;
      return new Rgb(
        255 * (1 - c) * d,
        255 * (1 - m) * d,
        255 * (1 - y) * d
      );
    }
  }

  class Xyz {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    set x(v) {
      this._x = clamp(v, 95.047);
    }

    set y(v) {
      this._y = clamp(v, 100);
    }

    set z(v) {
      this._z = clamp(v, 108.883);
    }

    get x() {
      return this._x;
    }

    get y() {
      return this._y;
    }

    get z() {
      return this._z;
    }

    eq(o) {
      return o instanceof Xyz &&
        this.x === o.x &&
        this.y === o.y &&
        this.z === o.z;
    }

    toRgb() {
      // http://www.easyrgb.com/index.php?X=MATH&H=01#text1
      function f(c) {
        return (c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c) * 255;
      }

      let x = this.x / 100
        , y = this.y / 100
        , z = this.z / 100
        , r = x * 3.2406 + y * -1.5372 + z * -0.4986
        , g = x * -0.9689 + y * 1.8758 + z * 0.0415
        , b = x * 0.0557 + y * -0.2040 + z * 1.0570;
      return new Rgb(f(r), f(g), f(b));
    }

    toLab() {
      function f(c) {
        return c > 0.008856 ? Math.pow(c, 1 / 3) : (7.787 * c) + (16 / 116);
      }

      let x = f(this.x / 95.047)          
        , y = f(this.y / 100)          
        , z = f(this.z / 108.883)
        , l = (116 * y) - 16
        , a = 500 * (x - y)
        , b = 200 * (y - z);
      return new Lab(l, a, b);
    }

    toLch() {
      return this.toLab().toLch();
    }
  }

  // CIE-L*ab
  class Lab {
    // Just as in Lch, the vertical L* axis represents Lightness, ranging from
    // 0-100.
    // In theory there are no maximum values of a* and b*, but in practice they
    // are usually numbered from -128 to +127 (256 levels).
    // http://www.colourphil.co.uk/lab_lch_colour_space.shtml
    constructor(l, a, b) {
      this.l = l;
      this.a = a;
      this.b = b;
    }

    set l(v) {
      this._l = clamp(v, 100);
    }

    set a(v) {
      this._a = clamp(v, -128, 127);
    }

    set b(v) {
      this._b = clamp(v, -128, 127);
    }

    get l() {
      return this._l;
    }

    get a() {
      return this._a;
    }

    get b() {
      return this._b;
    }

    eq(o) {
      return o instanceof Lab &&
        this.l === o.l &&
        this.a === o.a &&
        this.b === o.b;
    }

    toRgb() {
      return this.toXyz().toRgb();
    }

    toXyz() {
      // https://en.wikipedia.org/wiki/Lab_color_space#CIELAB-CIEXYZ_conversions
      // https://openlayers.org/en/latest/examples/color-manipulation.html
      function f(t) {
        return t > 6 / 29 ? t * t * t : 3 * Math.pow(6 / 29, 2) * (t - 4 / 29);
      }

      return new Xyz(
        95.047 * f((this.l + 16) / 116 + this.a / 500),
        100 * f((this.l + 16) / 116),
        108.883 * f((this.l + 16) / 116 - this.b / 200)
      );
    }

    toLch() {
      let l = this.l
        , c = Math.sqrt(this.a * this.a + this.b * this.b)
        , h = Math.atan2(this.b, this.a);
      h = h > 0 ? h / Math.PI * 180 : 360 - (Math.abs(h) / Math.PI) * 180;
      return new Lch(l, c, h); 
    }
  }

  // CIE-L*CH
  class Lch {
    constructor(l, c, h) {
      this.l = l;
      this.c = c;
      this.h = h;
    }

    // http://www.colourphil.co.uk/lab_lch_colour_space.shtml
    set l(v) {
      this._l = clamp(v, 100);
    }

    // http://davidjohnstone.net/pages/lch-lab-colour-gradient-picker
    // c 0..140
    set c(v) {
      this._c = clamp(v, 140);
    }

    set h(v) {
      // fixed
      this._h = bound(v, 360);
    }

    get l() {
      return this._l;
    }

    get c() {
      return this._c;
    }

    get h() {
      return this._h;
    }

    eq(o) {
      return o instanceof Lab &&
        this.l === o.l &&
        this.a === o.a &&
        this.b === o.b;
    }

    toLab() {
      let l = this.l
        , c = this.c
        , h = this.h * Math.PI / 180;
      return new Lab(l, Math.cos(h) * c, Math.sin(h) * c);
    }

    toRgb() {
      return this.toLab().toRgb();
    }
  }

  // https://github.com/bahamas10/node-ryb2rgb/blob/master/ryb2rgb.js
  class Ryb {
    constructor(r, y, b) {
      this.r = r; // 0-255
      this.y = y; // 0-255
      this.b = b; // 0-255
    }

    // Math.floor некорректно работает
    set r(v) {
      this._r = Math.round(clamp(v, 255));
    }

    set y(v) {
      this._y = Math.round(clamp(v, 255));
    }

    set b(v) {
      this._b = Math.round(clamp(v, 255));
    }

    get r() {
      return this._r;
    }

    get y() {
      return this._y;
    }

    get b() {
      return this._b;
    }

    toRgb() {
      let r = this.r
        , y = this.y
        , b = this.b
        , w = Math.min(Math.min(r, y), b);
      // remove the whiteness from the color
      r -= w;
      y -= w;
      b -= w;
      let my = Math.max(Math.max(r, y), b);
      // get the green out of the yellow and blue
      let g = Math.min(y, b);
      y -= g;
      b -= g;
      if(b != 0 && g != 0) {
        b *= 2.0;
        g *= 2.0;
      }  
      // redistribute the remaining yellow
      r += y;
      g += y;
      // normalize to values
      let mg = Math.max(Math.max(r, g), b);
      if(mg != 0){
        let n = my / mg;
        r *= n;
        g *= n;
        b *= n;
      }
      // add the white back in
      r += w;
      g += w;
      b += w;
      return new Rgb(r, g, b);
    }
  }

  class Rgb {
    constructor(r, g, b) {
      // По идее должно привести к ускорению
      this.data = new Uint8ClampedArray(3);
      this.data[0] = r;
      this.data[1] = g;
      this.data[2] = b;
    }
    /*
    // Math.floor некорректно работает
    set r(v) {
      this._r = Math.round(clamp(v, 255));
    }

    set g(v) {
      this._g = Math.round(clamp(v, 255));
    }

    set b(v) {
      this._b = Math.round(clamp(v, 255));
    }

    get r() {
      return this._r;
    }

    get g() {
      return this._g;
    }

    get b() {
      return this._b;
    }*/

    set r(v) {
      this.data[0] = v;
    }

    set g(v) {
      this.data[1] = v;
    }

    set b(v) {
      this.data[2] = v;
    }

    get r() {
      return this.data[0];
    }

    get g() {
      return this.data[1];
    }

    get b() {
      return this.data[2];
    }

    eq(o) {
      return o instanceof Rgb &&
        this.r === o.r &&
        this.g === o.g &&
        this.b === o.b;
    }

    toHex() {
      let h = ((this.r << 16) + (this.g << 8) + this.b).toString(16); 
      return '#000000'.slice(0, -h.length) + h;
    }

    toHsl() {
      let r = this.r / 255
        , g = this.g / 255
        , b = this.b / 255
        , max = Math.max(r, g, b)
        , min = Math.min(r, g, b)
        , d = max - min
        , l = (max + min) / 2
        , s = d ? d / (1 - Math.abs(2 * l - 1)) : 0
        , h;
      if (d === 0) {
        h = 0;
      } else {
        switch (max) {
          case r:
            h = (g - b) / d % 6;
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h *= 60;
      }
      return new Hsl(h, s * 100, l * 100);
    }

    toHsv() {
      // https://ru.wikipedia.org/wiki/HSV_(цветовая_модель)#HSV_.E2.86.92_RGB
      let r = this.r / 255
        , g = this.g / 255
        , b = this.b / 255
        , max = Math.max(r, g, b)
        , min = Math.min(r, g, b)
        , d = max - min;
      // 1 - min / max =  max / max - min / max = (max - min) / max = d / max
      let h, s = max ? d / max : 0, v = max;
      if (max == min) {
        h = 0;
      } else { 
        switch (max) {
          case r:
            h = 60 * (g - b) / d + (r < b ? 360 : 0);
            break;
          case g:
            h = 60 * (b - r) / d + 120;
            break;
          case b:
            h = 60 * (r - g) / d + 240;
            break;
        }
      }
      return new Hsv(h, s * 100, v * 100);
    }

    toCmyk() {
      // http://www.rapidtables.com/convert/color/rgb-to-cmyk.htm
      let r = this.r / 255
        , g = this.g / 255
        , b = this.b / 255
        , k = 1 - Math.max(r, g, b)
        , d = 1 - k
        , c = (d - r) / d
        , m = (d - g) / d
        , y = (d - b) / d;
      return new Cmyk(c * 100, m * 100, y * 100, k * 100);
    }

    toXyz() {
      // Переписать
      // http://www.easyrgb.com/index.php?X=MATH&H=02
      // print(';\n'.join([x for x in s.lower().replace('var_', '').splitlines() if x.strip()]))
      function f(c) {
        c /= 255;
        c = c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
        c *= 100;
        return c;
      }

      let r = f(this.r)
        , g = f(this.g)
        , b = f(this.b)
        , x = r * 0.4124 + g * 0.3576 + b * 0.1805
        , y = r * 0.2126 + g * 0.7152 + b * 0.0722
        , z = r * 0.0193 + g * 0.1192 + b * 0.9505;
      return new Xyz(x, y, z);
    }


    toLab() {
      return this.toXyz().toLab();
    }

    toLch() {
      // RGB -> XYZ -> LAB -> LCH
      return this.toLab().toLch();
    }

    toRyb() {
      // Переписать?
      // https://github.com/benjholla/ColorMixer/blob/master/ColorMixer/src/colormixer/ColorSpace.java#L205
      let r = this.r;
      let g = this.g;
      let b = this.b;
      // remove the whiteness from the color
      let w = Math.min(Math.min(r, g, b));
      r -= w;
      g -= w;
      b -= w;
      let mg = Math.max(Math.max(r, g), b);
      // get the yellow out of the red and green
      let y = Math.min(r, g);
      r -= y;
      g -= y;   
      // if this unfortunate conversion combines blue and green, then cut each in half to preserve the value's maximum range 
      if(b != 0 && g != 0) {
        b /= 2;
        g /= 2;
      }
      // redistribute the remaining green
      y += g;
      b += g;
      // normalize to values
      let my = Math.max(r, Math.max(y, b));
      if (my != 0) {
        let n = mg / my;
        r *= n;
        y *= n;
        b *= n;
      }
      // add back in white
      r += w;
      y += w;
      b += w;
      // Я не ручаюсь за точность преобразований
      // double a = 126.66666666666667;
      // int b = (int) a;
      // System.out.println(b);
      // Выведет 126
      // У меня же числа округляются
      // console.log(r, y, b);
      return new Ryb(r, y, b);
    } 

    static fromHex(s) {
      let m = /^#((?:[A-Fa-f0-9]{3}){1,2})$/.exec(s);
      if (m) {
        let h = m[1]
          , v = parseInt(h, 16)
          , [r, g, b] = h.length > 3
            ? [v >> 16, v >> 8 & 255, v & 255]
            // 255 / 15 = 17
            : [(v >> 8) * 17, (v >> 4 & 15) * 17, (v & 15) * 17];
        return new Rgb(r, g, b);
      }
      return null;
    }
  }

  function getHexByName(name) {
    name = name.toLowerCase();
    return hasOwn(name, COLOR_NAMES) ? COLOR_NAMES[name] : null;
  }

  // В качестве внутренней кодировки использует Rgb
  class Color {
    // new Color('red')
    // new Color('#f00')
    // new Color([255, 0, 0])
    // new Color(new Cmyk(0, 100, 100, 0))
    constructor(obj) {
      if (obj === null || obj === void 0) {
        this._rgb = new Rgb(0, 0, 0);
      } else if (obj instanceof Color || obj instanceof Rgb) {
        let {r, g, b} = obj;
        this._rgb = new Rgb(r, g, b);
      } else if ([
            Hsl, Hsv, Cmyk, Xyz, Lab, Lch, Ryb
          ].includes(obj.constructor)) {
        this._rgb = obj.toRgb();
      } else if (typeof obj === 'string') {
        let hex = getHexByName(obj);
        let str = hex === null ? obj : hex;
        let rgb = Rgb.fromHex(str);
        if (rgb === null) {
          throw new TypeError();
        }
        this._rgb = rgb;
      } else if (Array.isArray(obj) || obj instanceof TypedArray) {
        this._rgb = new Rgb(...obj);
      } else {
        throw new TypeError();
      }
    }

    get r() {
      return this._rgb.r;
    }

    get g() {
      return this._rgb.g;
    }

    get b() {
      return this._rgb.b;
    }

    set r(v) {
      this._rgb.r = v;
    }
    
    set g(v) {
      this._rgb.g = v;
    }

    set b(v) {
      this._rgb.b = v;
    }

    // new Color([255,0,0]).eq('#f00') -> true
    eq(obj) {
      let color;
      if (obj instanceof Color) {
        color = obj;
      } else {
        try {
          color = new Color(obj);
        } catch (e) {
          return false;
        }
      }
      return this.r === obj.r && this.g === obj.g && this.b === obj.b;
    }

    clone() {
      return new Color(this);
    }

    convert(format) {
      format = format.toLowerCase();
      switch (format) {
        case 'hsl':
          return this._rgb.toHsl();
        case 'hsv':
        case 'hsb':
          return this._rgb.toHsv();
        case 'cmyk':
          return this._rgb.toCmyk();
        case 'xyz':
          return this._rgb.toXyz();
        case 'lab':
        case 'cielab':
          return this._rgb.toLab();
        case 'lch':
        case 'cielch':
          return this._rgb.toLch();
        case 'ryb':
          return this._rgb.toRyb();
        default:
          throw new Error("Unknown format: " + format);
      }
    }

    // http://www.easyrgb.com/index.php?X=WEEL

    triadic() {
      let {l, c, h} = this._rgb.toLch();
      return [
        this.clone(),
        // 0° = 360°, поэтому тут применяем остаток от деления
        // 45 % 360 = 45, 360 % 360 = 0, 480 % 360 = 120
        // angle = angle > 180 ? angle - 180 : angle + 180 
        new Color(new Lch(l, c, bound(h + 120, 360))),
        new Color(new Lch(l, c, bound(h + 240, 360))),
      ];
    }

    splitComplements() {
      let {l, c, h} = this._rgb.toLch();
      return [
        this.clone(),
        new Color(new Lch(l, c, bound(h + 150, 360))),
        new Color(new Lch(l, c, bound(h + 210 /* 360 - 150 */, 360))),
      ];
    }

    analogous() {
      let {l, c, h} = this._rgb.toLch();
      return [
        this.clone(),
        new Color(new Lch(l, c, bound(h + 30, 360))),
        new Color(new Lch(l, c, bound(h + 330, 360))),
      ];
    }

    tetradic() {
      let {l, c, h} = this._rgb.toLch();
      return [
        this.clone(),
        new Color(new Lch(l, c, bound(h + 90, 360))),
        new Color(new Lch(l, c, bound(h + 180, 360))),
        new Color(new Lch(l, c, bound(h + 270, 360))),
      ];
    }

    // Ранее работало аналогично (использовалось hsv вместо lch):
    // http://www.colorpicker.com/00bfff
    // new Color('#00BFFF').complement().dump()
    // #ff4000
    // new Color('#00BFFF').triad().forEach(c=>c.dump())
    // #00bfff
    // #ff00bf
    // #bfff00
    // new Color('#00BFFF').tetrad().forEach(c=>c.dump())
    // #00bfff
    // #c000ff
    // #ff4000
    // #40ff00
    monochromatic(results /* = ? */) {
      throw 'Not Implemented Yet';
    }

    /**
     * @return {Color} Returns a complementary color.
     */
    complement() {
      let lch = this._rgb.toLch();
      lch.h = bound(lch.h + 180, 360);
      return new Color(lch);
    }

    // Add more functions

    lighten(amount = 20) {
      let hsl = this._rgb.toHsl();
      // Чтобы понять зачем это делается, нужно с ползунками поиграть на этом
      // сайте http://colorizer.org/
      hsl.l += amount;
      this._rgb = hsl.toRgb();
      return this;
    }

    darken(amount = 20) {
      let hsl = this._rgb.toHsl();
      hsl.l -= amount;
      this._rgb = hsl.toRgb();
      return this;
    }

    mix(color, fraction = 0.5) {
      let ryb = this._rgb.toRyb();
      let ryb2 = new Color(color).convert('ryb');
      for (let i of ['r', 'y', 'b']) {
        ryb[i] = ryb[i] * fraction + ryb2[i] * (1 - fraction);
      }
      return new Color(ryb);
    }

    // It's works in Chrome
    dump() {
      // http://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
      let l = this._rgb.toHsl().l
        , h = this._rgb.toHex();
      // https://coderwall.com/p/fskzdw/colorful-console-log
      console.log(
        '%c%s',
        [
          'background:' + h,
          'color:' + (l > 17.9 ? 'black' : 'white'),
        ].join(';'), 
        h
      );
    }

    toString() {
      return this._rgb.toHex();
    }
  }

  let ColorUtils = {
    COLOR_NAMES,
    Color,
    Rgb, Hsl, Hsv,Cmyk, Xyz, Lab, Lch, Ryb,
    getHexByName
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorUtils;
  } else {
    // Терминология: атрибут имеет строковое значенией, а свойство любое
    if (hasOwn('ColorUtils', this)) {
      console.warn('Property "ColorUtils" already has been defined');
    } 
    this.ColorUtils = ColorUtils;
  }
})();

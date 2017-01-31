;(function () {
  /**
    * @author Sergei Snegirev <tz4678@gmail.com>
    */
  'use strict';

  const self = this;

  function clamp(n, min, max) {
    return n < min ? min : n > max ? max : n;
  }

  function interpolate(a, b, t = 0.5) {
    return a + (b - a) * t;
  }

  function normalizeAngle(angle) {
    while (angle < 0) {
      angle += 360;
    }
    // 360 = 0
    while (angle >= 360) {
      angle -= 360;
    }
    return angle;
  }

  class Color {
    constructor(r = 0, g = 0, b = 0) {
      this.r = r;
      this.g = g;
      this.b = b;
    }

    set r(v) {
      this._r = Math.round(clamp(v, 0, 255));
    }

    set g(v) {
      this._g = Math.round(clamp(v, 0, 255));
    }

    set b(v) {
      this._b = Math.round(clamp(v, 0, 255));
    }

    get r() {
      return this._r;
    }

    get g() {
      return this._g;
    }

    get b() {
      return this._b;
    }

    eq(o) {
      return this.r === o.r && this.g === o.g && this.b === o.b; 
    }

    clone() {
      return new Color(this.r, this.g, this.b);
    }

    hex() {
      const v = 0x1000000 | (this.r << 16 | this.g << 8 | this.b);
      return '#' + v.toString(16).slice(-6);
    }

    rgb() {
      return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    toString() {
      return this.hex();
    }

    websafe() {
      const f = (c) => Math.round(c / 51) * 51;
      return new Color(f(this.r), f(this.g), f(this.b));
    }

    // http://stackoverflow.com/a/3943023/2240578

    // https://www.w3.org/TR/WCAG20/#relativeluminancedef
    
    luminance() {
      const f = (c) => c > 0.03928
        ? Math.pow((c + 0.055) / 1.055, 2.4)
        : c / 12.92;
      const r = f(this.r / 255);
      const g = f(this.g / 255);
      const b = f(this.b / 255); 
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    blackOrWhiteText() {
      return this.luminance() > 0.179 ? 'black' : 'white';
    }

    show() {
      const a = this.hex();
      const b = this.blackOrWhiteText();
      console.log('%c' + a, `background:${a};color:${b}`);
    }

    interpolateTo(color, t = 0.5) {
      return new Color(
        interpolate(this.r, color.r, t),
        interpolate(this.g, color.g, t),
        interpolate(this.b, color.b, t)
      );
    }

    // https://en.wikipedia.org/wiki/Tints_and_shades

    tint(t = 0.5) {
      return this.interpolateTo(self.COLORS.white, t);
    }

    shade(t = 0.5) {
      return this.interpolateTo(self.COLORS.black, t);
    }

    tone(t = 0.5) {
      return this.interpolateTo(self.COLORS.grey, t);
    }

    hsv() {
      // http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
      const r = this.r / 255;
      const g = this.g / 255;
      const b = this.b / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const d = max - min;
      let h = 0;
      if (d) {
        if (max === r) {
          h = (g - b) / d % 6;
        } else if (max === g) {
          h = (b - r) / d + 2;
        } else {
          h = (r - g) / d + 4;
        }
        h *= 60;
      }
      return {
        h,
        s: max === 0 ? 0 : d / max,
        v: max
      };
    }

    hueShift(shift) {
      const hsv = this.hsv();
      hsv.h += shift;
      // console.log(hsv);
      return Color.fromHsv(hsv);
    }

    complement() {
      return this.hueShift(180);
    }

    // Движемся по часовой стрелке
    triad(angle = 120) {
      return [
        this.clone(),
        this.hueShift(angle),
        this.hueShift(-angle)
      ];
    }

    splitComplements() {
      return this.triad(150);
    }

    analogous() {
      return this.triad(30);
    }

    // Double split complementary
    tetrad(angle = 90) {
      return [
        this.clone(),
        this.hueShift(angle),
        this.complement(),
        this.hueShift(180 + angle)
      ];
    }

    static fromHex(h) {
      if (!/^#(?:[\da-f]{3}){1,2}$/i.test(h)) {
        return null;
      }
      h = h.slice(1);
      if (h.length === 3) {
        h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; 
      }
      h = parseInt(h, 16);
      return new Color(h >> 16, h >> 8 & 255, h & 255);
    }

    static fromHsv(hsv) {
      // http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
      let {h, s, v} = hsv;
      // 0..359
      h = normalizeAngle(h);
      const c = v * s;
      const x = c * (1 - Math.abs(h / 60 % 2 - 1));
      const m = v - c;
      let r = 0, g = 0, b = 0;
      if (h < 60) {
        r = c;
        g = x;
      } else if (h < 120) {
        r = x;
        g = c;
      } else if (h < 180) {
        g = c;
        b = x;
      } else if (h < 240) {
        g = x;
        b = c;
      } else if (h < 300) {
        r = x;
        b = c;
      } else {
        r = c;
        b = x;
      }
      return new Color(
        (r + m) * 255,
        (g + m) * 255,
        (b + m) * 255
      );
    }
  }

  self.Color = Color;
  // https://www.w3.org/TR/css3-color/#svg-color
  self.COLORS = {
    aliceblue: new Color(240, 248, 255),
    antiquewhite: new Color(250, 235, 215),
    aqua: new Color(0, 255, 255),
    aquamarine: new Color(127, 255, 212),
    azure: new Color(240, 255, 255),
    beige: new Color(245, 245, 220),
    bisque: new Color(255, 228, 196),
    black: new Color(0, 0, 0),
    blanchedalmond: new Color(255, 235, 205),
    blue: new Color(0, 0, 255),
    blueviolet: new Color(138, 43, 226),
    brown: new Color(165, 42, 42),
    burlywood: new Color(222, 184, 135),
    cadetblue: new Color(95, 158, 160),
    chartreuse: new Color(127, 255, 0),
    chocolate: new Color(210, 105, 30),
    coral: new Color(255, 127, 80),
    cornflowerblue: new Color(100, 149, 237),
    cornsilk: new Color(255, 248, 220),
    crimson: new Color(220, 20, 60),
    cyan: new Color(0, 255, 255),
    darkblue: new Color(0, 0, 139),
    darkcyan: new Color(0, 139, 139),
    darkgoldenrod: new Color(184, 134, 11),
    darkgray: new Color(169, 169, 169),
    darkgreen: new Color(0, 100, 0),
    darkgrey: new Color(169, 169, 169),
    darkkhaki: new Color(189, 183, 107),
    darkmagenta: new Color(139, 0, 139),
    darkolivegreen: new Color(85, 107, 47),
    darkorange: new Color(255, 140, 0),
    darkorchid: new Color(153, 50, 204),
    darkred: new Color(139, 0, 0),
    darksalmon: new Color(233, 150, 122),
    darkseagreen: new Color(143, 188, 143),
    darkslateblue: new Color(72, 61, 139),
    darkslategray: new Color(47, 79, 79),
    darkslategrey: new Color(47, 79, 79),
    darkturquoise: new Color(0, 206, 209),
    darkviolet: new Color(148, 0, 211),
    deeppink: new Color(255, 20, 147),
    deepskyblue: new Color(0, 191, 255),
    dimgray: new Color(105, 105, 105),
    dimgrey: new Color(105, 105, 105),
    dodgerblue: new Color(30, 144, 255),
    firebrick: new Color(178, 34, 34),
    floralwhite: new Color(255, 250, 240),
    forestgreen: new Color(34, 139, 34),
    fuchsia: new Color(255, 0, 255),
    gainsboro: new Color(220, 220, 220),
    ghostwhite: new Color(248, 248, 255),
    gold: new Color(255, 215, 0),
    goldenrod: new Color(218, 165, 32),
    gray: new Color(128, 128, 128),
    green: new Color(0, 128, 0),
    greenyellow: new Color(173, 255, 47),
    grey: new Color(128, 128, 128),
    honeydew: new Color(240, 255, 240),
    hotpink: new Color(255, 105, 180),
    indianred: new Color(205, 92, 92),
    indigo: new Color(75, 0, 130),
    ivory: new Color(255, 255, 240),
    khaki: new Color(240, 230, 140),
    lavender: new Color(230, 230, 250),
    lavenderblush: new Color(255, 240, 245),
    lawngreen: new Color(124, 252, 0),
    lemonchiffon: new Color(255, 250, 205),
    lightblue: new Color(173, 216, 230),
    lightcoral: new Color(240, 128, 128),
    lightcyan: new Color(224, 255, 255),
    lightgoldenrodyellow: new Color(250, 250, 210),
    lightgray: new Color(211, 211, 211),
    lightgreen: new Color(144, 238, 144),
    lightgrey: new Color(211, 211, 211),
    lightpink: new Color(255, 182, 193),
    lightsalmon: new Color(255, 160, 122),
    lightseagreen: new Color(32, 178, 170),
    lightskyblue: new Color(135, 206, 250),
    lightslategray: new Color(119, 136, 153),
    lightslategrey: new Color(119, 136, 153),
    lightsteelblue: new Color(176, 196, 222),
    lightyellow: new Color(255, 255, 224),
    lime: new Color(0, 255, 0),
    limegreen: new Color(50, 205, 50),
    linen: new Color(250, 240, 230),
    magenta: new Color(255, 0, 255),
    maroon: new Color(128, 0, 0),
    mediumaquamarine: new Color(102, 205, 170),
    mediumblue: new Color(0, 0, 205),
    mediumorchid: new Color(186, 85, 211),
    mediumpurple: new Color(147, 112, 219),
    mediumseagreen: new Color(60, 179, 113),
    mediumslateblue: new Color(123, 104, 238),
    mediumspringgreen: new Color(0, 250, 154),
    mediumturquoise: new Color(72, 209, 204),
    mediumvioletred: new Color(199, 21, 133),
    midnightblue: new Color(25, 25, 112),
    mintcream: new Color(245, 255, 250),
    mistyrose: new Color(255, 228, 225),
    moccasin: new Color(255, 228, 181),
    navajowhite: new Color(255, 222, 173),
    navy: new Color(0, 0, 128),
    oldlace: new Color(253, 245, 230),
    olive: new Color(128, 128, 0),
    olivedrab: new Color(107, 142, 35),
    orange: new Color(255, 165, 0),
    orangered: new Color(255, 69, 0),
    orchid: new Color(218, 112, 214),
    palegoldenrod: new Color(238, 232, 170),
    palegreen: new Color(152, 251, 152),
    paleturquoise: new Color(175, 238, 238),
    palevioletred: new Color(219, 112, 147),
    papayawhip: new Color(255, 239, 213),
    peachpuff: new Color(255, 218, 185),
    peru: new Color(205, 133, 63),
    pink: new Color(255, 192, 203),
    plum: new Color(221, 160, 221),
    powderblue: new Color(176, 224, 230),
    purple: new Color(128, 0, 128),
    red: new Color(255, 0, 0),
    rosybrown: new Color(188, 143, 143),
    royalblue: new Color(65, 105, 225),
    saddlebrown: new Color(139, 69, 19),
    salmon: new Color(250, 128, 114),
    sandybrown: new Color(244, 164, 96),
    seagreen: new Color(46, 139, 87),
    seashell: new Color(255, 245, 238),
    sienna: new Color(160, 82, 45),
    silver: new Color(192, 192, 192),
    skyblue: new Color(135, 206, 235),
    slateblue: new Color(106, 90, 205),
    slategray: new Color(112, 128, 144),
    slategrey: new Color(112, 128, 144),
    snow: new Color(255, 250, 250),
    springgreen: new Color(0, 255, 127),
    steelblue: new Color(70, 130, 180),
    tan: new Color(210, 180, 140),
    teal: new Color(0, 128, 128),
    thistle: new Color(216, 191, 216),
    tomato: new Color(255, 99, 71),
    turquoise: new Color(64, 224, 208),
    violet: new Color(238, 130, 238),
    wheat: new Color(245, 222, 179),
    white: new Color(255, 255, 255),
    whitesmoke: new Color(245, 245, 245),
    yellow: new Color(255, 255, 0),
    yellowgreen: new Color(154, 205, 50),
  }; // make freeze?
}).call(this);

/*

COLORS.yellow.show();
COLORS.yellow.tint().show();
COLORS.yellow.tone().show();
COLORS.yellow.shade().show();

for (i = 0; i <= 1; i += .1) {
  COLORS.yellow.interpolateTo(COLORS.blue, i).show();
}

COLORS.yellow.triad().forEach((c) => c.show());

for (i = 0; i < 360; i += 30) {
  Color.fromHsv({h: i, s: 1, v: 1}).show();
}

 */

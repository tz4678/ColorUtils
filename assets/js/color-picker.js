'use strict';

class ColorPicker extends EventEmitter {
  constructor(container, options = {}) {
    super();
    this.container = container;
    this.wheelRadius = options.wheelRadius || 145;
    this.wheelPadding = options.wheelPadding || 5;
    this.brightnessSliderWidth = options.brightnessSliderWidth || 20;
    this.brightnessSliderHeight = options.brightnessSliderHeight || 300;
    this.wheelCenterXY = this.wheelRadius + this.wheelPadding;
    this.setupElements();
    this.wheelContext = this.wheelCanvas.getContext('2d');
    this.brightnessSliderContext = this.brightnessSliderCanvas.getContext('2d');
    this.drawWheel();
    this.setHsv(
      Math.random() * 360,
      Math.random(),
      Math.random()
    );
    this.wheelPoinerPressed = false;
    this.wheelPointer.onmousedown = () => {
      this.wheelPointerPressed = true;
    };
    this.brightnessSliderPointerPressed = false;
    this.brightnessSliderPointer.onmousedown = () => {
      this.brightnessSliderPointerPressed = true;
    };
    window.addEventListener('mousemove', (e) => {
      if (this.wheelPointerPressed) {
        const canvasRect = this.wheelCanvas.getBoundingClientRect();
        const centerX = canvasRect.left + this.wheelCenterXY;
        const centerY = canvasRect.top + this.wheelCenterXY;
        const dx = centerX - e.clientX;
        const dy = centerY - e.clientY;
        const radians = Math.atan2(dy, dx);
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > this.wheelRadius) {
          distance = this.wheelRadius;
        }
        const x = this.wheelCenterXY - distance * Math.cos(radians);
        const y = this.wheelCenterXY - distance * Math.sin(radians);
        this.setWheelPointer(x, y);
        let angle = radians * 180 / Math.PI;
        if (angle < 0) {
          angle += 360;
        }
        this.hsv.h = angle;
        this.hsv.s = distance / this.wheelRadius;
        this.emit('colorPicked', this.getColor());
      } else if (this.brightnessSliderPointerPressed) {
        const canvasRect = this.brightnessSliderCanvas.getBoundingClientRect();
        let v = e.clientY - canvasRect.top;
        if (v < 0) {
          v = 0;
        } else if (v > this.brightnessSliderHeight) {
          v = this.brightnessSliderHeight;
        }
        this.hsv.v = (1 - v / this.brightnessSliderHeight);
        this.setBrightnessSliderPointer(v);
        this.emit('colorPicked', this.getColor());
      }
    });
    window.addEventListener('mouseup', () => {
      this.wheelPointerPressed = false;
      this.brightnessSliderPointerPressed = false;
    });
  }

  getColor() {
    return Color.fromHsv(this.hsv);
  }

  setRgb(r, g, b) {
    const {h, s, v} = new Color(r, g, b).hsv();
    this.setHsv(h, s, v);
  }

  setHsv(h, s, v) {
    if (this.hsv === void 0) {
      this.hsv = {};
    } 
    this.hsv.h = h;
    this.hsv.s = s;
    this.hsv.v = v;
    const radians = this.hsv.h * Math.PI / 180;
    const distance = this.hsv.s * this.wheelRadius;
    const x = this.wheelCenterXY - distance * Math.cos(radians);
    const y = this.wheelCenterXY - distance * Math.sin(radians); 
    this.setWheelPointer(x, y);
    this.setBrightnessSliderPointer((1 - v) * this.brightnessSliderHeight);
  }

  setWheelPointer(x, y) {
    const pointerRect = this.wheelPointer.getBoundingClientRect();
    this.wheelPointer.style.left = (x - pointerRect.width / 2) + 'px';
    this.wheelPointer.style.top = (y - pointerRect.height / 2) + 'px';
    this.drawSlider();
  }

  setBrightnessSliderPointer(v) {
    const pointerRect = this.brightnessSliderPointer.getBoundingClientRect();
    this.brightnessSliderPointer.style.top = (v - pointerRect.height / 2) + 'px';
  }

  fillWheel(imageData, x, endX, y) {
    const dy = this.wheelCenterXY - y;
    const offsetX = y * this.wheelCanvas.width;
    while (x <= endX) {
      const dx = this.wheelCenterXY - x;
      const h = Math.atan2(dy, dx) * 180 / Math.PI;
      const s = Math.sqrt(dx * dx + dy * dy) / this.wheelRadius;
      const c = Color.fromHsv({h, s, v: 1});
      const i = (offsetX + x) * 4;
      imageData.data[i] = c.r;
      imageData.data[i + 1] = c.g;
      imageData.data[i + 2] = c.b;
      imageData.data[i + 3] = 255;
      ++x;
    }
  }

  drawWheel() {
    const imageData = this.wheelContext.createImageData(
      this.wheelCanvas.width,
      this.wheelCanvas.height
    );
    let x = this.wheelRadius;
    let y = 0;
    let d = 1 - x;
    while (x >= y) {
      this.fillWheel(
        imageData,
        this.wheelCenterXY - y,
        this.wheelCenterXY + y,
        this.wheelCenterXY - x
      );
      this.fillWheel(
        imageData,
        this.wheelCenterXY - x,
        this.wheelCenterXY + x,
        this.wheelCenterXY - y
      );
      this.fillWheel(
        imageData,
        this.wheelCenterXY - x,
        this.wheelCenterXY + x,
        this.wheelCenterXY + y
      );
      this.fillWheel(
        imageData,
        this.wheelCenterXY - y,
        this.wheelCenterXY + y,
        this.wheelCenterXY + x
      );
      y += 1;
      if (d <= 0) {
        d += y * 2 + 1;
      } else {
        x -= 1;
        d += (y - x) * 2 + 1
      }
    }
    this.wheelContext.putImageData(imageData, 0, 0);
  }

  drawSlider() {
    const imageData = this.brightnessSliderContext.createImageData(
      this.brightnessSliderCanvas.width,
      this.brightnessSliderCanvas.height
    );
    for (let y = 0; y < imageData.height; ++y) {
      const hsv = Object.assign({}, this.hsv);
      hsv.v = 1 - y / imageData.height;
      const color = Color.fromHsv(hsv);
      for (let x = 0; x < imageData.width; ++x) {
        const i = (x + y * imageData.width) * 4;
        imageData.data[i] = color.r;
        imageData.data[i + 1] = color.g;
        imageData.data[i + 2] = color.b;
        imageData.data[i + 3] = 255;
      }
    }
    this.brightnessSliderContext.putImageData(imageData, 0, 0);
  }

  setupElements() {
    this.container.classList.add('color-picker');

    this.pickerContainer = document.createElement('div');
    this.pickerContainer.classList.add('picker-container');
    this.container.appendChild(this.pickerContainer);

    // Wheel
    this.wheelWrap = document.createElement('div');
    this.wheelWrap.classList.add('wheel-wrapper');
    this.pickerContainer.appendChild(this.wheelWrap);

    this.wheelContainer = document.createElement('div');
    this.wheelContainer.classList.add('wheel-container');  
    this.wheelWrap.appendChild(this.wheelContainer);

    this.wheelCanvas = document.createElement('canvas');
    this.wheelCanvas.classList.add('wheel-canvas');
    this.wheelCanvas.width = this.wheelCanvas.height = this.wheelCenterXY * 2;
    this.wheelContainer.appendChild(this.wheelCanvas);

    this.wheelPointer = document.createElement('div');
    this.wheelPointer.classList.add('wheel-pointer');
    this.wheelContainer.appendChild(this.wheelPointer);

    // Brightness Slider
    this.brightnessSliderWrap = document.createElement('div');
    this.brightnessSliderWrap.classList.add('brightness-slider-wrapper');
    this.pickerContainer.appendChild(this.brightnessSliderWrap);

    this.brightnessSliderContainer = document.createElement('div');
    this.brightnessSliderContainer.classList.add('brightness-slider-container');
    this.brightnessSliderWrap.appendChild(this.brightnessSliderContainer);

    this.brightnessSliderCanvas = document.createElement('canvas');
    this.brightnessSliderCanvas.classList.add('brightness-slider-canvas');
    this.brightnessSliderCanvas.width = this.brightnessSliderWidth;
    this.brightnessSliderCanvas.height = this.brightnessSliderHeight;
    this.brightnessSliderContainer.appendChild(this.brightnessSliderCanvas);

    this.brightnessSliderPointer = document.createElement('div');
    this.brightnessSliderPointer.classList.add('brightness-slider-pointer');
    this.brightnessSliderContainer.appendChild(this.brightnessSliderPointer);
  }
}

'use strict';

const DEG2RAD = Math.PI / 180;

const $ = (q) => document.querySelector(q);
const $$ = (q) => [...document.querySelectorAll(q)];
const hasOwn = (prop, o) => o !== void 0 && o !== null &&
  Object.prototype.hasOwnProperty.call(o, prop);

class Point {
  constructor(x, y) {
    this.data = new Uint16Array(2);
    this.data[0] = x;
    this.data[1] = y;
  }
  set x(v){
    this.data[0]=v;
  }
  set y(v){
    this.data[1] = v;
  }
  get x(){
    return this.data[0];
  }
  get y(){
    return this.data[1];
  }
}

function getCirclePoint(pivot, radius, angle) {
  let rads=DEG2RAD*angle;
  return new Point(pivot.x + Math.sin(rads)*radius
    , pivot.y - Math.cos(rads)*radius);
}

function getDistanceBetweenPoints(p1,p2){
  return Math.sqrt(Math.pow(p2.x-p1.x, 2) + Math.pow(p2.y-p1.y, 2));
}

function getAngleBetweenPoints(p1,p2){
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

function removeChildren(element){
  while(element.firstChild)element.removeChild(element.firstChild);
}

// Ужасная хуета! Но работает (хоть и медленно)
class ColorWheel{
  constructor(){
    this.colorWheel=$('#color-wheel');
    this.context=this.colorWheel.getContext('2d');
    this.width=this.colorWheel.width;
    this.height=this.colorWheel.height;
    this.imgData=this.context.getImageData(0,0,this.width,this.height);
    this.pivot=new Point(this.width/2,this.height/2);
    this.radius=this.colorWheel.width*0.99/2;
    this.circumference=2*Math.PI*this.radius;
    this.angleIncrement=360*1/this.circumference;
    this.rField=$('#r');
    this.gField=$('#g');
    this.bField=$('#b');
    this.chromaSlider=$('#chroma-slider');
    this.chromaField=$('#chroma-field');
    this.chromaField.value=this.chromaSlider.value=65;
    this.colorPicker=$('#color-picker');

    //this.hexField=$('#hex');
    this.colorPreview=$('#color-preview');

    this.complementaryColor=$('#complementary-color');
    this.splitComplementaryColors=$('#split-complementary-colors');
    this.triadicColors=$('#triadic-colors');
    this.analogousColors=$('#analogous-colors');
    this.tetradicColors=$('#tetradic-colors');

    this.color=new ColorUtils.Color();
    this.executed=false;
  }
  isClicked(e){
    let x1 = this.colorWheel.offsetLeft;
    let y1 = this.colorWheel.offsetTop;
    let x2 = x1 + this.width;
    let y2 = y1 + this.height;
    let x3 = e.pageX;
    let y3 = e.pageY;
    return x1 <= x3 && y1 <= y3 &&  x2 >= x3;
  }
  exec() {
    if (this.executed){
      throw new Error();
    }
    this.executed = true;
    // Из-за элемента с абсолютным позиционированием не получится на color-wheel
    // использовать обработчик
    window.addEventListener('click', (e)=>{
      if (!this.isClicked(e))
        return;
      let x = e.pageX - this.colorWheel.offsetLeft;
      let y = e.pageY - this.colorWheel.offsetTop;
      let p=new Point(x,y);
      if(!this.isPointInsideCircle(p))
        return;
      this.color=this.pickColor(p);
      this.color.dump();
      this.update();
    }); // Всплывающее событие
    window.addEventListener('mousemove', (e)=>{
      if (!this.isClicked(e))
        return;
      let x = e.pageX - this.colorWheel.offsetLeft;
      let y = e.pageY - this.colorWheel.offsetTop;
      let p=new Point(x,y);
      if(!this.isPointInsideCircle(p))
        return;
      let c=this.pickColor(p);
      let rect=this.colorPicker.getBoundingClientRect();
      this.colorPicker.style.display='block';
      // Без px не работает в FF
      this.colorPicker.style.left=e.pageX-(rect.width/2)+'px';
      this.colorPicker.style.top=e.pageY-(rect.width/2)+'px';
      this.colorPicker.children[0].setAttribute('fill',c);
    });
    this.rField.addEventListener('change',()=>{
      this.color.r = this.rField.value;
      this.update();
    });
    this.gField.addEventListener('change',()=>{
      this.color.g = this.gField.value;
      this.update();
    });
    this.bField.addEventListener('change',()=>{
      this.color.b = this.bField.value;
      this.update();
    });
    /*
    this.hexField.addEventListener('change',()=>{
      try{
        this.color=new ColorUtils.Color(this.hexField.value);
      }catch(e){}
      this.update();
    });*/
    this.chromaSlider.addEventListener('change', ()=> {
      this.chromaField.value=this.chromaSlider.value;
      this.render();
    });
    this.chromaField.addEventListener('change', ()=> {
      this.chromaSlider.value=this.chromaField.value;
      this.render();
    });
    window.addEventListener('hashchange', (ev)=>{
      try{
        this.color=new ColorUtils.Color(window.location.hash);
        this.update();
      }catch(e){
        console.warn(e);
      }
    });
    this.render();
    if (window.location.hash){
      try{
        this.color=new ColorUtils.Color(window.location.hash);
      }catch(e){
        console.warn(e);
      }
    }
    this.update();
  }
  update(){
    this.rField.value=this.color.r;
    this.gField.value=this.color.g;
    this.bField.value=this.color.b;
    let h=this.color.toString();
    //this.hexField.value=h;
    this.colorPreview.style.background=h;
    let hsl=this.color.convert('hsl');
    this.colorPreview.style.color=hsl.l > 17.9 ? 'black' : 'white';
    this.colorPreview.innerHTML=h;
    window.location.hash=h;
    let color=this.color;
    removeChildren(this.complementaryColor);
    this.appendAdditionalColor(this.complementaryColor, color.complement());
    removeChildren(this.splitComplementaryColors);
    for (let c of color.splitComplements()) {
      this.appendAdditionalColor(this.splitComplementaryColors, c);
    }
    removeChildren(this.triadicColors);
    for (let c of color.triadic()) {
      this.appendAdditionalColor(this.triadicColors, c);
    }
    removeChildren(this.analogousColors);
    for (let c of color.analogous()) {
      this.appendAdditionalColor(this.analogousColors, c);
    }
    removeChildren(this.tetradicColors);
    for (let c of color.tetradic()) {
      this.appendAdditionalColor(this.tetradicColors, c);
    }
  }
  appendAdditionalColor(parent, c){
    let a=document.createElement('div');
    let h=c.toString();
    a.innerHTML=h;
    a.setAttribute('class','additional-color');
    a.ondblclick=()=>location.hash=h;
    a.style.background=h;
    let hsl=c.convert('hsl');
    a.style.color=hsl.l > 17.9 ? 'black' : 'white';
    parent.appendChild(a);
  }
  pickColor(p){
    let i=this.getIndex(p);
    return new ColorUtils.Color([...this.imgData.data.slice(i, i +3)]);
  }
  isPointInsideCircle(p){
    let d=getDistanceBetweenPoints(this.pivot,p);
    return d<=this.radius;
  }
  render(){
    let dt=performance.now();
    let point = new Point(this.radius, 0);
    let decisionOver2 = 1 - point.x;
    // let counter=0;
    while (point.x >= point.y) {
      // Круг разбиваем на 4 сегмента и закрашиваем их
      // Рисует линии в первом сегменте
      this.colorizeLine(
        new Point(this.pivot.x - point.y, this.pivot.y - point.x),
        new Point(this.pivot.x + point.y, this.pivot.y - point.x)
      );
      // Во втором
      this.colorizeLine(
        new Point(this.pivot.x - point.x, this.pivot.y - point.y),
        new Point(this.pivot.x + point.x, this.pivot.y - point.y)
      );
      // В третьем
      this.colorizeLine(
        new Point(this.pivot.x - point.x, this.pivot.y + point.y),
        new Point(this.pivot.x + point.x, this.pivot.y + point.y)
      );
      // В четвертом
      this.colorizeLine(
        new Point(this.pivot.x - point.y, this.pivot.y + point.x),
        new Point(this.pivot.x + point.y, this.pivot.y + point.x)
      );
      // if (++counter>2){
      //   break;
      // }
      ++point.y;
      if (decisionOver2 <= 0) {
        decisionOver2 += 2 * point.y + 1;
      } else {
        --point.x;
        decisionOver2 += 2 * (point.y -point.x) + 1;
      }
    }
    this.context.putImageData(this.imgData,0,0);
    dt=performance.now()-dt;
    console.log('Image generated at: %f ms',dt);
  }
  colorizeLine(p1,p2){
    this.colorizePixel(p1);
    this.colorizePixel(p2);
    let x=p1.x;
    let y=p1.y;
    while (++x<p2.x){
      this.colorizePixel(new Point(x,y));
    }
  }
  colorizePixel(point){
    let index=this.getIndex(point);
    // Угол между центральной точкой и искомой точкой 
    let angle=getAngleBetweenPoints(this.pivot,point);
    let distance=getDistanceBetweenPoints(this.pivot,point);
    let lch = new ColorUtils.Lch(this.chromaSlider.value,140-1/distance*140,angle); 
    // был баг с отрицательными углами
    // console.log(angle,distance,lch);
    let color = new ColorUtils.Color(lch);
    this.imgData.data[index]=color.r;
    this.imgData.data[index+1]=color.g;
    this.imgData.data[index+2]=color.b;
    this.imgData.data[index+3]=255;
  }
  getIndex(point){
    return (point.y*this.width+point.x)*4;
  }
}

function main() {
  let wheel=new ColorWheel();
  wheel.exec();
}

window.addEventListener('load', main);

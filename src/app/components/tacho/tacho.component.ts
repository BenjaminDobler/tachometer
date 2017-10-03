import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

declare var Snap: any;
declare var mina: any;

@Component({
  selector: 'app-tacho',
  templateUrl: './tacho.component.html',
  styleUrls: ['./tacho.component.css']
})
export class TachoComponent implements OnInit, AfterViewInit {
  get speedPercentage(): number {
    return this._speedPercentage;
  }


  @Input()
  set speedPercentage(value: number) {
    this._speedPercentage = value;
    this.setSpeed(value);
  }

  oldDegree = 0;




  private _speedPercentage:number = 0;


  @ViewChild('svg')
  private svgEl: ElementRef;

  private s: any;
  width: number = 300;
  height: number = 300;
  radius: number = 0;
  cx: number;
  cy: number;
  startDegree;
  maxDegree;
  outline: any;
  needle: any;
  loopLength: number;

  constructor() {
  }

  ngOnInit() {
    Snap.plugin(function (Snap, Element, Paper, global) {
      Paper.prototype.circlePath = function (cx, cy, r) {
        var p = 'M' + cx + ',' + cy;
        p += 'm' + -r + ',0';
        p += 'a' + r + ',' + r + ' 0 1,0 ' + (r * 2) + ',0';
        p += 'a' + r + ',' + r + ' 0 1,0 ' + -(r * 2) + ',0';
        return this.path(p, cx, cy);

      };
    });


    Snap.plugin(function (Snap, Element, Paper, global) {
      Paper.prototype.partialCircle = function (cx, cy, r, from, to) {
        var outline = this.circlePath(cx, cy, r);
        var loopLength = Snap.path.getTotalLength(outline);
        var startDegree = 270 + from;
        var len = loopLength;
        var uPerc = (to - from) / 360;
        console.log(uPerc);
        //var perc = perc * uPerc;
        var l = -1 * (len - (uPerc * len));
        console.log(l);
        outline.attr({
          fillOpacity: 0,
          stroke: '#ff0000',
          strokeWidth: 10, // CamelCase...
          strokeOpacity: 0.4,
          'stroke-dasharray': loopLength,
          'stroke-dashoffset': l,
          transform: 'r' + startDegree
        });


      }
    });

  }

  ngAfterViewInit() {
    this.s = Snap(this.svgEl.nativeElement);
    this.render();
  }


  render() {
    console.log('WIDTH ', this.width);
    var cx = this.width / 2 + 10;
    var cy = this.height / 2 + 10;
    this.radius = this.width / 2;
    let radius = this.radius;
    let s = this.s;

    this.cx = cx;
    this.cy = cy;
    this.startDegree = 90;
    this.maxDegree = 360;

    var f = this.s.filter(Snap.filter.shadow(0, 2, 3));

    console.log(cx, cy);
    var bigCircle = this.s.circle(cx, cy, radius);
    bigCircle.attr({
      fill: '#171717',
      stroke: '#333',
      strokeWidth: 4, // CamelCase...
      filter: f
    });


    this.outline = s.circlePath(cx, cy, radius);
    var outline = this.outline;
    var loopLength = Snap.path.getTotalLength(outline);
    this.loopLength = loopLength;
    outline.attr({
      fillOpacity: 0,
      stroke: '#4683ea',
      strokeWidth: 4, // CamelCase...
      'stroke-dasharray': loopLength,
      'stroke-dashoffset': -loopLength,
      transform: 'r270'
    });

    this.currentOutlinePos = -loopLength;


    var lineNums = 10;

    for (var i = 0; i < lineNums; i++) {
      var perc = i / lineNums;
      var line = this.drawScale(s, cx, cy, radius - 2, 20, perc, this.startDegree, this.maxDegree);
      line.attr({
        fill: '#fc0',
        stroke: '#ffffff',
        strokeWidth: 2, // CamelCase...
      });


      var x1 = this.xOnCircle(radius - 35, cx, cy, perc, this.startDegree, this.maxDegree);
      var y1 = this.yOnCircle(radius - 35, cx, cy, perc, this.startDegree, this.maxDegree);
      var deg = this.startDegree + (perc * this.maxDegree);
      var anchor = 'middle';

      var speed_tx = s.text(x1, y1 + 5, i * 10).attr({
        fontSize: '14px',
        opacity: 1,
        fill: '#ffffff',
        'text-anchor': anchor,
        'background-color': '#0000ff',
        'font-family': 'sans-serif'
      });
    }


    var lineNums = 64;
    for (var i = 0; i < lineNums; i++) {
      var perc = i / lineNums;
      var line = this.drawScale(s, cx, cy, radius - 2, 5, perc, this.startDegree, this.maxDegree);
      line.attr({
        fill: '#fc0',
        stroke: '#ffffff',
        strokeWidth: 1, // CamelCase...
      });
    }


    var partial1 = s.partialCircle(cx, cy, radius - 7, 180, 220);
    //var partial2 = s.partialCircle(cx, cy, radius - 10, 95, 100);


    this.needle = s.line(cx, cy, cx, cy + radius);
    var needle = this.needle;
    needle.attr({
      fill: '#ffffff',
      stroke: '#333',
      strokeWidth: 10, // CamelCase...
      filter: f
    });


    var innerCircle = s.circle(cx, cy, radius - 80);
    innerCircle.attr({
      fill: '#444444',
      stroke: '#333',
      strokeWidth: 1, // CamelCase...
      filter: f
    });

  }


  radians(degrees) {
    return degrees * Math.PI / 180;
  };

  xOnCircle(radius, cx, cy, perc, startDegree, maxDegree) {
    var degree = startDegree + (perc * maxDegree);
    var x = cx + radius * Math.cos(this.radians(degree));
    return x;
  }

  yOnCircle(radius, cx, cy, perc, startDegree, maxDegree) {
    var degree = startDegree + (perc * maxDegree);
    var y = cy + radius * Math.sin(this.radians(degree));
    return y;
  }

  drawScale(snap, cx, cy, radius, length, perc, startDegree, maxDegree) {
    var x1 = this.xOnCircle(radius, cx, cy, perc, startDegree, maxDegree);
    var y1 = this.yOnCircle(radius, cx, cy, perc, startDegree, maxDegree);

    var x2 = this.xOnCircle(radius - length, cx, cy, perc, startDegree, maxDegree);
    var y2 = this.yOnCircle(radius - length, cx, cy, perc, startDegree, maxDegree);

    var line = snap.line(x1, y1, x2, y2);
    return line;

  }


  setSpeed = function (perc) {
    console.log("Perc ", perc);
    this.speedPerc = perc;
    this.animateNeedle(perc);
    this.animateOutline(perc);
  }

  animateNeedle = function (perc) {
    var degree = perc * this.maxDegree;
    console.log("Degree ", degree);
    /*
    this.needle.stop().animate(
      {transform: 'r' + degree + ',' + this.cx + ',' + this.cy}, // Basic rotation around a point. No frills.
      2000, mina.easeinout
    );
    */

    this.needle.node.style.transformOrigin = '0% 0%';

    this.needle.node.animate([
      {transform: 'rotate('+this.oldDegree+'deg)'},
      {transform: 'rotate('+degree+'deg)'},
    ],{
      duration: 2000,
        easing: 'ease-in-out',
        fill: 'both'
    });
    this.oldDegree = degree;

  }


  currentOutlinePos:any = 0;


  animateOutline = function (perc) {
    var len = this.loopLength;
    console.log("Loop Length ", this.loopLength);
    var uPerc = this.maxDegree / 360;
    perc = perc * uPerc;
    var l = -1 * (len - (perc * len));
    /*
    this.outline.animate(
      {
        'stroke-dashoffset': l
      }, 2000, mina.easeinout
    );
    */

    console.log("this.outline.node ", this.outline.node);
    this.outline.node.animate([
      {'strokeDashoffset': this.currentOutlinePos},
      {'strokeDashoffset': l}
    ], {
      duration: 2000,
      easing: 'ease-in-out',
      fill: 'both'
    });
    this.currentOutlinePos = l;


  }

}

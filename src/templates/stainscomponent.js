import React from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router';
import StainsAnimation from '../stainsAnimation';
import { vec2 } from 'gl-matrix';

export default class extends React.Component {
  componentDidMount() {  
    let self = this;
    this._stainsAnimation = null;
    let gl = null;
    this._canvas = ReactDom.findDOMNode(this);
    console.log(this);
    let container = this._canvas.parentNode;
    
    function updateCanvasSize() {
      var w = container.offsetWidth;
      var h = container.offsetHeight;
      self._canvas.width = w;
      self._canvas.height = h;
      return [w, h];
    }

    let titleVisible = true;
    let canvasSize = [0, 0];

    try {
      gl = this._canvas.getContext('webgl');
      
    } catch (e) {
        console.log('Failed to initialize WebGL.', e);
    }

    if (gl) {
      let size = updateCanvasSize(this._stainsAnimation);
      console.log(this.props.src);
      this._stainsAnimation = new StainsAnimation(gl, size[0], size[1], this.props.src, this.props.backgroundColor);

      this._stainsAnimation.setBrush(this.props.brush || 'imageStain');

      window.addEventListener('resize', () => {
        let size = updateCanvasSize(this._stainsAnimation);
        this._stainsAnimation.setSize(size[0], size[1]);
      });

      this._stainsAnimation.start();
    }
    
    console.log(this.props);

    if (this.props.mousePaint) {
      this.initMousePaint();
    }
    if (this.props.randomPaint) {
      console.log("init random paint");
      this.initRandomPaint();
    }
    if (this.props.brushDemo) {
     this.initBrushDemo(); 
    }

  }


  initMousePaint() {
    let concentration = 0.5 + 0.5 * Math.random();
    let amount = 1.0;
    let self = this;
    self._canvas.addEventListener("mousemove", function (evt) {
       evt = evt || window.event;

  var target = evt.target || evt.srcElement,
    rect = target.getBoundingClientRect(),
    offsetX = evt.clientX - rect.left,
    offsetY = evt.clientY - rect.top;


      amount *= 0.999;
      if (!evt.buttons) return;
      self._stainsAnimation.applyStain(
        [offsetX / self._canvas.width,
         1.0 - offsetY / self._canvas.height],
        Math.random() * 10,
        amount * 0.7 + 0.2 * Math.random(),
        concentration,
        0.3 + Math.random() * 0.2
      );
      evt.preventDefault();
    });

    self._canvas.addEventListener("mousedown", function (evt) {
      console.log("MOUSE DOWN");
      console.log(this);
      console.log(evt.clientX);
      console.log(evt.clientY);
       evt = evt || window.event;

      var target = evt.target || evt.srcElement,
        rect = target.getBoundingClientRect(),
        offsetX = evt.clientX - rect.left,
        offsetY = evt.clientY - rect.top;

      concentration = 0.5 + 0.5 * Math.random();
      amount = 1;
      self._stainsAnimation.setColor([Math.random(), Math.random() * 0.2, Math.random() * 0.5]); 
      self._stainsAnimation.applyStain(
        [offsetX / self._canvas.width,
         1.0 - offsetY / self._canvas.height],
        Math.random() * 10,
        amount * 0.7 + 0.2 * Math.random(),
        concentration,
        0.3 + Math.random() * 0.2
      );
      evt.preventDefault();
    });
  }

  initRandomPaint() {
    this._nStains = 0;
    this._stainTimer = 0;
    this._stainsAnimation.doEachFrame(() => {
      let size = Math.random() * this.props.brushSize;
      let amount = 0.8;
      let concentration = Math.random();

      let timerCoefficient = 1;
      if (this._nStains < 500) {
        size *= 1.5;
        amount *= 0.8;
        timerCoefficient * 2.0;
      }
      if (this._nStains < 100 && this._nStains % 3 === 0) {
        size *= 1.5;
        amount *= 0.8;
        timerCoefficient * 2.0;
      }

      if (this._stainTimer < 0) {
        //if (this._imageStainBrush.isReady()) {

          let inputX = 0.01 + Math.random() * 0.98;
          let inputY = 0.15 + Math.random() * 0.75;
          let fuzziness = 0.3 + Math.random() * 0.2;

          let position = vec2.fromValues(inputX, inputY);
          this._stainsAnimation.applyStain(position, size, amount, concentration, fuzziness);
          this._nStains++;
        //}
        this._stainTimer = Math.random() * 2 * timerCoefficient;
      }
      this._stainTimer--;
    });
  }

  initBrushDemo() {
    let self = this;
    this._demoNStains = 0;
    this._demoStainTimer = 10;

    this._stainsAnimation.doEachFrame(() => {
      if (this._demoStainTimer < 0) {
        if (this._demoNStains < 40) {
          let size = (this._demoNStains % 10) * 1.5 + 2;
          let amount = 0.5 + 0.25 * this._demoNStains / 20;
          let timerCoefficient = 1;

          let inputX = (this._demoNStains % 10) / 11 + 1/11;
          if (Math.floor(this._demoNStains / 10) % 2) {
            inputX = 1 - inputX;
          }
          let inputY = (Math.floor(this._demoNStains / 10)) / 4 + 1/8;
          let position = vec2.fromValues(inputX, inputY);
          let concentration = 1.0;

          if (this._demoNStains === 0) {
            self._stainsAnimation.setColor([Math.random(), Math.random() * 0.2, Math.random() * 0.5]); 
          }

          this._stainsAnimation.applyStain(position, size, amount, 1 / amount, this.props.fuzziness);
          this._demoNStains++;
          this._demoStainTimer = 15;
        } else if (this._demoNStains === 40) {
          this._demoStainTimer = 100;
          this._demoNStains++;
        } else {
          this._demoNStains = 0;
          this._stainsAnimation.clear();
        }
      }
      this._demoStainTimer--;

    });
  }

  componentWillUnmount() {
    this._stainsAnimation.stop();
    
  }

  render() {

    let styles = {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };
    if (this.props.mousePaint) {
      styles.cursor = 'crosshair';
    };

    return (
      <canvas style={styles}></canvas>
    )
  }
};
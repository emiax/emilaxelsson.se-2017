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
    let self = this;
    self._canvas.addEventListener("mousemove", function (evt) {
      if (!evt.buttons) return;
      self._stainsAnimation.applyStain(
        [(evt.pageX - this.offsetLeft) / self._canvas.width,
         1.0 - (evt.pageY - this.offsetTop) / self._canvas.height],
        Math.random() * 10,
        0.7 + 0.2 * Math.random()
      );
    });

    self._canvas.addEventListener("mousedown", function (evt) {
      self._stainsAnimation.setColor([Math.random(), Math.random() * 0.2, Math.random() * 0.5]); 
      self._stainsAnimation.applyStain(
        [(evt.pageX - this.offsetLeft) / self._canvas.width,
         1.0 - (evt.pageY - this.offsetTop) / self._canvas.height],
        Math.random() * 10,
        0.7 + 0.2 * Math.random()
      );
    });
  }

  initRandomPaint() {
    this._nStains = 0;
    this._stainTimer = 0;
    this._stainsAnimation.doEachFrame(() => {
      let size = Math.random() * 20;
      let amount = 0.8;
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

          let position = vec2.fromValues(inputX, inputY);
          this._stainsAnimation.applyStain(position, size, amount);
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

    self._canvas.addEventListener("click", function (evt) {
      self._stainsAnimation.setColor([Math.random(), Math.random() * 0.2, Math.random() * 0.5]); 
      self._stainsAnimation.clear();
      self._demoNStains = 0;
    });

    this._stainsAnimation.doEachFrame(() => {
      
      let size = (this._demoNStains % 10) * 2 + 2;
      let amount = 0.8;
      let timerCoefficient = 1;

      if (this._demoStainTimer < 0) {
        console.log("STAIN");
        let inputX = (this._demoNStains % 10) / 12 + 1/12;
        let inputY = (Math.floor(this._demoNStains / 10)) * 0.5 + 0.25;
        let position = vec2.fromValues(inputX, inputY);

        console.log(position, size, amount)

        this._stainsAnimation.applyStain(position, size, amount);
        this._demoNStains++;
        //}
        this._demoStainTimer = 15;
      }
      this._demoStainTimer--;
    });
  }

  componentWillUnmount() {
    this._stainsAnimation.stop();
  }

  render() {

    let styles = {};
    if (this.props.mousePaint) {
      styles = { cursor: 'crosshair' }
    };

    return (
      <canvas style={styles}></canvas>
    )
  }
};
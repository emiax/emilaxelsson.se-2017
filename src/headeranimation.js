import WebglContext from 'stains/src/webglcontext';
import Simulator from 'stains/src/simulator';
import HeaderRenderer from './headerrenderer';
import {vec2, vec3} from 'gl-matrix';
import Stats from 'stats-js';

import ImageStainBrush from 'stains/src/brushes/imagestainbrush';

class HeaderAnimation {
  constructor(gl, w, h) {
    //let textureSize = vec2.fromValues(1920, 1080);
    let textureSize = vec2.fromValues(w, h);
    //let textureSize = vec2.fromValues(512, 512);

    let context = this._context = new WebglContext(gl);
    context.getExtension('OES_texture_float');
    context.getExtension('OES_texture_float_linear');
    context.getExtension('OES_texture_half_float');
    context.getExtension('OES_texture_half_float_linear');

    this._simulator = new Simulator({
      context: context,
      size: textureSize
    });

    this._simulator.setTextureCoordinatesAndForces(
      [ 0.0, 1.0, 
        0,  0,
        1.0, 0,
        0,  1.0,
        1.0, 0,
        1.0, 1.0
        ],
        [ 0, -1, 
          0, -1, 
          0, -1,
          0, -1, 
          0, -1, 
          0, -1,
        ]
    );

    let force = this._force = vec3.fromValues(0, 0, 0);

    let self = this;
    window.ondevicemotion = function(event) {
      let f = event.accelerationIncludingGravity;
      if (f && f.x && f.y && f.z) {
        let accMagnitude = f.x * f.x + f.y * f.y + f.z * f.z; 
        let denominator = Math.max(accMagnitude, 1.0);
        vec3.set(self._force, f.x / denominator, f.y / denominator, f.z / denominator);
      }
    }

    if (!this._simulator.init()) {
      this._initialized = false;
      return;
    }

    this._headerRenderer = new HeaderRenderer({
      context: context,
      textureSize: textureSize,
      headerSize: vec2.fromValues(w, h)
    });
    
    this._stats = new Stats();
    //this._stats.setMode( 1 );
    //document.body.appendChild(this._stats.domElement );
    //this._stats.domElement.style.position = 'fixed';
    //this._stats.domElement.style.bottom = '0'


    this._imageStainBrush = new ImageStainBrush({
        context: this._context,
        simulator: this._simulator,
        imageSource: 'input4.jpg'
    });
    this._stainQueue = [];

    this._stainTimer = 0;
    this._nStains = 0;

    this._initialized = true;
  }

  start() {
    if (this._status !== 'on') {
      this._status = 'on';
      requestAnimationFrame(this.step.bind(this));
    }
  }

  stop() {
    console.log("stopping animation.");
    this._stats.domElement.remove();
    this._status = 'stop';
  }

  step() {
    if (this._forceChanged) {
      this._simulator.setTextureCoordinatesAndForces(
        [ 0.0, 1.0, 
          0,  0,
          1.0, 0,
          0,  1.0,
          1.0, 0,
          1.0, 1.0
          ],
          [ this._force[0], this._force[1], 
            this._force[0], this._force[1],
            this._force[0], this._force[1],
            this._force[0], this._force[1],
            this._force[0], this._force[1],
            this._force[0], this._force[1]
          ]
      );
      this._forceChanged = false;
    }

    if (this._status === 'on') {
      this._stats.begin();

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
        if (this._imageStainBrush.isReady()) {

          let inputX = 0.01 + Math.random() * 0.98;
          let inputY = 0.15 + Math.random() * 0.75;

          let position = vec2.fromValues(inputX, inputY);
          this.applyStain(position, size, amount);
          this._nStains++;
        }
        this._stainTimer = Math.random() * 2 * timerCoefficient;
      }

      this._stainQueue.forEach((stainSpecification) => {
        this._imageStainBrush.apply(
          stainSpecification.position,
          stainSpecification.size,
          stainSpecification.amount
        );
      });
      this._stainQueue = [];

      this._stainTimer--;

      this._simulator.step();
      this._headerRenderer.render(this._simulator);

      requestAnimationFrame(this.step.bind(this));
      this._stats.end();
    } else {
      this._status = 'off';
    }
  }

  applyStain(position, size, amount) {
    this._stainQueue.push({
      position: position,
      size: size,
      amount
    });
  }

  setSize(w, h) {
    this._headerRenderer.setHeaderSize(vec2.fromValues(w, h));
  }
}

module.exports = HeaderAnimation;
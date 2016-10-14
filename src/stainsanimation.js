import WebglContext from 'stains/src/webglcontext';
import Simulator from 'stains/src/simulator';
import Renderer from 'stains/src/defaultrenderer';
import {vec2, vec3} from 'gl-matrix';
import Stats from 'stats-js';

import ImageStainBrush from 'stains/src/brushes/imagestainbrush';
import StainBrush from 'stains/src/brushes/stainbrush';
import ClearBrush from 'stains/src/brushes/clearbrush';

class StainAnimation {
  constructor(gl, w, h, imageSource, backgroundColor) {
    let textureSize = vec2.fromValues(w, h);
    let context = this._context = new WebglContext(gl);

    this._simulator = new Simulator({
      context: context,
      size: textureSize
    });

    this._stainBrush = new StainBrush({
      context: this._context,
      simulator: this._simulator
    });


    this._clearBrush = new ClearBrush({
      context: this._context,
      simulator: this._simulator
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

    this._force = vec3.fromValues(0, 0, 0);
    this._eachFrameFunctions = [];
    
    if (!this._simulator.init()) {
      this._initialized = false;
      return;
    }

    this._renderer = new Renderer({
      context: context,
      textureSize: textureSize,
      displaySize: vec2.fromValues(w, h)
    });
    
    //this._stats = new Stats();
    //this._stats.setMode( 1 );
    //document.body.appendChild(this._stats.domElement );
    //this._stats.domElement.style.position = 'fixed';
    //this._stats.domElement.style.bottom = '0'

    if (imageSource) {
      this.setImageSource(imageSource);
    }
    if (!backgroundColor) {
      backgroundColor = [0.98, 0.98, 0.98];
    }
    this._renderer.setBackgroundColor(backgroundColor);

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
    //this._stats.domElement.remove();
    this._status = 'stop';
  }

  isStarted() {
    return this._status === 'on';
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
      //this._stats.begin();
      this._eachFrameFunctions.forEach((fn) => {
        fn();
      });
      if (this._clear) {
        this._clearBrush.apply();
        this._clear = false;
      }

      this._stainQueue.forEach((stainSpecification) => {
        this._activeBrush.apply(
          stainSpecification.position,
          stainSpecification.size,
          stainSpecification.amount
        );
      });
      this._stainQueue = [];
      this._simulator.step();
      this._renderer.render(this._simulator);

      requestAnimationFrame(this.step.bind(this));
      //this._stats.end();
    } else {
      this._status = 'off';
    }
  }

  doEachFrame(fn) {
    this._eachFrameFunctions.push(fn);
  }

  applyStain(position, size, amount) {
    this._stainQueue.push({
      position: position,
      size: size,
      amount
    });
  }

  setSize(w, h) {
    this._renderer.setDisplaySize(vec2.fromValues(w, h));
  }

  setBrush(brushString) {
    if (brushString === 'imageStain') {
      this._activeBrush = this._imageStainBrush;
    } else {
      this._activeBrush = this._stainBrush;
    }
  }

  clear() {
    this._clear = true;
  }

  setForce(force) {
    this._force = force;
    this._forceChanged = true;
  }

  setImageSource(src) {
    this._imageStainBrush = new ImageStainBrush({
        context: this._context,
        simulator: this._simulator,
        imageSource: src
    });
  }

  setColor(color) {
    this._stainBrush.setColor(color);
  }

  setBackgroundColor(backgroundColor) {
    this._renderer.setBackgroundColor(backgroundColor);
  }
}

module.exports = StainAnimation;
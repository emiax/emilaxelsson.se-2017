import React from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router';
import HeaderAnimation from '../headerAnimation';

console.log(HeaderAnimation);


export default React.createClass({
  componentDidMount() {

    let gl = null;
    let headerAnimation = null;

    let header = ReactDom.findDOMNode(this);
    let canvas = header.getElementsByTagName("canvas")[0];
    
    function updateCanvasSize() {
      var w = header.offsetWidth;
      var h = header.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      return [w, h];
    }

    console.log(canvas);

    let titleVisible = true;
    let canvasSize = [0, 0];

    try {
      gl = canvas.getContext('webgl');
      
    } catch (e) {
        console.log('WebGL not supported.');
    }

    if (gl) {
      let size = updateCanvasSize(headerAnimation);
      headerAnimation = new HeaderAnimation(gl, size[0], size[1]);

      window.addEventListener('resize', function () {
        let size = updateCanvasSize(headerAnimation);
        headerAnimation.setSize(size[0], size[1]);
      });

      window.addEventListener('scroll', function (data) {
        let scroll = document.documentElement.scrollTop || document.body.scrollTop;
        headerAnimation.setScroll(scroll);
      });

      headerAnimation.start();
    }
  },
  render() {
    return (
      <header id="main-header">
        <div className="main-title">
          <h1>Emil Axelsson</h1>
          <h2>code, graphics, music and space</h2>
        </div>
        <canvas id="main-header-canvas"></canvas>
        <div id="main-header-canvas-overlay"></div>
      </header>
    )
  }
});
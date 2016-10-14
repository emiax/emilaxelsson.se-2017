/*import React from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router';
import StainsAnimation from '../stainsAnimation';

let headerAnimation = null;

export default class extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  componentDidMount() {

    console.log(this.props);

    let gl = null;

    let header = ReactDom.findDOMNode(this);
    let canvas = header.getElementsByTagName("canvas")[0];
    
    function updateCanvasSize() {
      var w = header.offsetWidth;
      var h = header.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      return [w, h];
    }

    let titleVisible = true;
    let canvasSize = [0, 0];

    try {
      gl = canvas.getContext('webgl');
      
    } catch (e) {
        console.log('WebGL not supported.');
    }

    if (gl) {
      let size = updateCanvasSize(headerAnimation);
      headerAnimation = new StainsAnimation(gl, size[0], size[1]);

      window.addEventListener('resize', function () {
        let size = updateCanvasSize(headerAnimation);
        headerAnimation.setSize(size[0], size[1]);
      });

      headerAnimation.start();
    }


    canvas.addEventListener("mousemove", function (evt) {
      if (!evt.buttons) return;
      headerAnimation.applyStain(
        [(evt.pageX - this.offsetLeft) / canvas.width, 1.0 - (evt.pageY - this.offsetTop) / canvas.height],
        Math.random() * 10,
        0.7 + 0.2 * Math.random()
      );
    });
  }

  componentWillUnmount() {
    headerAnimation.stop();
  }

  render() {
    return (
      <header id="main-header">
        
        <canvas id="main-header-canvas"></canvas>
      </header>
    )
  }
}*/
import React from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router';
import HeaderAnimation from '../headerAnimation';

let headerAnimation = null;

export default React.createClass({
  componentDidMount() {

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
      headerAnimation = new HeaderAnimation(gl, size[0], size[1]);

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
  },

  componentWillUnmount() {
    headerAnimation.stop();
  },

  render() {
    return (
      <header id="main-header">
        <div style={{pointerEvents: 'none'}} className="main-title">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
   width="310.485px" height="295.289px" viewBox="0 0 310.485 295.289" enableBackground="new 0 0 310.485 295.289"
   xmlSpace="preserve">
   <style type="text/css">@import url(https://fonts.googleapis.com/css?family=Lato:400,300,700,700italic,400italic,300italic);</style>
<g opacity="0.8">
  <path fill="#010101" d="M73.47,295.289c-7.795,0-16.144-6.066-18.553-13.48L4.38,126.27c-2.409-7.414,0.78-17.228,7.087-21.81
    l132.31-96.129c6.307-4.582,16.626-4.582,22.933,0l132.31,96.129c6.307,4.582,9.495,14.397,7.087,21.81l-50.538,155.539
    c-2.409,7.414-10.758,13.48-18.553,13.48H73.47z"/>
</g>
<g>
  <path fill="#ffffff" d="M115.162,192.317c-1.169,0-2.339-0.361-3.333-1.083L68.716,159.91c-1.987-1.443-2.818-4.002-2.059-6.338
    l16.468-50.683c0.759-2.336,2.936-3.917,5.392-3.917h53.291c3.131,0,5.669,2.539,5.669,5.669s-2.539,5.669-5.669,5.669H92.635
    l-13.922,42.848l36.449,26.481l39.781-28.902c2.534-1.84,6.078-1.279,7.919,1.254c1.84,2.533,1.279,6.079-1.254,7.919
    l-43.113,31.323C117.5,191.956,116.331,192.317,115.162,192.317z"/>
  <path fill="#ffffff" d="M221.969,192.318c-0.581,0-1.171-0.09-1.753-0.279c-2.978-0.967-4.607-4.166-3.64-7.144l15.195-46.765
    l-36.449-26.481l-36.449,26.481l15.195,46.765c0.968,2.978-0.662,6.176-3.64,7.144c-2.979,0.969-6.176-0.662-7.144-3.64
    l-16.468-50.683c-0.759-2.336,0.072-4.895,2.059-6.338l43.113-31.323c1.987-1.444,4.678-1.444,6.665,0l43.113,31.323
    c1.987,1.443,2.818,4.002,2.06,6.338l-16.468,50.683C226.581,190.795,224.359,192.318,221.969,192.318z"/>
  <path fill="#ffffff" d="M72.053,160.994c-1.753,0-3.482-0.811-4.591-2.337c-1.84-2.533-1.279-6.079,1.254-7.919l69.759-50.683
    c2.534-1.841,6.079-1.279,7.919,1.254c1.84,2.533,1.279,6.079-1.254,7.919L75.381,159.91
    C74.374,160.641,73.208,160.994,72.053,160.994z"/>
</g>
<text transform="matrix(1 0 0 1 70.3246 226.7817)" fill="#ffffff" fontFamily="'Lato'" fontWeight="700" fontSize="28.3465">emil axelsson</text>
</svg>

        </div>
        <canvas id="main-header-canvas"></canvas>
      </header>
    )
  }
});
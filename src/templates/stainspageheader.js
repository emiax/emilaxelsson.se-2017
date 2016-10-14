/*import React from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router';
import StainsAnimation from '../stainsAnimation';

export default class extends React.Component {
  constructor(props) {
    super(props);
    
  }

  componentDidMount() {  
    this._headerAnimation = null;

    console.log(this.props);

    let gl = null;
    let container = ReactDom.findDOMNode(this);
    let canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    function updateCanvasSize() {
      var w = container.offsetWidth;
      var h = container.offsetHeight;
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
      let size = updateCanvasSize(this._headerAnimation);
      console.log(this.props.src);
      this._headerAnimation = new StainsAnimation(gl, size[0], size[1], this.props.src);

      window.addEventListener('resize', () => {
        let size = updateCanvasSize(this._headerAnimation);
        this._headerAnimation.setSize(size[0], size[1]);
      });

      this._headerAnimation.start();
    }
  
    let self = this;
    canvas.addEventListener("mousemove", function (evt) {
      if (!evt.buttons) return;
      self._headerAnimation.applyStain(
        [(evt.pageX - this.offsetLeft) / canvas.width,
         1.0 - (evt.pageY - this.offsetTop) / canvas.height],
        Math.random() * 10,
        0.7 + 0.2 * Math.random()
      );
    });


    var imageLoader = container.getElementsByClassName('fileUpload')[0];
    imageLoader.addEventListener('change', handleImage, false);

    function handleImage(e) {
      var reader = new FileReader();
      console.log(reader);
      reader.onload = function (event) {
        var image = container.getElementsByClassName('uploadedFile')[0];
        console.log(image);
        image.src = event.target.result;
      }
        //$('.uploader img').attr('src',event.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
    


  }

  

  componentWillUnmount() {
    this._headerAnimation.stop();
  }

  render() {
    return (
      <header id="stains-page-header">
        <img className="uploadedFile" src=""/>
        <input type="file" className="fileUpload" />
      </header>
    )
  }
};*/
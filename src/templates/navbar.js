import React from 'react';
import { Link } from 'react-router';

export default class extends React.Component {
  constructor(props) {
    super(props);

    const maxHeight = 50;
    let self = this;
    let height = 50;
    let prevScroll = 0;

    this._updateNavBar = function (evt) {
      let newScroll = document.body.scrollTop;
      let diff = newScroll - prevScroll;
      
      if (newScroll < maxHeight) {
        height = maxHeight;
      } else if (diff < 0) { 
        height = Math.max(Math.min(maxHeight, height - diff), 0);      
      } else {
        height = 0;
      }

      self._navBar.style.height = height + 'px';
      prevScroll = newScroll;
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this._updateNavBar);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this._updateNavBar);
  }

  render() {
    

    return (
      <div>
      <nav ref={component => this._navBar = component} style={{height: 50}}>
      <div>
         <Link to="/">Back to start page</Link>
      </div>
      </nav>
      <div className="nav-placeholder"></div>
      </div>
    )
  }
};
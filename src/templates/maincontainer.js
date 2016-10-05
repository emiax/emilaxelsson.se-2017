import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
  render() {
    return (
      <div>
        <h1>Emil Axelsson</h1>
        <ul role="nav">
          <li><Link to="start">Emil Axelsson</Link></li>
          <li><Link to="stains">Stains</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
});
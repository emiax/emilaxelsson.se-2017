import React from 'react';
import { Link } from 'react-router';

export default class extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
};
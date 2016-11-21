/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import config from '../../config.json';

export default React.createClass({
  goToRoot(event) {
    event.preventDefault();
    // go to root path
    window.location = `http://${config.host}:${config.port}/`;
  },
  render() {
    return (
      <div>
        <div id="titlebar" onClick={this.goToRoot} >
          <img id="titlebar-img" src="../UBCLogo_Reverse.png" alt="Loading.." />
          <div id="titlebar-text">{config.titlebar}</div>
          <div id="titlebar-subtext">{config.titlebar_subtext}</div>
        </div>
        <div id="body-css">
          {this.props.children}
        </div>
        <br /><br />
      </div>
    );
  },
});

/* eslint-disable no-constant-condition */

import React from 'react';
import { Row, Col } from 'elemental';
import NavLink from '../shared_components/NavLink';
import Logout from '../shared_components/Logout';
import Ajax from '../shared_components/Ajax';

export default React.createClass({
  getInitialState() {
    return {
      loaded: false,
      files: {
        adminsFile: {},
        myAdminIndex: 0,
        studentsFile: {},
        teamsFile: {},
        deliverablesFile: {},
        gradesFile: {},
        namesArray: [],
      },
    };
  },
  componentDidMount() {
    this.loadAdminPortal();
  },
  loadAdminPortal() {
    Ajax.loadAdminPortal(
      (response) => {
        // console.log("AdminPortal.js| Retrieved files: " + JSON.stringify(response, null, 2));
        this.setState({ files: response }, () => {
          // verify files exist and are a proper format here
          if (1) {
            this.setState({ loaded: true });
          } else {
            alert(`Error loading files for user ${localStorage.username}!`);
          }
        });
      },
      () => {
        // console.log('AdminPortal.js| Error getting files!');
      },
    );
  },
  renderLogout() {
    let firstname = null;
    let prof = null;

    if (this.state.files.adminsFile.length >= 0) {
      firstname = this.state.files.adminsFile[this.state.files.myAdminIndex].firstname;
      prof = this.state.files.adminsFile[this.state.files.myAdminIndex].prof;
    }

    return (<Logout
      firstname={firstname}
      sid={prof ? 'Prof' : 'TA'}
      username={localStorage.username}
    />);
  },
  render() {
    // more info: http://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children
    const childrenWithProps = React.Children.map(
        this.props.children,
        (child) => React.cloneElement(child, { files: this.state.files }),
    );

    return (
      <div>
        <div id="NavLinks">
          <Row>
            <Col sm="1/3">
              <NavLink to="/admin/teams" onlyActiveOnIndex>Teams</NavLink>
            </Col>
            <Col sm="1/3">
              <NavLink to="/admin/students">Students</NavLink>
            </Col>
            <Col sm="1/3">
              <NavLink to="/admin/deliverables">Deliverables</NavLink>
            </Col>
          </Row>
        </div>

        {this.renderLogout()}
        {this.state.loaded && childrenWithProps}
      </div>
    );
  },
});

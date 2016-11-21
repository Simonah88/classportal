/* eslint-disable jsx-a11y/anchor-has-content */

import React from 'react';
import { Link } from 'react-router';

const NavLink = (props) => (
  <Link {...props} activeClassName="active" />
);

export default NavLink;

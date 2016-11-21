/* eslint-disable no-useless-escape */

import React from 'react';
import { Spinner } from 'elemental';
import { browserHistory } from 'react-router';
import Ajax from '../shared_components/Ajax';

export default React.createClass({
  getInitialState() {
    return { error: false };
  },
  componentDidMount() {
    this.sendAuthCode();
  },
  getAuthCode(url, callback) {
    const validAuthCode = /[?]code=([\w\/\-]+)/;
    if (validAuthCode.test(url)) {
      const authcode = url.split('code=')[1];
      // console.log("PostLogin.js| Obtained authcode: " + authcode)
      callback(authcode);
    } else {
      this.setState({ error: true }, () => {
        // console.log("PostLogin.js| Error: redirecting to login..");
        setTimeout(() => {
          browserHistory.push('/');
        }, 2000);
      });
    }
  },
  sendAuthCode() {
    this.getAuthCode(window.location.href, (authcode) => {
      Ajax.login(
        localStorage.csid ? localStorage.csid : '',
        localStorage.sid ? localStorage.sid : '',
        authcode,
        (response) => {
          // console.log('PostLogin.js| Authentication success!
          // Response: ' + JSON.stringify(response));
          const admin = response.admin;
          const username = response.username;
          const token = response.token;

          // clear any previously saved values in localstorage
          localStorage.clear();

          if (!!username && !!token) {
            if (admin === true) {
              // console.log("PostLogin.js| Admin login! Redirecting..");
              localStorage.setItem('username', username);
              localStorage.setItem('token', token);
              localStorage.setItem('admin', 'true');
              browserHistory.push('/admin');
            } else {
              // console.log("PostLogin.js| Student login! Redirecting..");
              localStorage.setItem('username', username);
              localStorage.setItem('token', token);
              browserHistory.push('/');
            }
          } else {
            // bad login, so send back to login page
            this.setState({ error: true }, () => {
              // console.log('Login failed! Redirecting..');
              setTimeout(() => {
                browserHistory.push('/');
              }, 2500);
            });
          }
        },
        (xhr) => {
          const errMsg = JSON.parse(xhr.responseText);
          alert(`Error: ${errMsg}`);

          // clear student info set by register process
          localStorage.clear();

          // display error message for 3 seconds before redirecting to login
          this.setState({ error: true }, () => {
            // console.log('Login failed! Redirecting..');
            setTimeout(() => {
              browserHistory.push('/');
            }, 2500);
          });
        },
      );
    });
  },
  render() {
    return (
      <div className="module">
        <h3>{this.state.error ? 'Error! Redirecting to Login' : 'Connecting to GitHub'}</h3>
        <Spinner size="lg" type="primary" /><br /><br />
      </div>
    );
  },
});

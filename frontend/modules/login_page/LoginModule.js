import React from 'react';
import { browserHistory } from 'react-router';
import { Form, FormField, Button, Glyph, ButtonGroup } from 'elemental';
import config from '../../../config.json';

export default React.createClass({
  registerButton(event) {
    event.preventDefault();
    browserHistory.push('/register');
  },
  loginButton(event) {
    event.preventDefault();
    const clientId = config.client_id;
    const redirectUri = `http://${config.host}:${config.port}/postlogin`;
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  },
  render() {
    return (
      <div className="module">
        <h3>Login</h3>
        <Form id="text-center">
          <FormField>
            <ButtonGroup>
              <Button id="1" size="sm" onClick={this.registerButton}>
                <Glyph icon="bookmark" />
                &nbsp; Register Account
              </Button>
              <Button id="2" size="sm" onClick={this.loginButton}>
                <Glyph icon="mark-github" />
                &nbsp; Log in with GitHub
              </Button>
            </ButtonGroup>
          </FormField>
        </Form>
      </div>
    );
  },
});

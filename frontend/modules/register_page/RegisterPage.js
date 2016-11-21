import React from 'react';
import { Form, FormField, Button, FormInput, FormIconField, Glyph } from 'elemental';
import config from '../../../config.json';
import Ajax from '../shared_components/Ajax';

// const sidRegex = /^([0-9]){8}$/;
// const csidRegex = /^[a-z][0-9][a-z][0-9]$/;

export default React.createClass({
  handleSubmit(event) {
    event.preventDefault();
    const sid = event.target.elements[0].value;
    const csid = event.target.elements[1].value;

    Ajax.register(
      csid,
      sid,
      () => {
        // clear any previously set values in localstorage
        localStorage.clear();

        // set sid and csid for later use by postlogin
        localStorage.setItem('sid', sid);
        localStorage.setItem('csid', csid);

        // login with github
        const clientId = config.client_id;
        const redirectUri = `http://${config.host}:${config.port}/postlogin`;
        window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
      },
      (xhr) => {
        const errMsg = JSON.parse(xhr.responseText);
        alert(`Error: ${errMsg}`);

        // clear any previously set values in localstorage
        localStorage.clear();
      },
    );
  },
  render() {
    return (
      <div className="module">
        <h3>Register</h3>
        <p>Please confirm your student identity to continue registration.</p><br /><br />
        <Form onSubmit={this.handleSubmit} className="form" type="horizontal">
          <FormIconField label="UBC Student Number" iconPosition="left" iconKey="mortar-board">
            <FormInput placeholder="eg. 12345678" />
          </FormIconField>
          <FormIconField label="Computer Science ID" iconPosition="left" iconKey="keyboard">
            <FormInput placeholder="eg. a1b2" />
          </FormIconField>
          <FormField offsetAbsentLabel>
            <Button submit>
              <Glyph icon="mark-github" />
              &nbsp; Continue to GitHub
            </Button>
          </FormField>
        </Form>
      </div>
    );
  },
});

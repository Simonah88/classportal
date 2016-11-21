import React from 'react';
import { FormInput, FormIconField, Glyph, Button, InputGroup } from 'elemental';
import { browserHistory } from 'react-router';
import Ajax from '../shared_components/Ajax';

export default React.createClass({
  logoutSubmit(event) {
    event.preventDefault();
    Ajax.logout(
      () => {
        localStorage.clear();
        browserHistory.push('/login');
      },
      () => {
        /* Design: For any reason, if the logout process fails, we still log the
           user out as normal instead of leaving them stuck in the course portal.
           Similarly, the server will clear the servertoken even if there were any
           errors.
        */
        localStorage.clear();
        browserHistory.push('/login');
      },
    );
  },
  render() {
    return (
      <div className="module">
        <h3>Welcome, {this.props.firstname}!</h3>
        <InputGroup >
          <InputGroup.Section grow >
            <FormIconField iconKey="mortar-board" >
              <FormInput
                placeholder={` ${this.props.sid}`}
                size="sm"
                disabled
              />
            </FormIconField>
          </InputGroup.Section>
          <InputGroup.Section grow>
            <FormIconField iconKey="mark-github" >
              <FormInput
                placeholder={` ${this.props.username}`}
                size="sm"
                disabled
              />
            </FormIconField>
          </InputGroup.Section>
          <InputGroup.Section>
            <Button size="sm" onClick={this.logoutSubmit}>
              <Glyph icon="sign-out" />&nbsp; Log out
            </Button>
          </InputGroup.Section>
        </InputGroup>
      </div>
    );
  },
});

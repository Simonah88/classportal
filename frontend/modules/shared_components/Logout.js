import React from 'react'
import { Form, FormRow, FormField, FormInput, FormIconField, Glyph, Button } from 'elemental'
import Auth from '../Auth'
import {browserHistory} from 'react-router'
import Ajax from '../shared_components/Ajax'

export default React.createClass({
  logoutSubmit: function (event) {
    event.preventDefault();
    Ajax.logout(
      function success (response) {
        console.log("Logout.js| Success: " + response);
        localStorage.clear();
        Auth.logout();
        console.log("Logout.js| Logged out!");
        browserHistory.push("/login");
      }.bind(this),
      function error (xhr, status, err) {
        //Design: For any reason, if the logout process fails, we still log the
        //user out as normal instead of leaving them stuck in the course portal.
        console.log("Logout.js| Error: "+status+err);
        localStorage.clear();
        Auth.logout();
        console.log("Logout.js| Logged out!");
        browserHistory.push("/login");
      }.bind(this)
    )
  },
  render: function () {
    return (
      <div className="module">
        <h3>Welcome, {this.props.firstname}!</h3><br/>

        <Form id="logout-form" type="inline" onSubmit={this.logoutSubmit}>
        <FormIconField id="logout-formfield" iconPosition="left" iconKey="mortar-board" >
          <FormInput placeholder={" "+this.props.sid} name="supported-controls-input-sm" size="sm" name="supported-controls-input-disabled" disabled />
        </FormIconField>
        <FormIconField id="logout-formfield" iconPosition="left" iconKey="mark-github" >
          <FormInput placeholder={" "+this.props.user} name="supported-controls-input-sm" size="sm" name="supported-controls-input-disabled" disabled />
        </FormIconField>
        <FormField id="logout-formfield">
          <Button size="sm" submit><Glyph icon="sign-out"/>&nbsp; Log out</Button>
        </FormField>
      </Form>
      </div>      

      
    )}
})
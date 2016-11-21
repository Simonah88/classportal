import React from 'react';
import { Form, FormField, FormSelect, Button } from 'elemental';
import config from '../../../config.json';
import ContentModule from '../shared_components/ContentModule';
import Ajax from './Ajax';

export default React.createClass({
  getInitialState() {
    return { newTeamArray: [] };
  },
  handleSubmit(e) {
    e.preventDefault();
    const newTeamArray = this.state.newTeamArray;
    let alertMessage = 'Forming team with students: ';

    // check for valid students
    for (let i = 0; i < config.team_size; i++) {
      // check that there actually is a selected student at this index
      if (!!newTeamArray[i] && typeof newTeamArray[i] === 'string') {
        // check that this student was not previously selected
        for (let j = 0; j < i; j++) {
          if (newTeamArray[i] === newTeamArray[j]) {
            alert('Error: Invalid team.');
            return;
          }
        }
        alertMessage += `${newTeamArray[i]} `;
      } else {
        alert('Error: Invalid team.');
        return;
      }
    }

    if (confirm(alertMessage)) {
      Ajax.createTeam(
        newTeamArray,
        (response) => {
          // console.log("CreateTeam.js| Success: " + response);
          alert(`Success: Team ${response} created!`);
          window.location.reload(true);
        },
        () => {
          alert('Error: Could not create team.');
        },
      );
    }
  },
  handleSelect(index, value) {
    if (value) {
      // this.state is immutable, so setState a new array
      const temp = this.state.newTeamArray;
      temp[index] = value;
      this.setState({ newTeamArray: temp });
    } else {
      alert('Error: Bad selection');
    }
  },
  renderForm() {
    const oneOrMoreDropdowns = [];

    // build array of dropdown menus depending on specified team size
    for (let index = 0; index < config.team_size; index++) {
      if (index === 0 && this.props.isAdmin !== 'true') {
        oneOrMoreDropdowns[index] = this.renderFirstDropdown();
      } else {
        oneOrMoreDropdowns[index] = this.renderDropdown(index);
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormField id="text-center">
          {oneOrMoreDropdowns}
          <Button size="sm" submit>Form Team</Button>
        </FormField>
      </Form>);
  },
  renderDropdown(index) {
    return (
      <FormSelect
        key={index.toString()}
        options={this.props.namesArray}
        firstOption="Select"
        onChange={this.handleSelect.bind(this, index)}
      />);
  },
  renderFirstDropdown() {
    return (
      <FormSelect
        key="first"
        options={[{ label: this.props.studentName }]}
        firstOption="Select"
        onChange={this.handleSelect.bind(this, 0)}
      />);
  },
  render() {
    return (
      <ContentModule id="create-team" title="Create Team" initialHideContent={false}>
        {this.props.namesArray
          ? this.renderForm()
          : (
            <div>
              <h4>Error: No classlist provided.</h4>
              <br />
            </div>)
        }
      </ContentModule>
    );
  },
});

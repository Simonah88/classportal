import React from 'react';
import { Form, FormField, Button } from 'elemental';
import ContentModule from '../../shared_components/ContentModule';
// import Ajax from '../../shared_components/Ajax';

export default React.createClass({
  getInitialState() {
    return ({ files: [] });
  },
  createProjects(event) {
    event.preventDefault();
  },
  handleChange(event) {
    this.setState({ files: event.target.files });
  },
  submitCSV(event) {
    event.preventDefault();
    /*
    console.log('Submitting..');

    // grab all form data
    const files = new FormData();
    $.each(this.state.files, (key, value) => {
      files.append(key, value);
    });

    // console.log("files: " + JSON.stringify(files));

    Ajax.submitClasslist(
      files,
      (response) => {
        alert(`Successfully updated classlist!\n\n${response}`);
        window.location.reload(true);
      },
      () => {
        alert('Error updating classlist!');
        window.location.reload(true);
      },
    );
    */
  },
  render() {
    return (
      <ContentModule id="upload-classlist-module" title="Upload New Classlist" initialHideContent={false}>
        <Form onSubmit={this.submitCSV}>
          <FormField id="text-center">
            <input type="file" accept=".csv" id="inputCSV" onChange={this.handleChange} />
            <Button type="danger" size="sm" submit>Submit</Button>
          </FormField>
        </Form>
      </ContentModule>
    );
  },
});

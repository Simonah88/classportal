import React from 'react'
import { FileUpload, Form, FormRow, FormField, FormInput, FormIconField, FormSelect, Glyph, Button } from 'elemental'
import ContentModule from '../shared_components/ContentModule'
import Ajax from '../shared_components/Ajax'
import AdminStudents from './AdminStudents'

export default React.createClass({
  render: function () {
    return (
      <div>
        <AdminStudents />
        <UploadClassList />
      </div>
    )}
})

const UploadClassList = React.createClass({
  getInitialState: function () {
    return ({files: []})
  },
  createProjects: function (event) {
    event.preventDefault();
  },
  handleChange: function (event) {
    this.setState({ files: event.target.files }, function () {
      console.log("this.state.files = " + JSON.stringify(this.state.files));
    });
  },
  submitCSV: function (event) {
    event.preventDefault();
    console.log("Submitting..");
    
    //grab all form data  
    var files = new FormData();
    $.each(this.state.files, function(key, value)
    {
        files.append(key, value);
    });

    console.log("files: " + JSON.stringify(files));
    
    Ajax.submitClassList(
      files,
      function success() {
        console.log("success");
      },
      function error() {
        console.log("error");
      }
    )
  },
  render: function () {
    return (
      <ContentModule id="upload-classlist-module" title="Upload New Classlist" initialHideContent={false}>
        <Form onSubmit={this.submitCSV}>
          <FormField id="text-center">
            <input type="file" accept=".csv" id="inputCSV" onChange={this.handleChange} />
            <Button type="danger" size="sm" submit>Submit</Button>
          </FormField>
        </Form>
      </ContentModule>
    )}        
})
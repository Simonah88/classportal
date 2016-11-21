import React from 'react';
import { Form, FormField, Button } from 'elemental';
import ContentModule from '../../shared_components/ContentModule';

export default React.createClass({
  createProjects(e) {
    e.preventDefault();
    alert('Not yet implemented..');
  },
  render() {
    return (
      <ContentModule id="create-projects-module" title="Create Projects" initialHideContent={false}>
        <Form onSubmit={this.createProjects}>
          <FormField id="text-center">
            <Button type="danger" size="sm" submit>Create Projects</Button>
          </FormField>
        </Form>
      </ContentModule>
    );
  },
});

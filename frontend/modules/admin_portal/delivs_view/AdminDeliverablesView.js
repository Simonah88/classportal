import React from 'react';
import AdminDeliverables from './AdminDeliverables';

const AdminDeliverablesView = (props) => (
  <div>
    <AdminDeliverables deliverables={props.files.deliverablesFile} />
  </div>
);

export default AdminDeliverablesView;

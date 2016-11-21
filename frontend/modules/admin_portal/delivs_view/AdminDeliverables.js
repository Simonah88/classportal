import React from 'react';
import ContentModule from '../../shared_components/ContentModule';

export default React.createClass({
  renderDeliverables() {
    const that = this;
    const delivs = [];
    for (let index = 0; index < this.props.deliverables.length; index++) {
      delivs.push(that.renderDeliverable(index));
    }
    return delivs;
  },
  renderDeliverable(index) {
    const deliverable = this.props.deliverables[index];
    return (
      <tr key={index}>
        <td className="tg-edam">{deliverable.name}</td>
        <td className="tg-yw4l">
          <a href={deliverable.url} target="blank" >View</a>
        </td>
        <td className="tg-edam">{deliverable.open}</td>
        <td className="tg-edam">{deliverable.due}</td>
      </tr>
    );
  },
  render() {
    return (
      <ContentModule id="admin-deliverables-module" title="Deliverables" initialHideContent={false}>
        <table className="tg">
          <tbody>
            <tr>
              <th className="tg-yw4l">Deliverable</th>
              <th className="tg-yw4l">Link</th>
              <th className="tg-yw4l">Open</th>
              <th className="tg-yw4l">Due</th>
            </tr>
            {!!this.props.deliverables && this.renderDeliverables() }
          </tbody>
        </table>
      </ContentModule>
    );
  },
});

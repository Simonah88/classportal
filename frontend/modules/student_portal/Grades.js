import React from 'react';
import ContentModule from '../shared_components/ContentModule';

export default React.createClass({
  renderGrades() {
    const block = [];
    const grades = this.props.grades;
    const deliverables = this.props.deliverables;

    for (let index = 0; index < deliverables.length; index++) {
      block[index] = (
        <tr key={index}>
          <td className="tg-edam">{deliverables[index].name}</td>
          <td className="tg-yw4l">{grades[index]}</td>
          <td className="tg-yw4l">-</td>
        </tr>);
    }

    // console.log("Grades.js| Rendering grades");
    return (<tbody>{block}</tbody>);
  },
  render() {
    return (
      <ContentModule id="gradesModule" title="Grades" initialHideContent={false}>

        <div className="tg-wrap">
          <table className="tg">
            <tbody>
              <tr>
                <th className="tg-yw4l">Assignment</th>
                <th className="tg-yw4l">Grade</th>
                <th className="tg-yw4l">Class Average</th>
              </tr>
            </tbody>
            {!!this.props.grades && !!this.props.deliverables && this.renderGrades() }
          </table>
        </div>

      </ContentModule>
    );
  },
});

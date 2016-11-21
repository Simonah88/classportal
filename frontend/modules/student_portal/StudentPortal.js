import React from 'react';
import Deliverables from './Deliverables';
import Logout from '../shared_components/Logout';
import CreateTeam from '../shared_components/CreateTeam';
import DisplayTeam from './DisplayTeam';
import Ajax from '../shared_components/Ajax';

export default React.createClass({
  getInitialState() {
    return {
      loaded: false,
      files: {
        myStudentFile: {},
        myTeamFile: {},
        myGradesFile: {},
        deliverablesFile: {},
        namesArray: [],
      },
    };
  },
  componentDidMount() {
    this.loadStudentPortal();
  },
  loadStudentPortal() {
    Ajax.loadStudentPortal(
      (response) => {
        // console.log("StudentPortal.js| Retrieved files:" + JSON.stringify(response, null, 2));
        this.setState({ files: response }, () => {
          this.setState({ loaded: true });
        });
      },
      () => {
        // console.log('error loading files');
      },
    );
  },
  renderTeamDisplay() {
    let renderTeam;
    if (this.state.files.myStudentFile.hasTeam === true) {
      renderTeam = (
        <DisplayTeam
          myTeamFile={this.state.files.myTeamFile}
          teammateNames={this.state.files.namesArray}
        />
      );
    } else {
      renderTeam = (
        <CreateTeam
          namesArray={this.state.files.namesArray}
          isAdmin="false"
          studentName={`${this.state.files.myStudentFile.firstname} ${this.state.files.myStudentFile.lastname}`}
        />);
    }
    return renderTeam;
  },
  render() {
    return (
      <div>
        <Logout
          firstname={this.state.files.myStudentFile.firstname}
          sid={this.state.files.myStudentFile.sid}
          username={localStorage.username}
        />
        {this.state.loaded && this.renderTeamDisplay()}
        {this.state.loaded && (
          <Deliverables
            deliverables={this.state.files.deliverablesFile}
            grades={this.state.files.myGradesFile.grades}
          />)
        }
      </div>
    );
  },
});

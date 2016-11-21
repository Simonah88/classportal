import React from 'react';
import AdminStudents from './AdminStudents';
import UploadClasslist from './UploadClasslist';

const AdminStudentsView = (props) => (
  <div>
    <AdminStudents
      students={props.files.studentsFile}
      teams={props.files.teamsFile}
      myTeams={props.files.adminsFile[props.files.myAdminIndex].teams}
      deliverables={props.files.deliverablesFile}
      grades={props.files.gradesFile}
    />
    {
      props.files.adminsFile[props.files.myAdminIndex].prof === true
      && (<UploadClasslist />)
    }
  </div>
);

export default AdminStudentsView;

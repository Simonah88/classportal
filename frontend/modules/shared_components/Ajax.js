import $ from 'jquery';
import config from '../../../config.json';

module.exports = {
  login(csid, sid, authcode, successCallback, errorCallback) {
    // console.log("Ajax.js| Authenticating authcode..");
    $.ajax({
      type: 'POST',
      url: `http://${config.host}:${config.port}/api/login`,
      headers: {
        username: 'temp',
        token: 'temp',
        admin: '',
      },
      data: {
        csid,
        sid,
        authcode,
      },
      dataType: 'json',
      cache: false,
      success: successCallback,
      error: errorCallback,
    });
  },
  register(csid, sid, successCallback, errorCallback) {
    // console.log("Ajax.js| Checking if student exists in database..");
    $.ajax({
      type: 'POST',
      url: `http://${config.host}:${config.port}/api/register`,
      headers: {
        username: 'temp',
        token: 'temp',
        admin: '',
      },
      data: {
        csid,
        sid,
      },
      dataType: 'json',
      cache: false,
      success: successCallback,
      error: errorCallback,
    });
  },
  // delete server token of the current username.
  logout(successCallback, errorCallback) {
    // console.log("Ajax.js| Logging out..");
    $.ajax({
      type: 'POST',
      url: `http://${config.host}:${config.port}/api/logout`,
      headers: {
        username: localStorage.username,
        token: localStorage.token,
        admin: localStorage.admin,
      },
      data: {},
      dataType: 'json',
      cache: false,
      success: successCallback,
      error: errorCallback,
    });
  },
  loadStudentPortal(successCallback, errorCallback) {
    // console.log("Ajax.js| Getting all files for admin portal..");
    $.ajax({
      type: 'POST',
      url: `http://${config.host}:${config.port}/api/loadStudentPortal`,
      headers: {
        username: localStorage.username,
        token: localStorage.token,
        admin: '',
      },
      dataType: 'json',
      cache: false,
      success: successCallback,
      error: errorCallback,
    });
  },
  // submit new team to be created
  createTeam(namesArray, successCallback, errorCallback) {
    // console.log("Ajax.js| Creating team..");
    $.ajax({
      type: 'POST',
      url: `http://${config.host}:${config.port}/api/createTeam`,
      headers: {
        username: localStorage.username,
        token: localStorage.token,
        admin: localStorage.admin,
      },
      data: {
        newTeam: namesArray,
      },
      dataType: 'json',
      cache: false,
      success: successCallback,
      error: errorCallback,
    });
  },
  // submit new team to be disbanded
  disbandTeam(teamId, successCallback, errorCallback) {
    // console.log("Ajax.js| Disbanding team..");
    $.ajax({
      type: 'POST',
      url: `http://${config.host}:${config.port}/api/disbandTeam`,
      headers: {
        username: localStorage.username,
        token: localStorage.token,
        admin: localStorage.admin,
      },
      data: {
        teamId,
      },
      dataType: 'json',
      cache: false,
      success: successCallback,
      error: errorCallback,
    });
  },
  assignTeam(newTA, teamId, successCallback, errorCallback) {
    // console.log("Ajax.js| Assigning new TA to team");
    $.ajax({
      type: 'POST',
      url: `http://${config.host}:${config.port}/api/assignTeam`,
      headers: {
        username: localStorage.username,
        token: localStorage.token,
        admin: localStorage.admin,
      },
      data: {
        newTA,
        teamId,
      },
      dataType: 'json',
      cache: false,
      success: successCallback,
      error: errorCallback,
    });
  },
  // admin portal: gets all files upon login
  loadAdminPortal(successCallback, errorCallback) {
    // console.log("Ajax.js| Getting all files for admin portal..");
    $.ajax({
      type: 'POST',
      url: `http://${config.host}:${config.port}/api/loadAdminPortal`,
      headers: {
        username: localStorage.username,
        token: localStorage.token,
        admin: localStorage.admin,
      },
      dataType: 'json',
      cache: false,
      success: successCallback,
      error: errorCallback,
    });
  },
  // admin portal: send new classlist.csv to server
  submitClasslist(formData, successCallback, errorCallback) {
    // console.log("Ajax.js| Submitting new class list..");
    $.ajax({
      type: 'POST',
      url: `http://${config.host}:${config.port}/api/submitClasslist`,
      headers: {
        username: localStorage.username,
        token: localStorage.token,
        admin: localStorage.admin,
      },
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: successCallback,
      error: errorCallback,
    });
  },
  submitGrade(sid, assnId, grade, comment, successCallback, errorCallback) {
    // console.log("Ajax.js| Submitting new grade..");
    $.ajax({
      type: 'POST',
      url: `http://${config.host}:${config.port}/api/submitGrade`,
      headers: {
        username: localStorage.username,
        token: localStorage.token,
        admin: localStorage.admin,
      },
      data: {
        sid,
        assnId,
        grade,
        comment,
      },
      dataType: 'json',
      cache: false,
      success: successCallback,
      error: errorCallback,
    });
  },
};

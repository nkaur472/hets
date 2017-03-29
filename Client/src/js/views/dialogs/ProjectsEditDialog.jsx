import React from 'react';

import { connect } from 'react-redux';

import { Form, FormGroup, HelpBlock, ControlLabel } from 'react-bootstrap';

import _ from 'lodash';

import * as Constant from '../../constants';

import EditDialog from '../../components/EditDialog.jsx';
import FormInputControl from '../../components/FormInputControl.jsx';
import DropdownControl from '../../components/DropdownControl.jsx';
import Unimplemented from '../../components/Unimplemented.jsx';

import { isBlank } from '../../utils/string';

var ProjectsEditDialog = React.createClass({
  propTypes: {
    project: React.PropTypes.object,
    projects: React.PropTypes.object,
    
    onSave: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      projectName: this.props.project.name || '',
      projectStatus: this.props.project.status || Constant.PROJECT_STATUS_CODE_ACTIVE,
      provincialProjectNumber: this.props.project.provincialProjectNumber || '',
      projectInformation: this.props.project.information || '',
      statusError: '',
      projectNameError: '',
      projectStatusCodeError: '',
      provincialProjectNumberError: '',
    };
  },

  componentDidMount() {
    this.input.focus();
  },

  updateState(state, callback) {
    this.setState(state, callback);
  },

  didChange() {
    var project = this.props.project;

    if (this.state.projectName !== project.name) { return true; }
    if (this.state.provincialProjectNumber !== project.provincialProjectNumber) { return true; }
    if (this.state.projectInformation !== project.information) { return true; }
    if (this.state.projectStatus !== project.status) { return true; }

    return false;
  },

  isValid() {
    this.setState({
      statusError: '',
      projectNameError: '',
    });

    var valid = true;
    var project = this.props.project;
    var projectName = this.state.projectName;

    if(isBlank(projectName)) {
      this.setState({ projectNameError: 'Project name is required' });
      valid = false;
    } else if (projectName !== project.projectName) {
      var nameIgnoreCase = projectName.toLowerCase().trim();
      var existingProjects = _.reject(this.props.projects, { id: project.id});
      var existingProjectName = _.find(existingProjects, existingProjectName => existingProjectName.name.toLowerCase().trim() === nameIgnoreCase);
      if (existingProjectName) {
        this.setState({ projectNameError: 'This project name already exists'});
        valid = false;
      }
    }

    if (isBlank(this.state.provincialProjectNumber)) {
      this.setState({ provincialProjectNumberError: 'Provincial project number is required' });
      valid = false;
    }

    if (isBlank(this.state.provincialProjectNumber)) {
      this.setState({ provincialProjectNumberError: 'Project status is required' });
      valid = false;
    }

    // TODO: Project status validation

    return valid;
  },


  onSave() {
    this.props.onSave({ ...this.props.project, ...{
      name: this.state.projectName,
      status: this.state.projectStatus,
      provincialProjectNumber: this.state.provincialProjectNumber,
      information: this.state.projectInformation,
    }});
  },

  render() {
    // TODO: Restrict Information box resize
    // TODO: Only allow edit of status when no hired equipment
    return <EditDialog id="projects-edit" show={ this.props.show } bsSize="small"
      onClose={ this.props.onClose } onSave={ this.onSave } didChange={ this.didChange } isValid={ this.isValid }
      title= {
        <strong>Projects</strong>
      }>
      <Form>
        <FormGroup controlId="projectName" validationState={ this.state.projectNameError ? 'error' : null}>
          <ControlLabel>Project Name <sup>*</sup></ControlLabel>
          <FormInputControl type="text" value={ this.state.projectName } updateState={ this.updateState} inputRef={ ref => { this.input = ref; }}/>
          <HelpBlock>{ this.state.projectNameError }</HelpBlock>
        </FormGroup>
        <FormGroup controlId="provincialProjectNumber" validationState={ this.state.provincialProjectNumberError ? 'error' : null}>
          <ControlLabel>Provincial Project Number <sup>*</sup></ControlLabel>
          <FormInputControl type="text" value={ this.state.provincialProjectNumber } updateState={ this.updateState } />
        </FormGroup>
        <Unimplemented>
        <FormGroup controlId="projectStatusCode" validationState={ this.state.projectStatusCodeError ? 'error' : null }>
          <ControlLabel>Project Status <sup>*</sup></ControlLabel>
          <DropdownControl id="projectStatusCode" title={ this.state.projectStatus } updateState={ this.updateState } disabled={ true } 
            placeholder="None" blankLine 
            items={[ Constant.PROJECT_STATUS_CODE_ACTIVE, Constant.PROJECT_STATUS_CODE_COMPLETED ]}
          />
          <HelpBlock>{ this.state.projectStatusCodeError }</HelpBlock>
        </FormGroup>
        </Unimplemented>
        <FormGroup controlId="projectInformation">
          <ControlLabel>Project Information</ControlLabel>
          <FormInputControl componentClass="textarea" value={ this.state.projectInformation } updateState={ this.updateState } />
        </FormGroup>
      </Form>
      </EditDialog>;
  },
});

function mapStateToProps(state) {
  return {
    project: state.models.project,
    projects: state.models.projects,
  };
}

export default connect(mapStateToProps)(ProjectsEditDialog);
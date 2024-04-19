import React, { Component } from 'react'
import axios from 'axios'
import { Alert, Button, CustomInput, Row, Col, ButtonGroup, Input, Spinner, ButtonToolbar } from 'reactstrap'
import { Redirect } from 'react-router-dom'
import ErrorDiv from '../error/error'
import WaitingDiv from '../../components/waiting'
import update from 'react-addons-update'
import Utils from '../../classes/utils'
import PropTypes from 'prop-types'
import { ForceGraph2D } from 'react-force-graph';
import { SizeMe } from 'react-sizeme';
import Switch from 'rc-switch';
import "rc-switch/assets/index.css";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

export default class EntityConstraintsBox extends Component {

  constructor (props) {
    super(props)
    this.utils = new Utils()
    this.state = {}
    this.cancelRequest
    this.editConstraints = this.props.editConstraints.bind(this)
    this.removeConstraints = this.props.removeConstraints.bind(this)
  }

  render () {
    form = (
        <table style={{ width: '100%' }}>
          <tr>
            <td>
              {this.props.entityConstraint.entityName}
            </td>
            <td>
              <ButtonGroup>
                <Button id={this.props.entityConstraints.id} size="sm" color="secondary" onClick={this.editConstraints}>Edit</Button>
                <Button id={this.props.entityConstraints.id} size="sm" color="danger" onClick={this.removeConstraints}>Remove</Button>
              </ButtonGroup>
            </td>
          </tr>
        </table>
      )
    }

    return (
      <div className="attribute-box">
        <label className="attr-label">{this.props.attribute.label}</label>
        {attrIcons}
        {form}
      </div>
    )
  }
}

EntityConstraintsBox.propTypes = {
  waitForStart: PropTypes.bool,
  config: PropTypes.object,
  entityConstraints: PropTypes.object,
  removeConstraints: PropTypes.func,
  editConstraints: PropTypes.func
}

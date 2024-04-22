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
import AttributeBox from "./attribute"

export default class EntityConstraintsModal extends Component {

  constructor (props) {
    super(props)
    this.utils = new Utils()
    this.state = {}
    this.cancelRequest
  }

  render () {
    let AttributeBoxes

    AttributeBoxes = this.props.attributes.map(attribute => {
      if (attribute.nodeId == this.props.entity.id) {
        return (
          <AttributeBox
            key={attribute.id}
            attribute={attribute}
            config={this.state.config}
            entityUri={this.props.entity.uri}
          />
        )
      }
    })

    return (
      <div>
        {AttributeBoxes}
      </div>
    )
  }
}

EntityConstraintsModal.propTypes = {
  waitForStart: PropTypes.bool,
  config: PropTypes.object,
  entity: PropTypes.object,
  attributes: PropTypes.array
}

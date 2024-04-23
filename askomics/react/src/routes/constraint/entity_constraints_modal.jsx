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
    this.state = Object.fromEntries(this.props.entityAttributes.map(attribute => {
      return [
        attribute.uri,
        {constraints: default_constraint(attribute.type)}
      ]
    }))
    this.cancelRequest
  }

  get_uri(id){
    let attr = this.props.entityAttributes.find(attribute => {
      return attribute.id == id
    })

    return attr.uri
  }


  updateGraphState (uri, value) {
    console.log(this.state)
    this.setState({[uri]: value})
  }


  toggleVisibility (event) {
    let uri = get_uri(event.target.id)
    let newVal = !this.state.entityConstraints[uri]["constraints"]["visible"]
    let value = { ...this.state[uri], constraints.visible: newVal}
    this.updateGraphState(uri, value)
  }

  toggleExclude (event) {
    let uri = get_uri(event.target.id)
    let newVal = !this.state.entityConstraints[uri]["constraints"]["exclude"]
    let value = { ...this.state[uri], constraints.exclude: newVal}
    this.updateGraphState(uri, value)
  }

  toggleOptional (event) {
    let uri = get_uri(event.target.id)
    let newVal = !this.state.entityConstraints[uri]["constraints"]["optional"]
    let value = { ...this.state[uri], constraints.optional: newVal}
    this.updateGraphState(uri, value)
  }

  handleNegative (event) {
    let uri = get_uri(event.target.id)
    let newVal = !this.state.entityConstraints[uri]["constraints"]["negative"]
    let value = { ...this.state[uri], constraints.negative: newVal}
    this.updateGraphState(uri, value)
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
            toggleVisibility={p => this.toggleVisibility(p)}
            toggleExclude={p => this.toggleExclude(p)}
            handleNegative={p => this.handleNegative(p)}
            toggleOptional={p => this.toggleOptional(p)}
            entityUri={this.currentSelected.uri}
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
  entityAttributes: PropTypes.array
}

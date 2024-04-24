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
    this.state = Object.fromEntries(this.props.entityAttributes.filter((attribute) => attribute.entityUri == this.props.entityUri). map(attribute => {
      return [
        attribute.uri,
        {constraints: this.get_default_constraints()}
      ]
    }))
    this.cancelRequest
  }


  render () {
    let AttributeBoxes

    AttributeBoxes = this.props.entityAttributes.map(attribute => {
      if (attribute.entityUri == this.props.entityUri) {
        return (
          <AttributeBox
            key={attribute.id}
            attribute={attribute}
            config={this.props.config}
            toggleVisibility={p => this.toggleVisibility(p)}
            toggleExclude={p => this.toggleExclude(p)}
            handleNegative={p => this.handleNegative(p)}
            toggleOptional={p => this.toggleOptional(p)}
            entityUri={this.props.entityUri}
            constraints={this.state[attribute.uri]['constraints']}
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
  entityUri: PropTypes.string,
  entityAttributes: PropTypes.array
}

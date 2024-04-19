import React, { Component} from 'react'
import axios from 'axios'
import { Input, FormGroup, CustomInput, FormFeedback } from 'reactstrap'
import { Redirect } from 'react-router-dom'
import DatePicker from "react-datepicker";
import ErrorDiv from '../error/error'
import WaitingDiv from '../../components/waiting'
import update from 'react-addons-update'
import Visualization from './visualization'
import PropTypes from 'prop-types'
import Utils from '../../classes/utils'
import Autocomplete from '../../components/autocomplete'
import { Tooltip } from 'react-tooltip'

export default class AttributeBox extends Component {
  constructor (props) {
    super(props)
    this.utils = new Utils()
    this.state = {}

    this.toggleVisibility = this.props.toggleVisibility.bind(this)
    this.handleNegative = this.props.handleNegative.bind(this)
    this.toggleFormAttribute = this.props.toggleFormAttribute.bind(this)
    this.toggleOptional = this.props.toggleOptional.bind(this)
    this.toggleExclude = this.props.toggleExclude.bind(this)
    this.handleFilterType = this.props.handleFilterType.bind(this)
    this.handleFilterValue = this.props.handleFilterValue.bind(this)
    this.handleFilterCategory = this.props.handleFilterCategory.bind(this)
    this.handleFilterNumericSign = this.props.handleFilterNumericSign.bind(this)
    this.handleFilterNumericValue = this.props.handleFilterNumericValue.bind(this)
    this.handleFilterDateValue = this.props.handleFilterDateValue.bind(this)
    this.toggleAddNumFilter = this.props.toggleAddNumFilter.bind(this)
    this.toggleAddDateFilter = this.props.toggleAddDateFilter.bind(this)
    this.handleDateFilter = this.props.handleDateFilter.bind(this)
    this.cancelRequest
  }

  subNums (id) {
    let newStr = ""
    let oldStr = id.toString()
    let arrayString = [...oldStr]
    arrayString.forEach(char => {
      let code = char.charCodeAt()
      newStr += String.fromCharCode(code + 8272)
    })
    return newStr
  }


  isRegisteredOnto () {
      return this.props.config.ontologies.some(onto => {
        return (onto.uri == this.props.entityUri && onto.type != "none")
      })
  }

  checkUnvalidUri (value) {
    if (value == "") {
      return false
    } else {
      if (value.includes(":")) {
        return false
      } else {
        return !this.utils.isUrl(value)
      }
    }
  }

  renderText () {

    let formIcon = 'attr-icon fas fa-bookmark inactive formTooltip'
    if (this.props.attribute.form) {
      formIcon = 'attr-icon fas fa-bookmark '
    }

    let eyeIcon = 'attr-icon fas fa-eye-slash inactive visibleTooltip'
    if (this.props.attribute.visible) {
      eyeIcon = 'attr-icon fas fa-eye'
    }

    let optionalIcon = 'attr-icon fas fa-question-circle inactive optionalTooltip'
    if (this.props.attribute.optional) {
      optionalIcon = 'attr-icon fas fa-question-circle'
    }

    let negativIcon = 'attr-icon fas fa-not-equal inactive excludeTooltip'
    if (this.props.attribute.negative) {
      negativIcon = 'attr-icon fas fa-not-equal'
    }


    let selected = {
      'exact': false,
      'regexp': false
    }

    let selected_sign = {
      '=': !this.props.attribute.negative,
      "≠": this.props.attribute.negative
    }

    selected[this.props.attribute.filterType] = true

    let form

    let input
    let attrIcons

    if (this.props.isOnto){
      attrIcons = (
        <div className="attr-icons">
          <i className={eyeIcon} id={this.props.attribute.id} onClick={this.toggleVisibility}></i>
        </div>
      )
      if (this.isRegisteredOnto() && this.props.attribute.uri == "rdfs:label"){
        input = (
          <Autocomplete config={this.props.config} entityUri={this.props.entityUri} attributeId={this.props.attribute.id} filterValue={this.props.attribute.filterValue} handleFilterValue={p => this.handleFilterValue(p)}/>
        )
      } else {
        input = (<Input disabled={this.props.attribute.optional} type="text" id={this.props.attribute.id} value={this.props.attribute.filterValue} onChange={this.handleFilterValue} />)
      }

    } else {
      attrIcons = (
        <div className="attr-icons">
          {this.props.config.user.admin ? <i className={formIcon} id={this.props.attribute.id} onClick={this.toggleFormAttribute}></i> : <nodiv></nodiv>}
          {this.props.attribute.uri == "rdf:type" || this.props.attribute.uri == "rdfs:label" ? <nodiv></nodiv> : <i className={optionalIcon} id={this.props.attribute.id} onClick={this.toggleOptional}></i> }
          <i className={eyeIcon} id={this.props.attribute.id} onClick={this.toggleVisibility}></i>
        </div>
      )
      input = (<Input disabled={this.props.attribute.optional} type="text" id={this.props.attribute.id} value={this.props.attribute.filterValue} onChange={this.handleFilterValue} />)
    }

    form = (
        <table style={{ width: '100%' }}>
          <tr>
            <td>
              <CustomInput disabled={this.props.attribute.optional} type="select" id={this.props.attribute.id} onChange={this.handleFilterType}>
                {Object.keys(selected).map(type => {
                  return <option key={type} selected={selected[type]} value={type}>{type}</option>
                })}
              </CustomInput>
            </td>
            <td>
              <CustomInput disabled={this.props.attribute.optional} type="select" id={this.props.attribute.id} onChange={this.handleNegative}>
                {Object.keys(selected_sign).map(type => {
                  return <option key={type} selected={selected_sign[type]} value={type}>{type}</option>
                })}
              </CustomInput>
            </td>
            <td>
              {input}
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

  renderNumeric () {

    let formIcon = 'attr-icon fas fa-bookmark inactive formTooltip'
    if (this.props.attribute.form) {
      formIcon = 'attr-icon fas fa-bookmark '
    }

    let eyeIcon = 'attr-icon fas fa-eye-slash inactive visibleTooltip'
    if (this.props.attribute.visible) {
      eyeIcon = 'attr-icon fas fa-eye'
    }

    let optionalIcon = 'attr-icon fas fa-question-circle inactive optionalTooltip'
    if (this.props.attribute.optional) {
      optionalIcon = 'attr-icon fas fa-question-circle'
    }

    let sign_display = {
      '=': '=',
      '<': '<',
      '<=': '≤',
      '>': '>',
      '>=': '≥',
      '!=': '≠'
    }

    let form
    let numberOfFilters = this.props.attribute.filters.length - 1

    form = (
        <table style={{ width: '100%' }}>
        {this.props.attribute.filters.map((filter, index) => {
          return (
            <tr key={index}>
              <td key={index}>
                <CustomInput key={index} data-index={index} disabled={this.props.attribute.optional} type="select" id={this.props.attribute.id} onChange={this.handleFilterNumericSign}>
                  {Object.keys(sign_display).map(sign => {
                    return <option key={sign} selected={filter.filterSign == sign ? true : false} value={sign}>{sign_display[sign]}</option>
                  })}
                </CustomInput>
              </td>
                <td>
                  <div className="input-with-icon">
                    <Input data-index={index} className="input-with-icon" disabled={this.props.attribute.optional} type="text" id={this.props.attribute.id} value={filter.filterValue} onChange={this.handleFilterNumericValue} />
                    {index == numberOfFilters ? <button className="input-with-icon"><i className="attr-icon fas fa-plus inactive" id={this.props.attribute.id} onClick={this.toggleAddNumFilter}></i></button> : <></>}
                  </div>
                </td>
            </tr>
          )
        })}
        </table>
      )
    }

    return (
      <div className="attribute-box">
        <label className="attr-label">{this.props.attribute.label}</label>
        <div className="attr-icons">
          {this.props.config.user.admin ? <i className={formIcon} id={this.props.attribute.id} onClick={this.toggleFormAttribute}></i> : <nodiv></nodiv>}
          <i className={optionalIcon} id={this.props.attribute.id} onClick={this.toggleOptional}></i>
          <i className={eyeIcon} id={this.props.attribute.id} onClick={this.toggleVisibility}></i>
        </div>
        {form}
      </div>
    )
  }

  renderCategory () {

    let formIcon = 'attr-icon fas fa-bookmark inactive formTooltip'
    if (this.props.attribute.form) {
      formIcon = 'attr-icon fas fa-bookmark '
    }

    let eyeIcon = 'attr-icon fas fa-eye-slash inactive visibleTooltip'
    if (this.props.attribute.visible) {
      eyeIcon = 'attr-icon fas fa-eye'
    }

    let optionalIcon = 'attr-icon fas fa-question-circle inactive optionalTooltip'
    if (this.props.attribute.optional) {
      optionalIcon = 'attr-icon fas fa-question-circle'
    }

    let excludeIcon = 'attr-icon fas fa-ban inactive excludeTooltip'
    if (this.props.attribute.exclude) {
      excludeIcon = 'attr-icon fas fa-ban'
    }

    let form

    form = (
        <FormGroup>
          <CustomInput disabled={this.props.attribute.optional} style={{ height: '60px' }} className="attr-select" type="select" id={this.props.attribute.id} onChange={this.handleFilterCategory} multiple>
            {this.props.attribute.filterValues.map(value => {
              let selected = this.props.attribute.filterSelectedValues.includes(value.uri)
              return (<option key={value.uri} value={value.uri} selected={selected}>{value.label}</option>)
            })}
          </CustomInput>
        </FormGroup>
      )
    }

    return (
      <div className="attribute-box">
        <label className="attr-label">{this.props.attribute.label}</label>
        <div className="attr-icons">
          {this.props.config.user.admin ? <i className={formIcon} id={this.props.attribute.id} onClick={this.toggleFormAttribute}></i> : <nodiv></nodiv>}
          <i className={optionalIcon} id={this.props.attribute.id} onClick={this.toggleOptional}></i>
          <i className={excludeIcon} id={this.props.attribute.id} onClick={this.toggleExclude}></i>
          <i className={eyeIcon} id={this.props.attribute.id} onClick={this.toggleVisibility}></i>
        </div>
        {form}
      </div>
    )
  }

  renderBoolean () {

    let formIcon = 'attr-icon fas fa-bookmark inactive formTooltip'
    if (this.props.attribute.form) {
      formIcon = 'attr-icon fas fa-bookmark '
    }

    let eyeIcon = 'attr-icon fas fa-eye-slash inactive visibleTooltip'
    if (this.props.attribute.visible) {
      eyeIcon = 'attr-icon fas fa-eye'
    }

    let optionalIcon = 'attr-icon fas fa-question-circle inactive optionalTooltip'
    if (this.props.attribute.optional) {
      optionalIcon = 'attr-icon fas fa-question-circle'
    }

    let form

    form = (
        <FormGroup>
          <CustomInput disabled={this.props.attribute.optional} style={{ height: '60px' }} className="attr-select" type="select" id={this.props.attribute.id} onChange={this.handleFilterCategory} multiple>
            <option key="true" value="true" selected={this.props.attribute.filterSelectedValues.includes("true")}>True</option>
            <option key="false" value="false" selected={this.props.attribute.filterSelectedValues.includes("false")}>False</option>
          </CustomInput>
        </FormGroup>
      )
    }

    return (
      <div className="attribute-box">
        <label className="attr-label">{this.props.attribute.label}</label>
        <div className="attr-icons">
          {this.props.config.user.admin ? <i className={formIcon} id={this.props.attribute.id} onClick={this.toggleFormAttribute}></i> : <nodiv></nodiv>}
          <i className={optionalIcon} id={this.props.attribute.id} onClick={this.toggleOptional}></i>
          <i className={eyeIcon} id={this.props.attribute.id} onClick={this.toggleVisibility}></i>
        </div>
        {form}
      </div>
    )
  }

  renderDate () {

    let formIcon = 'attr-icon fas fa-bookmark inactive formTooltip'
    if (this.props.attribute.form) {
      formIcon = 'attr-icon fas fa-bookmark '
    }

    let eyeIcon = 'attr-icon fas fa-eye-slash inactive visibleTooltip'
    if (this.props.attribute.visible) {
      eyeIcon = 'attr-icon fas fa-eye'
    }

    let optionalIcon = 'attr-icon fas fa-question-circle inactive optionalTooltip'
    if (this.props.attribute.optional) {
      optionalIcon = 'attr-icon fas fa-question-circle'
    }


    let sign_display = {
      '=': '=',
      '<': '<',
      '<=': '≤',
      '>': '>',
      '>=': '≥',
      '!=': '≠'
    }
    let form
    let numberOfFilters = this.props.attribute.filters.length - 1

    form = (
        <table style={{ width: '100%' }}>
        {this.props.attribute.filters.map((filter, index) => {
          return (
            <tr key={index}>
              <td key={index}>
                <CustomInput key={index} data-index={index} disabled={this.props.attribute.optional} type="select" id={this.props.attribute.id} onChange={this.handleDateFilter}>
                  {Object.keys(sign_display).map(sign => {
                    return <option key={sign} selected={filter.filterSign == sign ? true : false} value={sign}>{sign_display[sign]}</option>
                  })}
                </CustomInput>
              </td>
                <td>
                  <div className="input-with-icon">
                    <DatePicker dateFormat="yyyy/MM/dd" disabled={this.props.attribute.optional} id={this.props.attribute.id}
                    selected={typeof filter.filterValue === 'string' ? Date.parse(filter.filterValue) : filter.filterValue}
                    isClearable
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    onChange={(date, event) => {
                        event.target = {value:date, id: this.props.attribute.id, dataset:{index: index}};
                        this.handleFilterDateValue(event)
                    }} />
                    {index == numberOfFilters ? <button className="input-with-icon"><i className="attr-icon fas fa-plus inactive" id={this.props.attribute.id} onClick={this.toggleAddDateFilter}></i></button> : <></>}
                  </div>
                </td>
            </tr>
          )
        })}
        </table>
      )
    }

    return (
      <div className="attribute-box">
        <label className="attr-label">{this.props.attribute.label}</label>
        <div className="attr-icons">
          {this.props.config.user.admin ? <i className={formIcon} id={this.props.attribute.id} onClick={this.toggleFormAttribute}></i> : <nodiv></nodiv>}
          <i className={optionalIcon} id={this.props.attribute.id} onClick={this.toggleOptional}></i>
          <i className={eyeIcon} id={this.props.attribute.id} onClick={this.toggleVisibility}></i>
        </div>
        {form}
      </div>
    )
  }


  render () {
    let box = null
    if (this.props.attribute.type == 'text' || this.props.attribute.type == 'uri') {
      box = this.renderText()
    }
    if (this.props.attribute.type == 'decimal') {
      box = this.renderNumeric()
    }
    if (this.props.attribute.type == 'category') {
      box = this.renderCategory()
    }
    if (this.props.attribute.type == 'boolean') {
      box = this.renderBoolean()
    }
    if (this.props.attribute.type == 'date') {
      box = this.renderDate()
    }
    return box
  }
}

AttributeBox.propTypes = {
  handleNegative: PropTypes.func,
  toggleVisibility: PropTypes.func,
  toggleOptional: PropTypes.func,
  toggleFormAttribute: PropTypes.func,
  toggleExclude: PropTypes.func,
  toggleAddNumFilter: PropTypes.func,
  handleFilterType: PropTypes.func,
  handleFilterValue: PropTypes.func,
  handleFilterCategory: PropTypes.func,
  handleFilterNumericSign: PropTypes.func,
  handleFilterNumericValue: PropTypes.func,
  toggleAddDateFilter: PropTypes.func,
  handleFilterDateValue: PropTypes.func,
  handleDateFilter: PropTypes.func,
  attribute: PropTypes.object,
  graph: PropTypes.object,
  config: PropTypes.object,
  isOnto: PropTypes.bool,
  entityUri: PropTypes.string,
}

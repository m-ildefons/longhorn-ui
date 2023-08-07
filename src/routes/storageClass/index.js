import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Button } from 'antd'
import { Filter } from '../../components/index'
import CreateStorageClass from './CreateStorageClass'
import StorageClassList from './StorageClassList'
import StorageClassBulkActions from './StorageClassBulkActions'

class StorageClass extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      height: 300,
      selectedRows: [],
      createStorageClassModalVisible: false,
      createStorageClassModalKey: Math.random(),
    }
  }

  showCreateStorageClassModal = () => {
    this.setState({
      ...this.state,
      selectedRows: [],
      createStorageClassModalVisible: true,
      createStorageClassModalKey: Math.random(),
    })
  }

  render() {
    const me = this
    const { dispatch, loading, location } = this.props
    const { data } = this.props.storageClass
    const { field, value } = queryString.parse(this.props.location.search)

    let storageclasses = data.filter((item) => {
      if (field === 'name') {
        return item[field] && item[field].indexOf(value.trim()) > -1
      }
      return true
    })
    if (storageclasses && storageclasses.length > 0) {
      storageclasses.sort((a, b) => a.name.localeCompare(b.name))
    }

    const storageClassBulkActionsProps = {
      selectedRows: this.state.selectedRows,
      deleteStorageClass(record) {
        dispatch({
          type: 'storageClass/bulkDelete',
          payload: record,
          callback: () => {
            me.setState({
              ...this.state,
              selectedRows: [],
            })
          },
        })
      },
    }

    const storageClassFilterProps = {
      location,
      defaultField: 'name',
      fieldOption: [
        { value: 'name', name: 'name' },
      ],
      onSearch(filter) {
        const { field: filterField, value: filterValue } = filter
        filterField && filterValue
          ? dispatch(routerRedux.push({
            pathname: '/storageClass',
            ...queryString.parse(location.search),
            field: filterField,
            value: filterValue,
          }))
          : dispatch(routerRedux.push({
            pathname: '/storageClass',
            search: queryString.stringify({}),
          }))
      },
    }

    const createStorageClassModalProps = {
      item: {},
      visible: this.state.createStorageClassModalVisible,
      onCancel() {
        me.setState({
          ...me.state,
          createStorageClassModalVisible: false,
        })
      },
      onOk(record) {
        me.setState({
          ...me.state,
          createStorageClassModalVisible: false,
        })
        dispatch({
          type: 'storageClass/create',
          payload: record,
        })
      },
    }

    const storageClassListProps = {
      loading,
      data: storageclasses,
      height: this.state.height,
      rowSelection: {},
      deleteStorageClass(record) {
        dispatch({
          type: 'storageClass/delete',
          payload: record,
        })
      },
    }

    return (
      <div className="content-inner">
        <Row guttes={24}>
          <Col lg={{ span: 4 }} md={{ span: 6 }} sm={24} xs={24}>
            <StorageClassBulkActions {...storageClassBulkActionsProps} />
          </Col>
          <Col lg={{ offset: 13, span: 7 }} md={{ offset: 8, span: 10 }} sm={24} xs={24}>
            <Filter {...storageClassFilterProps} />
          </Col>
        </Row>
        <Button className="out-container-button" size="large" type="primary" onClick={this.showCreateStorageClassModal}>Create Storage Class</Button>
        {this.state.createStorageClassModalVisible && <CreateStorageClass key={this.createStorageClassModalKey} {...createStorageClassModalProps} />}
        <StorageClassList {...storageClassListProps} />
      </div>
    )
  }
}

StorageClass.propTypes = {
  storageClass: PropTypes.object,
  loading: PropTypes.bool,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(
  ({ storageClass, loading }) => ({
    storageClass,
    loading: loading.models.storageclass,
  })
)(StorageClass)

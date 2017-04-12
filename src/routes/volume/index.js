import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import VolumeList from './VolumeList'
import VolumeFilter from './VolumeFilter'
import CreateVolume from './CreateVolume'
import AttachHost from './AttachHost'
import Recurring from './Recurring'

class Volume extends React.Component {
  render() {
    const { dispatch, loading, location } = this.props
    const { selected, data, createVolumeModalVisible, attachHostModalVisible, recurringModalVisible } = this.props.volume
    const hosts = this.props.host.data
    const { field, keyword } = this.props.location.query

    data.forEach(vol => {
      const found = hosts.find(h => vol.controller && h.id === vol.controller.hostId)
      if (found) {
        vol.host = found.name
      }
    })
    const volumeListProps = {
      dataSource: data,
      loading,
      takeSnapshot(record) {
        dispatch({
          type: 'volume/actions',
          payload: {
            url: record.actions.snapshotCreate,
            params: {
              name: '',
            },
          },
        })
      },
      showAttachHost(record) {
        dispatch({
          type: 'volume/showAttachHostModal',
          payload: {
            selected: record,
          },
        })
      },
      showSnapshots: (record) => {
        dispatch(routerRedux.push({
          pathname: `/volume/${record.name}/snapshots`,
        }))
      },
      showRecurring(record) {
        dispatch({
          type: 'volume/showRecurringModal',
          payload: {
            selected: record,
          },
        })
      },
      deleteVolume(record) {
        dispatch({
          type: 'volume/delete',
          payload: record,
        })
      },
      detach(url) {
        dispatch({
          type: 'volume/detach',
          payload: {
            url,
          },
        })
      },
      showBackups(record) {
        dispatch(routerRedux.push({
          pathname: '/backup',
          query: {
            field: 'volumeName',
            keyword: record.name,
          },
        }))
      },
    }

    const volumeFilterProps = {
      hosts,
      field,
      location,
      keyword,
      onSearch(fieldsValue) {
        fieldsValue.keyword.length ? dispatch(routerRedux.push({
          pathname: '/volume',
          query: {
            ...location.query,
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        })) : dispatch(routerRedux.push({
          pathname: '/volume',
          query: {
          },
        }))
      },
      onSelect(selectedHost) {
        selectedHost ? dispatch(routerRedux.push({
          pathname: '/volume',
          query: {
            ...location.query,
            host: selectedHost,
          },
        })) : dispatch(routerRedux.push({
          pathname: '/volume',
          query: {
            field: location.query.field,
            keyword: location.query.keyword,
          },
        }))
      },
      onAdd: () => {
        dispatch({
          type: 'volume/showCreateVolumeModal',
        })
        this.setState({
          CreateVolumeGen(createVolumeModalProps) {
            return <CreateVolume {...createVolumeModalProps} />
          },
        })
      },
    }

    const attachHostModalProps = {
      item: selected,
      visible: attachHostModalVisible,
      hosts,
      onOk(selectedHost, url) {
        dispatch({
          type: 'volume/attach',
          payload: {
            host: selectedHost,
            url,
          },
        })
      },
      onCancel() {
        dispatch({
          type: 'volume/hideAttachHostModal',
        })
      },
    }

    const createVolumeModalProps = {
      item: {
        numberOfReplicas: 2,
        size: 20,
        iops: 1000,
        frontend: 'iscsi',
      },
      hosts,
      visible: createVolumeModalVisible,
      onOk(newVolume) {
        dispatch({
          type: 'volume/create',
          payload: newVolume,
        })
      },
      onCancel() {
        dispatch({
          type: 'volume/hideCreateVolumeModal',
        })
      },
    }

    const recurringModalProps = {
      item: selected,
      visible: recurringModalVisible,
      onOk(recurring, url) {
        dispatch({
          type: 'volume/recurringUpdate',
          payload: {
            recurring,
            url,
          },
        })
      },
      onCancel() {
        dispatch({
          type: 'volume/hideRecurringModal',
        })
      },
    }

    const CreateVolumeGen = () => <CreateVolume {...createVolumeModalProps} />
    const AttachHostGen = () => <AttachHost {...attachHostModalProps} />
    const RecurringGen = () => <Recurring {...recurringModalProps} />

    return (
      <div className="content-inner" >
        <VolumeFilter {...volumeFilterProps} />
        <VolumeList {...volumeListProps} />
        <CreateVolumeGen {...createVolumeModalProps} />
        <AttachHostGen {...attachHostModalProps} />
        <RecurringGen {...recurringModalProps} />
      </div>
    )
  }
}

Volume.propTypes = {
  volume: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
  host: PropTypes.object,
}

export default connect(({ host, volume, loading }) => ({ host, volume, loading: loading.models.volume }))(Volume)

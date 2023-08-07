import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { pagination } from '../../utils/page'
import StorageClassActions from './StorageClassActions'

function list({ loading, data, rowSelection, height, deleteStorageClass }) {
  const storageClassActionsProps = {
    deleteStorageClass,
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <div>{record.name}</div>
        )
      },
    },
    {
      title: 'Reclaim Policy',
      dataIndex: 'reclaimPolicy',
      key: 'reclaimpolicy',
      render: (text, record) => {
        return (
          <div>{record.reclaimPolicy}</div>
        )
      },
    },
    {
      title: 'Allow Expansion',
      dataIndex: 'allowVolumeExpansion',
      key: 'allowvolumeexpansion',
      render: (text, record) => {
        return (
          <div>{record.allowVolumeExpansion}</div>
        )
      },
    },
    {
      title: '',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return (
          <StorageClassActions {...storageClassActionsProps} selected={record} />
        )
      },
    },
  ]

  return (
    <div>
      <Table
        bordered={false}
        columns={columns}
        rowSelection={rowSelection}
        dataSource={data}
        loading={loading}
        simple
        pagination={pagination}
        rowKey={record => record.name}
        scroll={{ x: 970, y: data.length > 0 ? height : 1 }}
      />
    </div>
  )
}

list.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
  rowSelection: PropTypes.object,
  height: PropTypes.number,
  deleteStorageClass: PropTypes.func,
}

export default list

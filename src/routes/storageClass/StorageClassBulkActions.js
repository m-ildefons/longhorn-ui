import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from 'antd'

const confirm = Modal.confirm

function bulkActions({ selectedRows, deleteStorageClass }) {
  const handleClick = (action) => {
    switch (action) {
      case 'delete':
        confirm({
          title: `Are you sure you want to delete the storage class ${selectedRows.map(item => item.name).join(',')} ?`,
          width: 760,
          onOk() {
            deleteStorageClass(selectedRows)
          },
        })
        break
      default:
    }
  }

  const allActions = [
    { key: 'delete', name: 'Delete', disabled() { return selectedRows.length === 0 } },
  ]

  return (
    <div>
      { allActions.map(item => {
        return (
          <div key={item.key}>
            &nbsp;
            <Button size="large" type="primary" disabled={item.disabled()} onClick={() => handleClick(item.key)}>{ item.name }</Button>
          </div>
        )
      }) }
    </div>
  )
}

bulkActions.propTypes = {
  selectedRows: PropTypes.array,
  deleteStorageClass: PropTypes.func,
}

export default bulkActions

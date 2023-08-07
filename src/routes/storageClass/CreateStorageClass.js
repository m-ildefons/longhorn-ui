import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Collapse, Select, Checkbox } from 'antd'
import { ModalBlur } from '../../components'

const FormItem = Form.Item
const Panel = Collapse.Panel
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 },
}

const modal = ({
  form: {
    getFieldDecorator,
  },
  item,
  visible,
  onCancel,
  onOk,
}) => {
  const modalOpts = {
    visible,
    width: 800,
    style: { top: 0 },
    onCancel,
    onOk,
  }

  const numReplicasInputOpts = {
    style: { width: '250px' },
    min: 1,
    max: 65535,
  }

  return (
    <ModalBlur {...modalOpts}>
      <Form layout="horizontal">

        <FormItem label="Name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: 'Please input Storage Class name',
              },
            ],
          })(<Input style={{ width: '80%' }} />)}
        </FormItem>

        <FormItem label="CSI Provisioner" {...formItemLayout}>
          <Select defaultValue="driver.longhorn.io" disabled>
            <Option key={'driver.longhorn.io'} value={'driver.longhorn.io'}>Longhorn</Option>
          </Select>
        </FormItem>

        <FormItem label="Allow Volume Expansion" hasFeedback style={{ flex: 0.6 }} labelCol={{ span: 6 }}>
          {getFieldDecorator('allowVolumeExpansion', {
            valuePropName: 'allowVolumeExpansion',
            initialValue: true,
          })(<Checkbox></Checkbox>)}
        </FormItem>

        <FormItem label="Reclaim Policy" hasFeedback {...formItemLayout}>
          {getFieldDecorator('reclaimPolicy', {
            initialValue: 'delete',
            rules: [],
          })(<Select>
            <Option key={'delete'} value={'delete'}>Delete</Option>
            <Option key={'retain'} value={'retain'}>Retain</Option>
          </Select>)}
        </FormItem>

        <Collapse>
          <Panel header="Advanced Parameters" key="1">
            <FormItem label="Numer of Replicas" hasFeedback style={{ flex: 0.6 }} labelCol={{ span: 5 }}>
              {getFieldDecorator('numberOfReplicas', {
                initialValue: 3,
                rules: [
                  {
                    required: true,
                    message: 'Please select the number of replicas',
                  }, {
                    validator: (rule, value, callback) => {
                      if (value === '' || typeof value !== 'number') {
                        callback()
                        return
                      }
                      if (value < 0 || value > 65536) {
                        callback('The value should be between 0 and 65535')
                      } else if (!/^\d+([.]\d{1,2})?$/.test(value)) {
                        callback('This value should have at most two decimal places')
                      } else if (value % 1 !== 0) {
                        callback('Decimals are not allowed')
                      } else {
                        callback()
                      }
                    },
                  },
                ],
              })(<InputNumber {...numReplicasInputOpts} />)}
            </FormItem>

            <FormItem label="Filesystem" hasFeedback {...formItemLayout}>
              {getFieldDecorator('filesystem', {
                initialValue: 'ext4',
                rules: [
                  {
                    required: true,
                    message: 'Please select a filesystem',
                  },
                ],
              })(<Select>
                <Option key={'ext4'} value={'ext4'}>Ext4</Option>
                <Option key={'xfs'} value={'xfs'}>XFS</Option>
              </Select>)}
            </FormItem>

            <FormItem label="mkfs Parameters" style={{ flex: 0.6 }} labelCol={{ span: 5 }}>
              {getFieldDecorator('mkfsParams', {
                initialValue: '',
                rules: [],
              })(<Input style={{ width: '60%' }} />)}
            </FormItem>

            <FormItem label="Disk Selector" {...formItemLayout}>
              {getFieldDecorator('diskSelector', {
                rules: [],
              })(<Select mode="tags">
                <Option key={'ssd'} value={'ssd'}>SSD</Option>
                <Option key={'hdd'} value={'hdd'}>HDD</Option>
              </Select>)}
            </FormItem>

            <FormItem label="Node Selector" {...formItemLayout}>
              {getFieldDecorator('nodeSelector', {
                rules: [],
              })(<Select mode="tags">
                <Option key={'ssd'} value={'ssd'}>SSD</Option>
                <Option key={'hdd'} value={'hdd'}>HDD</Option>
              </Select>)}
            </FormItem>
          </Panel>
        </Collapse>
      </Form>
    </ModalBlur>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)

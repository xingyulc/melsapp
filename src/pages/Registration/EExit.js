import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
    Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Steps, Radio, Table
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { submitForm, submitDelete } from '@/utils/event';
import { pagination } from '@/utils/utils'

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;


@connect(({ machinery,eExit,project, loading }) => ({
    machinery,eExit,project,
    loading: loading,
}))
@Form.create()
export default class EExit extends PureComponent {
    state = {
        list: [],
        expandForm: false,
        isShowForm: false,
        url: 'eExit',
    };
    params = {
        page: 1,
        pageSize: 10,
        no: '',
        machineryId:''
    }

    columns = [
        {
            title: '项目',
            dataIndex: 'projectName',
        },
        {
            title: '设备编号',
            dataIndex: 'machineryNo',
        }, {
            title: '出场时间',
            dataIndex: 'exitDate'
        }, 
        {
            title: '操作',
            render: (data) => (
                <Fragment>
                    <a type="ghost" onClick={() => this.handleModalVisible(data.id)}>编辑</a>
                    <Divider type="vertical" />
                    <a type="danger" onClick={() => submitDelete(this.props.dispatch, this.state.url, data.id, this.handleFetch)} >删除</a>
                </Fragment>
            ),
        },
    ];

    renderSimpleForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="设备编号">
                            {getFieldDecorator('MachineryNo')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="项目编号">
                            {getFieldDecorator('projectNo')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">
                                查询
                  </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
                  </Button>
                            {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                展开 <Icon type="down" />
                            </a> */}
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

   


    render() {
        return (
            <PageHeaderWrapper title="设备类别列表">

                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(null)}>
                                新建
                         </Button>
                        </div>
                        <Table
                            bordered
                            columns={this.columns}
                            dataSource={this.state.list}
                            pagination={this.state.pagination}
                        />

                    </div>
                </Card>
                <Modal
                    title={this.state.title}
                    visible={this.state.isShowForm}
                    onOk={() => submitForm(this.newForm, this.state.type, this.props.dispatch, this.state.url, this.formCallback)}
                    onCancel={() => {
                        this.newForm.props.form.resetFields();
                        this.setState({
                            isShowForm: false,
                            formInfo: ''
                        })
                    }}
                >

                    <NewForm
                        formInfo={this.state.formInfo}
                        type={this.state.type}
                        wrappedComponentRef={(inst) => { this.newForm = inst; }} />
                </Modal>
            </PageHeaderWrapper>
        );
    }

    //查询
    /*******************************************************************/

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };

    

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
          formValues: {},
        });
        this.params.no = '',
        this.params.machineryId = '';
        this.handleFetch();
      };

      handleSearch = e => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          this.params.no = fieldsValue.no,
          this.params.machineryId = fieldsValue.machineryId;
          this.handleFetch();
        });
      };
    /*******************************************************************/


    componentDidMount() {
        this.handleFetch();
    }

    handleFetch = () => {
        let _this = this;
        this.props.dispatch({
            type: 'eExit/fetch',
            payload: this.params,
            callback: (response) => {
                if (response.code == 200 || response == 0) {
                    this.setState({
                        list: response.data.list,
                        pagination: pagination(response, (current) => {
                            _this.params.page = current;
                            _this.handleFetch();
                        })
                    })
                }
            }
        });
    }

   


    //显示form
    handleModalVisible = (id) => {
        let _title = "新建";
        let type = 'new';
        if (id != null && id != '') {
            _title = "修改";
            type = 'edit';
            const { dispatch } = this.props
            dispatch({
                type: 'eExit/fetchId',
                payload: id,
                callback: (response) => {
                    if (response.code == '200' || response.code == '0') {
                        this.setState({
                            formInfo: response.data
                        })
                        console.log(this.state)
                    }
                }
            });
        }
        this.setState({
            title: _title,
            type: type,
            isShowForm: true,
        })
    }


    //formCallback
    formCallback = (flag) => {
        this.newForm.props.form.resetFields();
        this.setState({
            isShowForm: flag,
            formInfo: ''
        })
        this.handleFetch();
    }
}


@connect(({ machinery,project, loading }) => ({
    machinery,project,
    loading: loading,
}))
class NewForm extends React.Component {
    state={
        machineryInfo:[],
        projectInfo:[]
    }
    componentDidMount() {
        this.fetchProject();
        this.fetchMachinery();
    }
    fetchProject=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'project/fetch',
            payload: { "page": 0, "pageSize": 0, "orderBy": "id" },
            callback: (response) => {
                if (response.code == '200' || response.code == '0') {
                    this.setState({
                        projectInfo: response.data.list
                    })
                }
            }
        });
    }

    fetchMachinery = () => {
        console.log('fetchMachinery')
        this.props.dispatch({
            type: 'machinery/fetch',
            payload: { "page": 0, "pageSize": 0, "orderBy": "id" },
            callback: (response) => {
                if (response.code == 200 || response == 0) {
                    this.setState({
                        machineryInfo: response.data.list
                    })
                }
            }
        });
        console.log('this state',this.state)
    }
    render() {
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            }
        }
        const { getFieldDecorator } = this.props.form;
        const formInfo = this.props.formInfo || {};
        const type = this.props.type;
        return (
            <Form layout="horizontal" disabled='true' >
                {
                    formInfo && type == 'id' ? formInfo.id :
                        getFieldDecorator('id', {
                            initialValue: formInfo.id,
                        })(
                            <Input type='hidden' />
                        )}

                <Form.Item label="项目" {...formItemLayout}>
                    {
                        formInfo && type == 'projectId' ? formInfo.projectId :
                            getFieldDecorator('projectId', {
                                initialValue: formInfo.projectId,
                                rules: [{
                                    required: true, message: '请选择项目',
                                }],
                            })(
                                <Select placeholder="-请选择-">
                                    {
                                        this.state.projectInfo.map(d => <Option value={d.id}>{d.projectName}</Option>)
                                    }
                                </Select>
                            )
                    }
                </Form.Item>
                <Form.Item label="设备" {...formItemLayout}>
                    {
                        formInfo && type == 'machineryId' ? formInfo.machineryId :
                            getFieldDecorator('machineryId', {
                                initialValue: formInfo.machineryId,
                                rules: [{
                                    required: true, message: '请选择设备',
                                }],
                            })(
                                <Select placeholder="-请选择-">
                                    {
                                        this.state.machineryInfo.map(d => <Option value={d.id}>{d.no}</Option>)
                                    }
                                </Select>
                            )
                    }
                </Form.Item>
               
                <Form.Item label="进场日期" {...formItemLayout}>
                    {
                        formInfo && type == 'exitDate' ? formInfo.exitDate :
                            getFieldDecorator('exitDate', {
                                initialValue: formInfo.exitDate == null ? moment(moment().locale('zh-cn').format('YYYY-MM-DD'), 'YYYY-MM-DD') : moment(formInfo.exitDate, 'YYYY-MM-DD'),
                                rules: [{
                                    required: true, message: '请选出场日期',
                                }],
                            })(
                                <DatePicker format="YYYY-MM-DD" />
                            )}
                </Form.Item>
                <Form.Item label="出场原因" {...formItemLayout}>
                    {
                        formInfo && type == 'reason' ? formInfo.reason :
                            getFieldDecorator('reason', {
                                initialValue: formInfo.reason,
                                rules: [{
                                    max: 200, message: '长度不超过255个字符',
                                }],
                            })(
                                <TextArea rows={4} />
                            )}
                </Form.Item>
            </Form>
        )
    }

}


NewForm = Form.create({ name: 'new_form' })(NewForm);


import React, { Component } from 'react';
import { Checkbox, Drawer, List } from 'antd';

interface SettingColumnProps {
  showColumnsVisible: boolean;
  showColumns: (showColumnsVisible: boolean) => void;
  settingColumns: string[];
  changeSettingColumns: (checkedValue: string[]) => void;
  columns: any[];
}

class SettingColumn extends Component<SettingColumnProps> {
  changeSettingColumns = (checkedValue: string[]) => {
    const { changeSettingColumns } = this.props;
    changeSettingColumns(checkedValue);
  };

  render() {
    const { showColumnsVisible, showColumns, settingColumns, columns } = this.props;
    return (
      <Drawer title="设置列显示" visible={showColumnsVisible} onClose={() => showColumns(false)}>
        <Checkbox.Group
          value={settingColumns}
          onChange={this.changeSettingColumns}
          style={{ width: '100%' }}
        >
          <List
            bordered
            size="small"
            dataSource={columns.filter(
              (item) => item.dataIndex !== 'setting' && item.dataIndex !== 'operate',
            )}
            renderItem={(item) => (
              <List.Item>
                <Checkbox value={item.dataIndex}>{item.title}</Checkbox>
              </List.Item>
            )}
          />
        </Checkbox.Group>
      </Drawer>
    );
  }
}

export default SettingColumn;

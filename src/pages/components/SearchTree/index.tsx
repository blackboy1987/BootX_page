import React from 'react';

import { Tree, Input } from 'antd';

const { Search } = Input;

export interface DataTree {
  name: any;
  id: number;
  key: number;
  children?: DataTree[];
}

const getParentKey = (key: number, tree: DataTree[]): number | undefined => {
  let parentKey;
  for (let i = 0; i < tree.length; i + 1) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.id === key)) {
        parentKey = node.id;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

interface SearchTreeProps {
  treeData: DataTree[];
  onSelect?: (selectKeys: any[], e?: any) => void;
}

interface SearchTreeState {
  treeData: DataTree[];
  expandedKeys: any[];
  searchValue: string;
  autoExpandParent: boolean;
}

class SearchTree extends React.Component<SearchTreeProps, SearchTreeState> {
  constructor(props: SearchTreeProps) {
    super(props);
    const { treeData } = props;
    this.state = {
      treeData,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
    };
  }

  static getDerivedStateFromProps(nextProps: SearchTreeProps, preState: SearchTreeState) {
    const { treeData } = nextProps;
    if (preState.treeData !== treeData) {
      return {
        treeData,
      };
    }
    return null;
  }

  onExpand = (expandedKeys: any[]) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  generateList = (data: DataTree[], dataList: any[]) => {
    for (let i = 0; i < data.length; i + 1) {
      const node = data[i];
      const { id, name } = node;
      dataList.push({ id, name });
      if (node.children) {
        this.generateList(node.children, dataList);
      }
    }
  };

  onChange = (e: any) => {
    const { value } = e.target;
    const { treeData } = this.state;
    const dataList: any[] = [];
    this.generateList(treeData, dataList);
    const expandedKeys = dataList
      .map((item) => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.id, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  onSelect = (selectKeys: any[], e?: any) => {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(selectKeys, e);
    }
  };

  render() {
    const { searchValue, expandedKeys, autoExpandParent, treeData } = this.state;

    const loop = (data: DataTree[]): any[] =>
      data.map((item: DataTree) => {
        const index = item.name.indexOf(searchValue);
        const beforeStr = item.name.substr(0, index);
        const afterStr = item.name.substr(index + searchValue.length);
        const name =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: 'red', fontWeight: 800, fontSize: 18 }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.name}</span>
          );
        if (item.children) {
          return { title: name, key: item.id, children: loop(item.children) };
        }

        return {
          title: name,
          key: item.id,
        };
      });
    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
        <Tree
          showIcon
          showLine
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={loop(treeData)}
          onSelect={this.onSelect}
        />
      </div>
    );
  }
}

export default SearchTree;

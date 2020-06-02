import React, { ReactText } from 'react';
import { Tree } from 'antd';
import { TreeNodeItem } from '@/utils/common';

interface TreeNodeProps {
  items: TreeNodeItem[];
  onSelect: (selectedKeys: ReactText[], e: any) => void;
  title: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ items, onSelect, title }) => {
  const renderTree = (treeSelect: TreeNodeItem[]) => {
    return treeSelect.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Tree.TreeNode key={item.id} title={item.name}>
            {renderTree(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode key={item.id} title={item.name} />;
    });
  };

  return (
    <Tree showIcon showLine defaultExpandAll onSelect={onSelect}>
      <Tree.TreeNode key="" title={title}>
        {renderTree(items)}
      </Tree.TreeNode>
    </Tree>
  );
};

export default TreeNode;

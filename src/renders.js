import _ from 'lodash';

const renderPlain = (ast, parents = []) => {
  // console.log(ast);
  const types = {
    unchenged: () => '',
    removed: (node, fullName) => `Property '${fullName}' was removed`,
    changed: (node, fullName) => `Property '${fullName}' was updated. From '${node.befor}' to '${node.after}'`,
    added: (node, fullName) => `Property '${fullName}' was added with ${_.isObject(node.after) ?
      'complex value' : `value: ${node.after}`}`,
    nested: node => renderPlain(node.value, [...parents, node.name]),
  };
  return _.reduce(ast, (acc, node) => {
    const fullName = [...parents, node.name].join('.');
    const nodeToStringFn = types[node.type];
    return [...acc, nodeToStringFn(node, fullName)];
  }, []).join('\n');
};
const rendersType = {
  plain: renderPlain,
  // visual: renderVisual,
};
export default type => rendersType[type];

// File: rules/camelCaseFunctionNames.js
module.exports = {
    meta: {
      type: "suggestion",
      docs: {
        description: "Enforce camelCase naming convention for function names",
        category: "Stylistic Issues",
        recommended: false,
      },
      messages: {
        camelCase: "Function names should be in camelCase.",
      },
      schema: [], // no options
    },
  
    create(context) {
      const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
  
      return {
        // Match function declarations
        FunctionDeclaration(node) {
          const functionName = node.id && node.id.name;
          if (functionName && !camelCaseRegex.test(functionName)) {
            context.report({
              node,
              messageId: "camelCase",
            });
          }
        },
        // Match function expressions
        FunctionExpression(node) {
          const parent = node.parent;
          const functionName = parent.id && parent.id.name;
          if (functionName && !camelCaseRegex.test(functionName)) {
            context.report({
              node: parent,
              messageId: "camelCase",
            });
          }
        },
        // Match arrow functions assigned to variables
        VariableDeclarator(node) {
          if (
            node.init &&
            (node.init.type === "ArrowFunctionExpression" || node.init.type === "FunctionExpression")
          ) {
            const variableName = node.id.name;
            if (!camelCaseRegex.test(variableName)) {
              context.report({
                node,
                messageId: "camelCase",
              });
            }
          }
        },
      };
    },
  };
  
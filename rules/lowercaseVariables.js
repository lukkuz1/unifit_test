module.exports = {
    meta: {
      type: "suggestion",
      docs: {
        description: "Enforce lowercase first letter for variable names",
        category: "Stylistic Issues",
        recommended: false,
      },
      messages: {
        lowercaseStart: "Variable '{{name}}' should start with a lowercase letter. Suggested name: '{{suggestedName}}'.",
      },
      fixable: "code",
      schema: [], // no options
    },
    create(context) {
      // Function to convert to lowercase first letter
      const toLowerCaseStart = (name) => {
        // If the name already starts with a lowercase letter, return it
        if (/^[a-z]/.test(name)) return name;
        
        // Convert first letter to lowercase
        return name.charAt(0).toLowerCase() + name.slice(1);
      };
  
      return {
        // Check variable declarations
        VariableDeclarator(node) {
          const variableName = node.id.name;
          
          // Skip if the variable is a function parameter or destructured parameter
          if (node.parent.type === 'VariableDeclaration' && 
              node.parent.parent.type !== 'ForStatement') {
            
            const lowercaseName = toLowerCaseStart(variableName);
            
            if (lowercaseName !== variableName) {
              context.report({
                node,
                messageId: "lowercaseStart",
                data: {
                  name: variableName,
                  suggestedName: lowercaseName
                },
                fix: function(fixer) {
                  return fixer.replaceText(node.id, lowercaseName);
                }
              });
            }
          }
        },
        
        // Check for object property names (excluding method names)
        Property(node) {
          // Only check if it's a key property (not a method)
          if (node.key.type === 'Identifier' && 
              node.method === false && 
              node.computed === false) {
            
            const propertyName = node.key.name;
            const lowercaseName = toLowerCaseStart(propertyName);
            
            if (lowercaseName !== propertyName) {
              context.report({
                node: node.key,
                messageId: "lowercaseStart",
                data: {
                  name: propertyName,
                  suggestedName: lowercaseName
                },
                fix: function(fixer) {
                  return fixer.replaceText(node.key, lowercaseName);
                }
              });
            }
          }
        }
      };
    },
  };
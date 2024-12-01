module.exports = {
    meta: {
      type: "problem",
      docs: {
        description: "Detect and report unused imports",
        category: "Best Practices",
        recommended: true,
      },
      messages: {
        unusedImport: "Import '{{name}}' is never used.",
        removeImport: "Remove unused import for '{{name}}'.",
      },
      fixable: "code",
      schema: [], // no options
    },
    create(context) {
      // Track imports and their usage
      const imports = new Map();
      const importUsage = new Map();
  
      return {
        // Collect all imports
        ImportDeclaration(node) {
          node.specifiers.forEach(specifier => {
            const importName = specifier.local.name;
            imports.set(importName, node);
            importUsage.set(importName, false);
          });
        },
  
        // Track variable references
        Identifier(node) {
          // Skip if not a reference (e.g., in import or declaration)
          if (node.parent.type === 'ImportSpecifier' || 
              node.parent.type === 'ImportDefaultSpecifier' ||
              node.parent.type === 'ImportNamespaceSpecifier') {
            return;
          }
  
          // Mark import as used if referenced
          const importName = node.name;
          if (importUsage.has(importName)) {
            importUsage.set(importName, true);
          }
        },
  
        // Handle JSX elements where imported components are used
        JSXIdentifier(node) {
          // If the JSX element is using an imported component, mark it as used
          const importName = node.name;
          if (importUsage.has(importName)) {
            importUsage.set(importName, true);
          }
        },
  
        // At the end of the parsing, report unused imports
        'Program:exit'(node) {
          importUsage.forEach((used, name) => {
            if (!used) {
              const importNode = imports.get(name);
              context.report({
                node: importNode,
                messageId: "unusedImport",
                data: { name },
                fix: function(fixer) {
                  // Remove the entire import line
                  return fixer.remove(importNode);
                }
              });
            }
          });
        }
      };
    },
  };
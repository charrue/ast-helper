import $ from "gogocode";
import recast from "recast-yx";
import { ASTNode } from "ast-types";
import type { GoGoAST } from "gogocode";
import { VariableDeclarationKeyWords } from "./helper/selector";
import type { FindVariableDeclarationAstOptions } from "./types";
import { renameVariableDeclaration } from "./helper/rename";

export class AstHelper {
  rawContent: string;

  ast: GoGoAST;

  static getNodePathNode(ast: GoGoAST) {
    return (ast as any)[0]?.nodePath?.node;
  }

  constructor(content: string) {
    this.rawContent = content;
    this.ast = $(content);
  }

  findVariableDeclarationAst(
    variableName: string,
    declarationOptions: FindVariableDeclarationAstOptions = {},
  ) {
    const {
      destructuringAssignment = true,
      functionDeclaration = true,
      importDeclaration = false,
      // functionParams = false,
    } = declarationOptions;

    let selector = VariableDeclarationKeyWords.map((k) => `${k} ${variableName} = $_$0`);
    if (destructuringAssignment) {
      const destructuringAssignmentSelector = VariableDeclarationKeyWords
      // const [a] = [1, 2];
        .map((k) => `${k} [${variableName}] = $_$0`)
      // const { a } = { a: 1 };
        .concat(VariableDeclarationKeyWords.map((k) => `${k} {${variableName}} = $_$0`))
      // const { a: b } = { a: 1 };
        .concat(VariableDeclarationKeyWords.map((k) => `${k} {$_$0: ${variableName}} = $_$1`))
      // const { a: { b } } = { a: { b: 2 } };
        .concat(VariableDeclarationKeyWords.map((k) => `${k} { $_$0: { ${variableName} }} = $_$1`))
        // const [ a1, [ a2, a3 ]] = [1, [2, 3] ];
        .concat(VariableDeclarationKeyWords.map((k) => `${k} [ $_$0 = [ ${variableName} ] ] = $_$1`))
        // const [ a1, { a1 }] = [1, { a1: 1 } ];
        .concat(VariableDeclarationKeyWords.map((k) => `${k} [ { ${variableName} } ] = $_$0`));
      selector = selector.concat(destructuringAssignmentSelector);
    }
    if (importDeclaration) {
      const importDeclarationSelector = [`import ${variableName} from '$_$0'`, `import {${variableName}} from '$_$0'`];
      selector = selector.concat(importDeclarationSelector);
    }
    if (functionDeclaration) {
      const functionSelector = `function ${variableName}() {}`;
      selector = selector.concat(functionSelector);
    }

    return this.ast.find(selector as any);
  }

  static rename(nodeAst: ASTNode, newName: string, originName?: string) {
    let isDeclarationNode = false;
    recast.visit(nodeAst, {
      visitDeclaration(path) {
        isDeclarationNode = true;
        if (path.value.type === "VariableDeclaration") {
          renameVariableDeclaration(path.value, newName, originName);
        }

        return false;
      },
    });

    if (isDeclarationNode === false) {
      console.warn(`rename() is only for declaration node, but ${nodeAst.type || "current ast node"} is not`);
      return false;
    }

    return nodeAst;
  }
}

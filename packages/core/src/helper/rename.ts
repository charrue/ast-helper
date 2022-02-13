/* eslint-disable no-use-before-define */
import type { RenameOptions } from "./types";
import type { namedTypes } from "ast-types";

const renameIdentifierName = (options: RenameOptions) => {
  const {
    identifier,
    newName,
    originName,
    shouldUpdate,
  } = options;

  if (identifier.type === "Identifier") {
    // 如果提供了原始变量名，则需要检查原变量名是否和当前变量名一致
    if (originName && identifier.name === originName) {
      identifier.name = newName;
    } else if (typeof shouldUpdate === "function" && shouldUpdate()) {
      identifier.name = newName;
    } else {
      // 其他情况不会去修改
    }
  }
};

const renameArrayPatternElement = (options: RenameOptions<namedTypes.ArrayPattern>) => {
  const { identifier } = options;
  if (identifier.type === "ArrayPattern") {
    const elements = identifier.elements || [];
    elements.forEach((ele) => {
      if (ele?.type === "Identifier") {
        renameIdentifierName({
          ...options,
          identifier: ele,
        });
      }
      if (ele?.type === "ObjectPattern") {
        renameObjectPatternProperty({
          ...options,
          identifier: ele,
        });
      }
      if (ele?.type === "ArrayPattern") {
        renameArrayPatternElement({
          ...options,
          identifier: ele,
        });
      }
    });
  }
};

const renameObjectPatternProperty = (options: RenameOptions<namedTypes.ObjectPattern>) => {
  const {
    identifier,
  } = options;

  if (identifier.type === "ObjectPattern") {
    const props = identifier.properties;
    props.forEach((prop) => {
      if (prop.type === "ObjectProperty") {
        renameObjectProperty({
          ...options,
          identifier: prop,
        });
      }
    });
  }
};
const renameObjectProperty = (options: RenameOptions<namedTypes.ObjectProperty>) => {
  const {
    identifier,
  } = options;

  if (identifier.type === "ObjectProperty") {
    if (identifier.value.type === "Identifier") {
      renameIdentifierName({
        ...options,
        identifier: identifier.value,
      });
    }
    if (identifier.value.type === "ObjectPattern") {
      renameObjectPatternProperty({
        ...options,
        identifier: identifier.value,
      });
    }
  }
};

export const renameVariableDeclaration = (
  path: namedTypes.VariableDeclaration,
  newName: string,
  originName?: string,
) => {
  const declarations = path.declarations as (namedTypes.VariableDeclarator)[];

  if (declarations.length > 1 && !originName) {
    // 如果存在多个声明，则给出提示，应该提供你需要修改的变量的名称
    console.warn("this VariableDeclaration has multiple declaration, you should provide name of the variable you want to rename");
    return false;
  }

  declarations.forEach((declaration, index) => {
    const identifier = declaration.id;

    if (identifier.type === "Identifier") {
      // 如果没有提供原始变量名，则只修改 VariableDeclaration 中的第一个变量名
      renameIdentifierName({
        identifier,
        originName,
        newName,
        shouldUpdate: () => index === 0,
      });
    }
    // 数组的解构赋值
    if (identifier.type === "ArrayPattern") {
      renameArrayPatternElement({
        identifier,
        originName,
        newName,
      });
    }
    // 对象的解构赋值
    if (identifier.type === "ObjectPattern") {
      renameObjectPatternProperty({
        identifier,
        originName,
        newName,
      });
    }
  });
  return false;
};

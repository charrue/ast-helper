import { expect, test } from "vitest";
import { AstHelper } from "./../../src/core";
import { code } from "../mocks/index";

const astHelper = new AstHelper(code);

test("new", () => {
  expect(astHelper).toBeInstanceOf(AstHelper);
  expect(astHelper.rawContent).toBe(code);
  expect(astHelper.ast).not.toBeNull();
});

test("find variable declare by var or let or const", () => {
  // 寻找由var或let或const声明的变量
  expect(
    astHelper
      .findVariableDeclarationAst("a")
      .generate()
      .trim(),
  ).toBe("var a = 1;");

  expect(
    astHelper
      .findVariableDeclarationAst("b")
      .generate()
      .trim(),
  ).toBe("const b = 2;");

  expect(
    astHelper
      .findVariableDeclarationAst("c")
      .generate()
      .trim(),
  ).toBe("let c = 3;");
});

test("find function", () => {
  expect(
    astHelper
      .findVariableDeclarationAst("fn1")
      .generate()
      .trim(),
  ).toBe(
    `function fn1 (x, y = 'World') {console.log('a');console.log(a, x, y);}`.trim(),
  );

  expect(
    astHelper
      .findVariableDeclarationAst("fn2")
      .generate()
      .trim(),
  ).toBe(`function fn2() {}`);

  expect(
    astHelper
      .findVariableDeclarationAst("fn3")
      .generate()
      .trim(),
  ).toBe(`const fn3 = (a, b) => {console.log(a, b);}`);

  expect(
    astHelper
      .findVariableDeclarationAst("fn4")
      .generate()
      .trim(),
  ).toBe(`const fn4=()=>'log'`);
});

test("find import", () => {
  expect(
    astHelper
      .findVariableDeclarationAst("React", { importDeclaration: true })
      .generate()
      .trim(),
  ).toBe(`import React, { useState } from "react";`);

  expect(
    astHelper
      .findVariableDeclarationAst("useState", { importDeclaration: true })
      .generate()
      .trim(),
  ).toBe(`import React, { useState } from "react";`);
});

test("find from destructuring assignment", () => {
  expect(
    astHelper
      .findVariableDeclarationAst("o1", { destructuringAssignment: true })
      .generate()
      .trim(),
  ).toBe(`const { o1, o2 } = { o1: 1, o2: 2 };`);

  expect(
    astHelper
      .findVariableDeclarationAst("o55", { destructuringAssignment: true })
      .generate()
      .trim(),
  ).toBe(`const { o3: { o4 }, o5: o55 } = { o3: { o4: 3 }, o5: 4 };`);

  expect(
    astHelper
      .findVariableDeclarationAst("o4", { destructuringAssignment: true })
      .generate()
      .trim(),
  ).toBe(`const { o3: { o4 }, o5: o55 } = { o3: { o4: 3 }, o5: 4 };`);

  expect(
    astHelper
      .findVariableDeclarationAst("a1", { destructuringAssignment: true })
      .generate()
      .trim(),
  ).toBe(`const [ a1, a2 = [a3, a4], { o6 } ] = [1, [2, 3], { o6: 6 }];`);

  expect(
    astHelper
      .findVariableDeclarationAst("a3", { destructuringAssignment: true })
      .generate()
      .trim(),
  ).toBe(`const [ a1, a2 = [a3, a4], { o6 } ] = [1, [2, 3], { o6: 6 }];`);

  expect(
    astHelper
      .findVariableDeclarationAst("o6", { destructuringAssignment: true })
      .generate()
      .trim(),
  ).toBe(`const [ a1, a2 = [a3, a4], { o6 } ] = [1, [2, 3], { o6: 6 }];`);
});

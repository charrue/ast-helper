import { expect, test } from "vitest";
import recast from "recast-yx";
import { AstHelper } from "../../src/core";
import { code } from "../mocks/index";

const astHelper = new AstHelper(code);

test("rename variable declare by var or let or const", () => {
  const node1 = AstHelper.getNodePathNode(astHelper.findVariableDeclarationAst("a"));
  AstHelper.rename(node1, "aaa");
  expect(recast.print(node1).code).toBe(`var aaa = 1;`);

  const node2 = AstHelper.getNodePathNode(astHelper.findVariableDeclarationAst("b"));
  AstHelper.rename(node2, "bbb");
  expect(recast.print(node2).code).toBe(`const bbb = 2;`);

  const node3 = AstHelper.getNodePathNode(astHelper.findVariableDeclarationAst("c"));
  AstHelper.rename(node3, "ccc");
  expect(recast.print(node3).code).toBe(`let ccc = 3;`);
});

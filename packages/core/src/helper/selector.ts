export const VariableDeclarationKeyWords = [
  "const",
  "let",
  "var",
];
export const createFunctionSelector = (functionName: string) => VariableDeclarationKeyWords.map((k) => `${k} ${functionName} = ($$$0) => {$$$1}`).concat(`function ${functionName}($$$0) {$$$1}`);

export const code = `
import React, { useState } from "react";
const moment = require('moment');
var a = 1;
const b = 2;
let c = 3;
function fn1 (x, y = 'World') {console.log('a');console.log(a, x, y);}
function fn2() {}

const fn3 = (a, b) => {console.log(a, b);}

const fn4=()=>'log'

const { o1, o2 } = { o1: 1, o2: 2 };
const { o3: { o4 }, o5: o55 } = { o3: { o4: 3 }, o5: 4 };
const [ a1, a2 = [a3, a4], { o6 } ] = [1, [2, 3], { o6: 6 }];
`;

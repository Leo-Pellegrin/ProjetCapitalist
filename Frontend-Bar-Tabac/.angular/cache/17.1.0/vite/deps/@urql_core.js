import {
  __async,
  __asyncGenerator,
  __await,
  __forAwait,
  __spreadProps,
  __spreadValues
} from "./chunk-HMLPZKPQ.js";

// node_modules/@0no-co/graphql.web/dist/graphql.web.mjs
var e = {
  NAME: "Name",
  DOCUMENT: "Document",
  OPERATION_DEFINITION: "OperationDefinition",
  VARIABLE_DEFINITION: "VariableDefinition",
  SELECTION_SET: "SelectionSet",
  FIELD: "Field",
  ARGUMENT: "Argument",
  FRAGMENT_SPREAD: "FragmentSpread",
  INLINE_FRAGMENT: "InlineFragment",
  FRAGMENT_DEFINITION: "FragmentDefinition",
  VARIABLE: "Variable",
  INT: "IntValue",
  FLOAT: "FloatValue",
  STRING: "StringValue",
  BOOLEAN: "BooleanValue",
  NULL: "NullValue",
  ENUM: "EnumValue",
  LIST: "ListValue",
  OBJECT: "ObjectValue",
  OBJECT_FIELD: "ObjectField",
  DIRECTIVE: "Directive",
  NAMED_TYPE: "NamedType",
  LIST_TYPE: "ListType",
  NON_NULL_TYPE: "NonNullType"
};
var GraphQLError = class extends Error {
  constructor(e3, r2, i3, n2, a2, t2, o2) {
    super(e3);
    this.name = "GraphQLError";
    this.message = e3;
    if (a2) {
      this.path = a2;
    }
    if (r2) {
      this.nodes = Array.isArray(r2) ? r2 : [r2];
    }
    if (i3) {
      this.source = i3;
    }
    if (n2) {
      this.positions = n2;
    }
    if (t2) {
      this.originalError = t2;
    }
    var l3 = o2;
    if (!l3 && t2) {
      var u3 = t2.extensions;
      if (u3 && "object" == typeof u3) {
        l3 = u3;
      }
    }
    this.extensions = l3 || {};
  }
  toJSON() {
    return __spreadProps(__spreadValues({}, this), {
      message: this.message
    });
  }
  toString() {
    return this.message;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLError";
  }
};
var i;
var n;
function error(e3) {
  return new GraphQLError(`Syntax Error: Unexpected token at ${n} in ${e3}`);
}
function advance(e3) {
  e3.lastIndex = n;
  if (e3.test(i)) {
    return i.slice(n, n = e3.lastIndex);
  }
}
var a = / +(?=[^\s])/y;
function blockString(e3) {
  var r2 = e3.split("\n");
  var i3 = "";
  var n2 = 0;
  var t2 = 0;
  var o2 = r2.length - 1;
  for (var l3 = 0; l3 < r2.length; l3++) {
    a.lastIndex = 0;
    if (a.test(r2[l3])) {
      if (l3 && (!n2 || a.lastIndex < n2)) {
        n2 = a.lastIndex;
      }
      t2 = t2 || l3;
      o2 = l3;
    }
  }
  for (var u3 = t2; u3 <= o2; u3++) {
    if (u3 !== t2) {
      i3 += "\n";
    }
    i3 += r2[u3].slice(n2).replace(/\\"""/g, '"""');
  }
  return i3;
}
function ignored() {
  for (var e3 = 0 | i.charCodeAt(n++); 9 === e3 || 10 === e3 || 13 === e3 || 32 === e3 || 35 === e3 || 44 === e3 || 65279 === e3; e3 = 0 | i.charCodeAt(n++)) {
    if (35 === e3) {
      while (10 !== (e3 = i.charCodeAt(n++)) && 13 !== e3) {
      }
    }
  }
  n--;
}
var t = /[_A-Za-z]\w*/y;
function name() {
  var e3;
  if (e3 = advance(t)) {
    return {
      kind: "Name",
      value: e3
    };
  }
}
var o = /(?:null|true|false)/y;
var l = /\$[_A-Za-z]\w*/y;
var u = /-?\d+/y;
var v = /(?:\.\d+)?[eE][+-]?\d+|\.\d+/y;
var d = /\\/g;
var s = /"""(?:"""|(?:[\s\S]*?[^\\])""")/y;
var c = /"(?:"|[^\r\n]*?[^\\]")/y;
function value(e3) {
  var r2;
  var a2;
  if (a2 = advance(o)) {
    r2 = "null" === a2 ? {
      kind: "NullValue"
    } : {
      kind: "BooleanValue",
      value: "true" === a2
    };
  } else if (!e3 && (a2 = advance(l))) {
    r2 = {
      kind: "Variable",
      name: {
        kind: "Name",
        value: a2.slice(1)
      }
    };
  } else if (a2 = advance(u)) {
    var f3 = a2;
    if (a2 = advance(v)) {
      r2 = {
        kind: "FloatValue",
        value: f3 + a2
      };
    } else {
      r2 = {
        kind: "IntValue",
        value: f3
      };
    }
  } else if (a2 = advance(t)) {
    r2 = {
      kind: "EnumValue",
      value: a2
    };
  } else if (a2 = advance(s)) {
    r2 = {
      kind: "StringValue",
      value: blockString(a2.slice(3, -3)),
      block: true
    };
  } else if (a2 = advance(c)) {
    r2 = {
      kind: "StringValue",
      value: d.test(a2) ? JSON.parse(a2) : a2.slice(1, -1),
      block: false
    };
  } else if (r2 = function list(e4) {
    var r3;
    if (91 === i.charCodeAt(n)) {
      n++;
      ignored();
      var a3 = [];
      while (r3 = value(e4)) {
        a3.push(r3);
      }
      if (93 !== i.charCodeAt(n++)) {
        throw error("ListValue");
      }
      ignored();
      return {
        kind: "ListValue",
        values: a3
      };
    }
  }(e3) || function object(e4) {
    if (123 === i.charCodeAt(n)) {
      n++;
      ignored();
      var r3 = [];
      var a3;
      while (a3 = name()) {
        ignored();
        if (58 !== i.charCodeAt(n++)) {
          throw error("ObjectField");
        }
        ignored();
        var t2 = value(e4);
        if (!t2) {
          throw error("ObjectField");
        }
        r3.push({
          kind: "ObjectField",
          name: a3,
          value: t2
        });
      }
      if (125 !== i.charCodeAt(n++)) {
        throw error("ObjectValue");
      }
      ignored();
      return {
        kind: "ObjectValue",
        fields: r3
      };
    }
  }(e3)) {
    return r2;
  }
  ignored();
  return r2;
}
function arguments_(e3) {
  var r2 = [];
  ignored();
  if (40 === i.charCodeAt(n)) {
    n++;
    ignored();
    var a2;
    while (a2 = name()) {
      ignored();
      if (58 !== i.charCodeAt(n++)) {
        throw error("Argument");
      }
      ignored();
      var t2 = value(e3);
      if (!t2) {
        throw error("Argument");
      }
      r2.push({
        kind: "Argument",
        name: a2,
        value: t2
      });
    }
    if (!r2.length || 41 !== i.charCodeAt(n++)) {
      throw error("Argument");
    }
    ignored();
  }
  return r2;
}
function directives(e3) {
  var r2 = [];
  ignored();
  while (64 === i.charCodeAt(n)) {
    n++;
    var a2 = name();
    if (!a2) {
      throw error("Directive");
    }
    ignored();
    r2.push({
      kind: "Directive",
      name: a2,
      arguments: arguments_(e3)
    });
  }
  return r2;
}
function field() {
  var e3 = name();
  if (e3) {
    ignored();
    var r2;
    if (58 === i.charCodeAt(n)) {
      n++;
      ignored();
      r2 = e3;
      if (!(e3 = name())) {
        throw error("Field");
      }
      ignored();
    }
    return {
      kind: "Field",
      alias: r2,
      name: e3,
      arguments: arguments_(false),
      directives: directives(false),
      selectionSet: selectionSet()
    };
  }
}
function type() {
  var e3;
  ignored();
  if (91 === i.charCodeAt(n)) {
    n++;
    ignored();
    var r2 = type();
    if (!r2 || 93 !== i.charCodeAt(n++)) {
      throw error("ListType");
    }
    e3 = {
      kind: "ListType",
      type: r2
    };
  } else if (e3 = name()) {
    e3 = {
      kind: "NamedType",
      name: e3
    };
  } else {
    throw error("NamedType");
  }
  ignored();
  if (33 === i.charCodeAt(n)) {
    n++;
    ignored();
    return {
      kind: "NonNullType",
      type: e3
    };
  } else {
    return e3;
  }
}
var f = /on/y;
function typeCondition() {
  if (advance(f)) {
    ignored();
    var e3 = name();
    if (!e3) {
      throw error("NamedType");
    }
    ignored();
    return {
      kind: "NamedType",
      name: e3
    };
  }
}
var p = /\.\.\./y;
function fragmentSpread() {
  if (advance(p)) {
    ignored();
    var e3 = n;
    var r2;
    if ((r2 = name()) && "on" !== r2.value) {
      return {
        kind: "FragmentSpread",
        name: r2,
        directives: directives(false)
      };
    } else {
      n = e3;
      var i3 = typeCondition();
      var a2 = directives(false);
      var t2 = selectionSet();
      if (!t2) {
        throw error("InlineFragment");
      }
      return {
        kind: "InlineFragment",
        typeCondition: i3,
        directives: a2,
        selectionSet: t2
      };
    }
  }
}
function selectionSet() {
  var e3;
  ignored();
  if (123 === i.charCodeAt(n)) {
    n++;
    ignored();
    var r2 = [];
    while (e3 = fragmentSpread() || field()) {
      r2.push(e3);
    }
    if (!r2.length || 125 !== i.charCodeAt(n++)) {
      throw error("SelectionSet");
    }
    ignored();
    return {
      kind: "SelectionSet",
      selections: r2
    };
  }
}
var m = /fragment/y;
function fragmentDefinition() {
  if (advance(m)) {
    ignored();
    var e3 = name();
    if (!e3) {
      throw error("FragmentDefinition");
    }
    ignored();
    var r2 = typeCondition();
    if (!r2) {
      throw error("FragmentDefinition");
    }
    var i3 = directives(false);
    var n2 = selectionSet();
    if (!n2) {
      throw error("FragmentDefinition");
    }
    return {
      kind: "FragmentDefinition",
      name: e3,
      typeCondition: r2,
      directives: i3,
      selectionSet: n2
    };
  }
}
var g = /(?:query|mutation|subscription)/y;
function operationDefinition() {
  var e3;
  var r2;
  var a2 = [];
  var t2 = [];
  if (e3 = advance(g)) {
    ignored();
    r2 = name();
    a2 = function variableDefinitions() {
      var e4;
      var r3 = [];
      ignored();
      if (40 === i.charCodeAt(n)) {
        n++;
        ignored();
        while (e4 = advance(l)) {
          ignored();
          if (58 !== i.charCodeAt(n++)) {
            throw error("VariableDefinition");
          }
          var a3 = type();
          var t3 = void 0;
          if (61 === i.charCodeAt(n)) {
            n++;
            ignored();
            if (!(t3 = value(true))) {
              throw error("VariableDefinition");
            }
          }
          ignored();
          r3.push({
            kind: "VariableDefinition",
            variable: {
              kind: "Variable",
              name: {
                kind: "Name",
                value: e4.slice(1)
              }
            },
            type: a3,
            defaultValue: t3,
            directives: directives(true)
          });
        }
        if (41 !== i.charCodeAt(n++)) {
          throw error("VariableDefinition");
        }
        ignored();
      }
      return r3;
    }();
    t2 = directives(false);
  }
  var o2 = selectionSet();
  if (o2) {
    return {
      kind: "OperationDefinition",
      operation: e3 || "query",
      name: r2,
      variableDefinitions: a2,
      directives: t2,
      selectionSet: o2
    };
  }
}
function parse(e3, r2) {
  i = "string" == typeof e3.body ? e3.body : e3;
  n = 0;
  return function document() {
    var e4;
    ignored();
    var r3 = [];
    while (e4 = fragmentDefinition() || operationDefinition()) {
      r3.push(e4);
    }
    return {
      kind: "Document",
      definitions: r3
    };
  }();
}
function printString(e3) {
  return JSON.stringify(e3);
}
function printBlockString(e3) {
  return '"""\n' + e3.replace(/"""/g, '\\"""') + '\n"""';
}
var hasItems = (e3) => !(!e3 || !e3.length);
var y = {
  OperationDefinition(e3) {
    if ("query" === e3.operation && !e3.name && !hasItems(e3.variableDefinitions) && !hasItems(e3.directives)) {
      return y.SelectionSet(e3.selectionSet);
    }
    var r2 = e3.operation;
    if (e3.name) {
      r2 += " " + e3.name.value;
    }
    if (hasItems(e3.variableDefinitions)) {
      if (!e3.name) {
        r2 += " ";
      }
      r2 += "(" + e3.variableDefinitions.map(y.VariableDefinition).join(", ") + ")";
    }
    if (hasItems(e3.directives)) {
      r2 += " " + e3.directives.map(y.Directive).join(" ");
    }
    return r2 + " " + y.SelectionSet(e3.selectionSet);
  },
  VariableDefinition(e3) {
    var r2 = y.Variable(e3.variable) + ": " + print(e3.type);
    if (e3.defaultValue) {
      r2 += " = " + print(e3.defaultValue);
    }
    if (hasItems(e3.directives)) {
      r2 += " " + e3.directives.map(y.Directive).join(" ");
    }
    return r2;
  },
  Field(e3) {
    var r2 = (e3.alias ? e3.alias.value + ": " : "") + e3.name.value;
    if (hasItems(e3.arguments)) {
      var i3 = e3.arguments.map(y.Argument);
      var n2 = r2 + "(" + i3.join(", ") + ")";
      r2 = n2.length > 80 ? r2 + "(\n  " + i3.join("\n").replace(/\n/g, "\n  ") + "\n)" : n2;
    }
    if (hasItems(e3.directives)) {
      r2 += " " + e3.directives.map(y.Directive).join(" ");
    }
    return e3.selectionSet ? r2 + " " + y.SelectionSet(e3.selectionSet) : r2;
  },
  StringValue: (e3) => e3.block ? printBlockString(e3.value) : printString(e3.value),
  BooleanValue: (e3) => "" + e3.value,
  NullValue: (e3) => "null",
  IntValue: (e3) => e3.value,
  FloatValue: (e3) => e3.value,
  EnumValue: (e3) => e3.value,
  Name: (e3) => e3.value,
  Variable: (e3) => "$" + e3.name.value,
  ListValue: (e3) => "[" + e3.values.map(print).join(", ") + "]",
  ObjectValue: (e3) => "{" + e3.fields.map(y.ObjectField).join(", ") + "}",
  ObjectField: (e3) => e3.name.value + ": " + print(e3.value),
  Document: (e3) => hasItems(e3.definitions) ? e3.definitions.map(print).join("\n\n") : "",
  SelectionSet: (e3) => "{\n  " + e3.selections.map(print).join("\n").replace(/\n/g, "\n  ") + "\n}",
  Argument: (e3) => e3.name.value + ": " + print(e3.value),
  FragmentSpread(e3) {
    var r2 = "..." + e3.name.value;
    if (hasItems(e3.directives)) {
      r2 += " " + e3.directives.map(y.Directive).join(" ");
    }
    return r2;
  },
  InlineFragment(e3) {
    var r2 = "...";
    if (e3.typeCondition) {
      r2 += " on " + e3.typeCondition.name.value;
    }
    if (hasItems(e3.directives)) {
      r2 += " " + e3.directives.map(y.Directive).join(" ");
    }
    return r2 + " " + print(e3.selectionSet);
  },
  FragmentDefinition(e3) {
    var r2 = "fragment " + e3.name.value;
    r2 += " on " + e3.typeCondition.name.value;
    if (hasItems(e3.directives)) {
      r2 += " " + e3.directives.map(y.Directive).join(" ");
    }
    return r2 + " " + print(e3.selectionSet);
  },
  Directive(e3) {
    var r2 = "@" + e3.name.value;
    if (hasItems(e3.arguments)) {
      r2 += "(" + e3.arguments.map(y.Argument).join(", ") + ")";
    }
    return r2;
  },
  NamedType: (e3) => e3.name.value,
  ListType: (e3) => "[" + print(e3.type) + "]",
  NonNullType: (e3) => print(e3.type) + "!"
};
function print(e3) {
  return y[e3.kind] ? y[e3.kind](e3) : "";
}

// node_modules/wonka/dist/wonka.mjs
var teardownPlaceholder = () => {
};
var e2 = teardownPlaceholder;
function start(e3) {
  return {
    tag: 0,
    0: e3
  };
}
function push(e3) {
  return {
    tag: 1,
    0: e3
  };
}
var asyncIteratorSymbol = () => "function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator";
var identity = (e3) => e3;
function filter(r2) {
  return (t2) => (i3) => {
    var a2 = e2;
    t2((e3) => {
      if (0 === e3) {
        i3(0);
      } else if (0 === e3.tag) {
        a2 = e3[0];
        i3(e3);
      } else if (!r2(e3[0])) {
        a2(0);
      } else {
        i3(e3);
      }
    });
  };
}
function map(e3) {
  return (r2) => (t2) => r2((r3) => {
    if (0 === r3 || 0 === r3.tag) {
      t2(r3);
    } else {
      t2(push(e3(r3[0])));
    }
  });
}
function mergeMap(r2) {
  return (t2) => (i3) => {
    var a2 = [];
    var f3 = e2;
    var n2 = false;
    var s2 = false;
    t2((t3) => {
      if (s2) {
      } else if (0 === t3) {
        s2 = true;
        if (!a2.length) {
          i3(0);
        }
      } else if (0 === t3.tag) {
        f3 = t3[0];
      } else {
        n2 = false;
        !function applyInnerSource(r3) {
          var t4 = e2;
          r3((e3) => {
            if (0 === e3) {
              if (a2.length) {
                var r4 = a2.indexOf(t4);
                if (r4 > -1) {
                  (a2 = a2.slice()).splice(r4, 1);
                }
                if (!a2.length) {
                  if (s2) {
                    i3(0);
                  } else if (!n2) {
                    n2 = true;
                    f3(0);
                  }
                }
              }
            } else if (0 === e3.tag) {
              a2.push(t4 = e3[0]);
              t4(0);
            } else if (a2.length) {
              i3(e3);
              t4(0);
            }
          });
        }(r2(t3[0]));
        if (!n2) {
          n2 = true;
          f3(0);
        }
      }
    });
    i3(start((e3) => {
      if (1 === e3) {
        if (!s2) {
          s2 = true;
          f3(1);
        }
        for (var r3 = 0, t3 = a2, i4 = a2.length; r3 < i4; r3++) {
          t3[r3](1);
        }
        a2.length = 0;
      } else {
        if (!s2 && !n2) {
          n2 = true;
          f3(0);
        } else {
          n2 = false;
        }
        for (var l3 = 0, u3 = a2, o2 = a2.length; l3 < o2; l3++) {
          u3[l3](0);
        }
      }
    }));
  };
}
function mergeAll(e3) {
  return mergeMap(identity)(e3);
}
function merge(e3) {
  return mergeAll(r(e3));
}
function onEnd(e3) {
  return (r2) => (t2) => {
    var i3 = false;
    r2((r3) => {
      if (i3) {
      } else if (0 === r3) {
        i3 = true;
        t2(0);
        e3();
      } else if (0 === r3.tag) {
        var a2 = r3[0];
        t2(start((r4) => {
          if (1 === r4) {
            i3 = true;
            a2(1);
            e3();
          } else {
            a2(r4);
          }
        }));
      } else {
        t2(r3);
      }
    });
  };
}
function onPush(e3) {
  return (r2) => (t2) => {
    var i3 = false;
    r2((r3) => {
      if (i3) {
      } else if (0 === r3) {
        i3 = true;
        t2(0);
      } else if (0 === r3.tag) {
        var a2 = r3[0];
        t2(start((e4) => {
          if (1 === e4) {
            i3 = true;
          }
          a2(e4);
        }));
      } else {
        e3(r3[0]);
        t2(r3);
      }
    });
  };
}
function onStart(e3) {
  return (r2) => (t2) => r2((r3) => {
    if (0 === r3) {
      t2(0);
    } else if (0 === r3.tag) {
      t2(r3);
      e3();
    } else {
      t2(r3);
    }
  });
}
function share(r2) {
  var t2 = [];
  var i3 = e2;
  var a2 = false;
  return (e3) => {
    t2.push(e3);
    if (1 === t2.length) {
      r2((e4) => {
        if (0 === e4) {
          for (var r3 = 0, f3 = t2, n2 = t2.length; r3 < n2; r3++) {
            f3[r3](0);
          }
          t2.length = 0;
        } else if (0 === e4.tag) {
          i3 = e4[0];
        } else {
          a2 = false;
          for (var s2 = 0, l3 = t2, u3 = t2.length; s2 < u3; s2++) {
            l3[s2](e4);
          }
        }
      });
    }
    e3(start((r3) => {
      if (1 === r3) {
        var f3 = t2.indexOf(e3);
        if (f3 > -1) {
          (t2 = t2.slice()).splice(f3, 1);
        }
        if (!t2.length) {
          i3(1);
        }
      } else if (!a2) {
        a2 = true;
        i3(0);
      }
    }));
  };
}
function switchMap(r2) {
  return (t2) => (i3) => {
    var a2 = e2;
    var f3 = e2;
    var n2 = false;
    var s2 = false;
    var l3 = false;
    var u3 = false;
    t2((t3) => {
      if (u3) {
      } else if (0 === t3) {
        u3 = true;
        if (!l3) {
          i3(0);
        }
      } else if (0 === t3.tag) {
        a2 = t3[0];
      } else {
        if (l3) {
          f3(1);
          f3 = e2;
        }
        if (!n2) {
          n2 = true;
          a2(0);
        } else {
          n2 = false;
        }
        !function applyInnerSource(e3) {
          l3 = true;
          e3((e4) => {
            if (!l3) {
            } else if (0 === e4) {
              l3 = false;
              if (u3) {
                i3(0);
              } else if (!n2) {
                n2 = true;
                a2(0);
              }
            } else if (0 === e4.tag) {
              s2 = false;
              (f3 = e4[0])(0);
            } else {
              i3(e4);
              if (!s2) {
                f3(0);
              } else {
                s2 = false;
              }
            }
          });
        }(r2(t3[0]));
      }
    });
    i3(start((e3) => {
      if (1 === e3) {
        if (!u3) {
          u3 = true;
          a2(1);
        }
        if (l3) {
          l3 = false;
          f3(1);
        }
      } else {
        if (!u3 && !n2) {
          n2 = true;
          a2(0);
        }
        if (l3 && !s2) {
          s2 = true;
          f3(0);
        }
      }
    }));
  };
}
function take(r2) {
  return (t2) => (i3) => {
    var a2 = e2;
    var f3 = false;
    var n2 = 0;
    t2((e3) => {
      if (f3) {
      } else if (0 === e3) {
        f3 = true;
        i3(0);
      } else if (0 === e3.tag) {
        if (r2 <= 0) {
          f3 = true;
          i3(0);
          e3[0](1);
        } else {
          a2 = e3[0];
        }
      } else if (n2++ < r2) {
        i3(e3);
        if (!f3 && n2 >= r2) {
          f3 = true;
          i3(0);
          a2(1);
        }
      } else {
        i3(e3);
      }
    });
    i3(start((e3) => {
      if (1 === e3 && !f3) {
        f3 = true;
        a2(1);
      } else if (0 === e3 && !f3 && n2 < r2) {
        a2(0);
      }
    }));
  };
}
function takeUntil(r2) {
  return (t2) => (i3) => {
    var a2 = e2;
    var f3 = e2;
    var n2 = false;
    t2((e3) => {
      if (n2) {
      } else if (0 === e3) {
        n2 = true;
        f3(1);
        i3(0);
      } else if (0 === e3.tag) {
        a2 = e3[0];
        r2((e4) => {
          if (0 === e4) {
          } else if (0 === e4.tag) {
            (f3 = e4[0])(0);
          } else {
            n2 = true;
            f3(1);
            a2(1);
            i3(0);
          }
        });
      } else {
        i3(e3);
      }
    });
    i3(start((e3) => {
      if (1 === e3 && !n2) {
        n2 = true;
        a2(1);
        f3(1);
      } else if (!n2) {
        a2(0);
      }
    }));
  };
}
function takeWhile(r2, t2) {
  return (i3) => (a2) => {
    var f3 = e2;
    var n2 = false;
    i3((e3) => {
      if (n2) {
      } else if (0 === e3) {
        n2 = true;
        a2(0);
      } else if (0 === e3.tag) {
        f3 = e3[0];
        a2(e3);
      } else if (!r2(e3[0])) {
        n2 = true;
        if (t2) {
          a2(e3);
        }
        a2(0);
        f3(1);
      } else {
        a2(e3);
      }
    });
  };
}
function lazy(e3) {
  return (r2) => e3()(r2);
}
function fromAsyncIterable(e3) {
  return (r2) => {
    var t2 = e3[asyncIteratorSymbol()] && e3[asyncIteratorSymbol()]() || e3;
    var i3 = false;
    var a2 = false;
    var f3 = false;
    var n2;
    r2(start((e4) => __async(this, null, function* () {
      if (1 === e4) {
        i3 = true;
        if (t2.return) {
          t2.return();
        }
      } else if (a2) {
        f3 = true;
      } else {
        for (f3 = a2 = true; f3 && !i3; ) {
          if ((n2 = yield t2.next()).done) {
            i3 = true;
            if (t2.return) {
              yield t2.return();
            }
            r2(0);
          } else {
            try {
              f3 = false;
              r2(push(n2.value));
            } catch (e5) {
              if (t2.throw) {
                if (i3 = !!(yield t2.throw(e5)).done) {
                  r2(0);
                }
              } else {
                throw e5;
              }
            }
          }
        }
        a2 = false;
      }
    })));
  };
}
function fromIterable(e3) {
  if (e3[Symbol.asyncIterator]) {
    return fromAsyncIterable(e3);
  }
  return (r2) => {
    var t2 = e3[Symbol.iterator]();
    var i3 = false;
    var a2 = false;
    var f3 = false;
    var n2;
    r2(start((e4) => {
      if (1 === e4) {
        i3 = true;
        if (t2.return) {
          t2.return();
        }
      } else if (a2) {
        f3 = true;
      } else {
        for (f3 = a2 = true; f3 && !i3; ) {
          if ((n2 = t2.next()).done) {
            i3 = true;
            if (t2.return) {
              t2.return();
            }
            r2(0);
          } else {
            try {
              f3 = false;
              r2(push(n2.value));
            } catch (e5) {
              if (t2.throw) {
                if (i3 = !!t2.throw(e5).done) {
                  r2(0);
                }
              } else {
                throw e5;
              }
            }
          }
        }
        a2 = false;
      }
    }));
  };
}
var r = fromIterable;
function fromValue(e3) {
  return (r2) => {
    var t2 = false;
    r2(start((i3) => {
      if (1 === i3) {
        t2 = true;
      } else if (!t2) {
        t2 = true;
        r2(push(e3));
        r2(0);
      }
    }));
  };
}
function make(e3) {
  return (r2) => {
    var t2 = false;
    var i3 = e3({
      next(e4) {
        if (!t2) {
          r2(push(e4));
        }
      },
      complete() {
        if (!t2) {
          t2 = true;
          r2(0);
        }
      }
    });
    r2(start((e4) => {
      if (1 === e4 && !t2) {
        t2 = true;
        i3();
      }
    }));
  };
}
function makeSubject() {
  var e3;
  var r2;
  return {
    source: share(make((t2) => {
      e3 = t2.next;
      r2 = t2.complete;
      return teardownPlaceholder;
    })),
    next(r3) {
      if (e3) {
        e3(r3);
      }
    },
    complete() {
      if (r2) {
        r2();
      }
    }
  };
}
function fromPromise(e3) {
  return make((r2) => {
    e3.then((e4) => {
      Promise.resolve(e4).then(() => {
        r2.next(e4);
        r2.complete();
      });
    });
    return teardownPlaceholder;
  });
}
function subscribe(r2) {
  return (t2) => {
    var i3 = e2;
    var a2 = false;
    t2((e3) => {
      if (0 === e3) {
        a2 = true;
      } else if (0 === e3.tag) {
        (i3 = e3[0])(0);
      } else if (!a2) {
        r2(e3[0]);
        i3(0);
      }
    });
    return {
      unsubscribe() {
        if (!a2) {
          a2 = true;
          i3(1);
        }
      }
    };
  };
}
function publish(e3) {
  subscribe((e4) => {
  })(e3);
}
function toPromise(r2) {
  return new Promise((t2) => {
    var i3 = e2;
    var a2;
    r2((e3) => {
      if (0 === e3) {
        Promise.resolve(a2).then(t2);
      } else if (0 === e3.tag) {
        (i3 = e3[0])(0);
      } else {
        a2 = e3[0];
        i3(0);
      }
    });
  });
}

// node_modules/@urql/core/dist/urql-core-chunk.mjs
var rehydrateGraphQlError = (e3) => {
  if (e3 && e3.message && (e3.extensions || "GraphQLError" === e3.name)) {
    return e3;
  } else if ("object" == typeof e3 && e3.message) {
    return new GraphQLError(e3.message, e3.nodes, e3.source, e3.positions, e3.path, e3, e3.extensions || {});
  } else {
    return new GraphQLError(e3);
  }
};
var CombinedError = class extends Error {
  constructor(r2) {
    var e3 = (r2.graphQLErrors || []).map(rehydrateGraphQlError);
    var t2 = ((r3, e4) => {
      var t3 = "";
      if (r3) {
        return `[Network] ${r3.message}`;
      }
      if (e4) {
        for (var a2 of e4) {
          if (t3) {
            t3 += "\n";
          }
          t3 += `[GraphQL] ${a2.message}`;
        }
      }
      return t3;
    })(r2.networkError, e3);
    super(t2);
    this.name = "CombinedError";
    this.message = t2;
    this.graphQLErrors = e3;
    this.networkError = r2.networkError;
    this.response = r2.response;
  }
  toString() {
    return this.message;
  }
};
var phash = (r2, e3) => {
  var t2 = 0 | (e3 || 5381);
  for (var a2 = 0, o2 = 0 | r2.length; a2 < o2; a2++) {
    t2 = (t2 << 5) + t2 + r2.charCodeAt(a2);
  }
  return t2;
};
var i2 = /* @__PURE__ */ new Set();
var f2 = /* @__PURE__ */ new WeakMap();
var stringify = (r2) => {
  if (null === r2 || i2.has(r2)) {
    return "null";
  } else if ("object" != typeof r2) {
    return JSON.stringify(r2) || "";
  } else if (r2.toJSON) {
    return stringify(r2.toJSON());
  } else if (Array.isArray(r2)) {
    var e3 = "[";
    for (var t2 of r2) {
      if (e3.length > 1) {
        e3 += ",";
      }
      e3 += stringify(t2) || "null";
    }
    return e3 += "]";
  } else if (v2 !== NoopConstructor && r2 instanceof v2 || l2 !== NoopConstructor && r2 instanceof l2) {
    return "null";
  }
  var a2 = Object.keys(r2).sort();
  if (!a2.length && r2.constructor && Object.getPrototypeOf(r2).constructor !== Object.prototype.constructor) {
    var o2 = f2.get(r2) || Math.random().toString(36).slice(2);
    f2.set(r2, o2);
    return stringify({
      __key: o2
    });
  }
  i2.add(r2);
  var n2 = "{";
  for (var s2 of a2) {
    var c3 = stringify(r2[s2]);
    if (c3) {
      if (n2.length > 1) {
        n2 += ",";
      }
      n2 += stringify(s2) + ":" + c3;
    }
  }
  i2.delete(r2);
  return n2 += "}";
};
var extract = (r2, e3, t2) => {
  if (null == t2 || "object" != typeof t2 || t2.toJSON || i2.has(t2)) {
  } else if (Array.isArray(t2)) {
    for (var a2 = 0, o2 = t2.length; a2 < o2; a2++) {
      extract(r2, `${e3}.${a2}`, t2[a2]);
    }
  } else if (t2 instanceof v2 || t2 instanceof l2) {
    r2.set(e3, t2);
  } else {
    i2.add(t2);
    for (var n2 of Object.keys(t2)) {
      extract(r2, `${e3}.${n2}`, t2[n2]);
    }
  }
};
var stringifyVariables = (r2) => {
  i2.clear();
  return stringify(r2);
};
var NoopConstructor = class {
};
var v2 = "undefined" != typeof File ? File : NoopConstructor;
var l2 = "undefined" != typeof Blob ? Blob : NoopConstructor;
var c2 = /("{3}[\s\S]*"{3}|"(?:\\.|[^"])*")/g;
var p2 = /(?:#[^\n\r]+)?(?:[\r\n]+|$)/g;
var replaceOutsideStrings = (r2, e3) => e3 % 2 == 0 ? r2.replace(p2, "\n") : r2;
var sanitizeDocument = (r2) => r2.split(c2).map(replaceOutsideStrings).join("").trim();
var d2 = /* @__PURE__ */ new Map();
var u2 = /* @__PURE__ */ new Map();
var stringifyDocument = (r2) => {
  var t2;
  if ("string" == typeof r2) {
    t2 = sanitizeDocument(r2);
  } else if (r2.loc && u2.get(r2.__key) === r2) {
    t2 = r2.loc.source.body;
  } else {
    t2 = d2.get(r2) || sanitizeDocument(print(r2));
    d2.set(r2, t2);
  }
  if ("string" != typeof r2 && !r2.loc) {
    r2.loc = {
      start: 0,
      end: t2.length,
      source: {
        body: t2,
        name: "gql",
        locationOffset: {
          line: 1,
          column: 1
        }
      }
    };
  }
  return t2;
};
var hashDocument = (r2) => {
  var e3 = phash(stringifyDocument(r2));
  if (r2.definitions) {
    var t2 = getOperationName(r2);
    if (t2) {
      e3 = phash(`
# ${t2}`, e3);
    }
  }
  return e3;
};
var keyDocument = (r2) => {
  var e3;
  var a2;
  if ("string" == typeof r2) {
    e3 = hashDocument(r2);
    a2 = u2.get(e3) || parse(r2, {
      noLocation: true
    });
  } else {
    e3 = r2.__key || hashDocument(r2);
    a2 = u2.get(e3) || r2;
  }
  if (!a2.loc) {
    stringifyDocument(a2);
  }
  a2.__key = e3;
  u2.set(e3, a2);
  return a2;
};
var createRequest = (r2, e3, t2) => {
  var a2 = e3 || {};
  var o2 = keyDocument(r2);
  var n2 = stringifyVariables(a2);
  var s2 = o2.__key;
  if ("{}" !== n2) {
    s2 = phash(n2, s2);
  }
  return {
    key: s2,
    query: o2,
    variables: a2,
    extensions: t2
  };
};
var getOperationName = (r2) => {
  for (var e3 of r2.definitions) {
    if (e3.kind === e.OPERATION_DEFINITION) {
      return e3.name ? e3.name.value : void 0;
    }
  }
};
var getOperationType = (r2) => {
  for (var e3 of r2.definitions) {
    if (e3.kind === e.OPERATION_DEFINITION) {
      return e3.operation;
    }
  }
};
var makeResult = (r2, e3, t2) => {
  if (!("data" in e3 || "errors" in e3 && Array.isArray(e3.errors))) {
    throw new Error("No Content");
  }
  var a2 = "subscription" === r2.kind;
  return {
    operation: r2,
    data: e3.data,
    error: Array.isArray(e3.errors) ? new CombinedError({
      graphQLErrors: e3.errors,
      response: t2
    }) : void 0,
    extensions: e3.extensions ? __spreadValues({}, e3.extensions) : void 0,
    hasNext: null == e3.hasNext ? a2 : e3.hasNext,
    stale: false
  };
};
var deepMerge = (r2, e3) => {
  if ("object" == typeof r2 && null != r2) {
    if (!r2.constructor || r2.constructor === Object || Array.isArray(r2)) {
      r2 = Array.isArray(r2) ? [...r2] : __spreadValues({}, r2);
      for (var t2 of Object.keys(e3)) {
        r2[t2] = deepMerge(r2[t2], e3[t2]);
      }
      return r2;
    }
  }
  return e3;
};
var mergeResultPatch = (r2, e3, t2, a2) => {
  var o2 = r2.error ? r2.error.graphQLErrors : [];
  var n2 = !!r2.extensions || !!e3.extensions;
  var s2 = __spreadValues(__spreadValues({}, r2.extensions), e3.extensions);
  var i3 = e3.incremental;
  if ("path" in e3) {
    i3 = [e3];
  }
  var f3 = {
    data: r2.data
  };
  if (i3) {
    var _loop = function(r3) {
      if (Array.isArray(r3.errors)) {
        o2.push(...r3.errors);
      }
      if (r3.extensions) {
        Object.assign(s2, r3.extensions);
        n2 = true;
      }
      var e4 = "data";
      var t3 = f3;
      var i4 = [];
      if (r3.path) {
        i4 = r3.path;
      } else if (a2) {
        var v4 = a2.find((e5) => e5.id === r3.id);
        if (r3.subPath) {
          i4 = [...v4.path, ...r3.subPath];
        } else {
          i4 = v4.path;
        }
      }
      for (var l3 = 0, c3 = i4.length; l3 < c3; e4 = i4[l3++]) {
        t3 = t3[e4] = Array.isArray(t3[e4]) ? [...t3[e4]] : __spreadValues({}, t3[e4]);
      }
      if (r3.items) {
        var p3 = +e4 >= 0 ? e4 : 0;
        for (var d3 = 0, u3 = r3.items.length; d3 < u3; d3++) {
          t3[p3 + d3] = deepMerge(t3[p3 + d3], r3.items[d3]);
        }
      } else if (void 0 !== r3.data) {
        t3[e4] = deepMerge(t3[e4], r3.data);
      }
    };
    for (var v3 of i3) {
      _loop(v3);
    }
  } else {
    f3.data = e3.data || r2.data;
    o2 = e3.errors || o2;
  }
  return {
    operation: r2.operation,
    data: f3.data,
    error: o2.length ? new CombinedError({
      graphQLErrors: o2,
      response: t2
    }) : void 0,
    extensions: n2 ? s2 : void 0,
    hasNext: null != e3.hasNext ? e3.hasNext : r2.hasNext,
    stale: false
  };
};
var makeErrorResult = (r2, e3, t2) => ({
  operation: r2,
  data: void 0,
  error: new CombinedError({
    networkError: e3,
    response: t2
  }),
  extensions: void 0,
  hasNext: false,
  stale: false
});
function makeFetchBody(r2) {
  return {
    query: r2.extensions && r2.extensions.persistedQuery && !r2.extensions.persistedQuery.miss ? void 0 : stringifyDocument(r2.query),
    operationName: getOperationName(r2.query),
    variables: r2.variables || void 0,
    extensions: r2.extensions
  };
}
var makeFetchURL = (r2, e3) => {
  var t2 = "query" === r2.kind && r2.context.preferGetMethod;
  if (!t2 || !e3) {
    return r2.context.url;
  }
  var a2 = new URL(r2.context.url);
  for (var o2 in e3) {
    var n2 = e3[o2];
    if (n2) {
      a2.searchParams.set(o2, "object" == typeof n2 ? stringifyVariables(n2) : n2);
    }
  }
  var s2 = a2.toString();
  if (s2.length > 2047 && "force" !== t2) {
    r2.context.preferGetMethod = false;
    return r2.context.url;
  }
  return s2;
};
var serializeBody = (r2, e3) => {
  if (e3 && !("query" === r2.kind && !!r2.context.preferGetMethod)) {
    var t2 = stringifyVariables(e3);
    var a2 = ((r3) => {
      var e4 = /* @__PURE__ */ new Map();
      if (v2 !== NoopConstructor || l2 !== NoopConstructor) {
        i2.clear();
        extract(e4, "variables", r3);
      }
      return e4;
    })(e3.variables);
    if (a2.size) {
      var o2 = new FormData();
      o2.append("operations", t2);
      o2.append("map", stringifyVariables(__spreadValues({}, [...a2.keys()].map((r3) => [r3]))));
      var n2 = 0;
      for (var s2 of a2.values()) {
        o2.append("" + n2++, s2);
      }
      return o2;
    }
    return t2;
  }
};
var makeFetchOptions = (r2, e3) => {
  var t2 = {
    accept: "subscription" === r2.kind ? "text/event-stream, multipart/mixed" : "application/graphql-response+json, application/graphql+json, application/json, text/event-stream, multipart/mixed"
  };
  var a2 = ("function" == typeof r2.context.fetchOptions ? r2.context.fetchOptions() : r2.context.fetchOptions) || {};
  if (a2.headers) {
    for (var o2 in a2.headers) {
      t2[o2.toLowerCase()] = a2.headers[o2];
    }
  }
  var n2 = serializeBody(r2, e3);
  if ("string" == typeof n2 && !t2["content-type"]) {
    t2["content-type"] = "application/json";
  }
  return __spreadProps(__spreadValues({}, a2), {
    method: n2 ? "POST" : "GET",
    body: n2,
    headers: t2
  });
};
var y2 = "undefined" != typeof TextDecoder ? new TextDecoder() : null;
var h = /boundary="?([^=";]+)"?/i;
var x = /data: ?([^\n]+)/;
var toString = (r2) => "Buffer" === r2.constructor.name ? r2.toString() : y2.decode(r2);
function streamBody(r2) {
  return __asyncGenerator(this, null, function* () {
    if (r2.body[Symbol.asyncIterator]) {
      try {
        for (var iter = __forAwait(r2.body), more, temp, error2; more = !(temp = yield new __await(iter.next())).done; more = false) {
          var e3 = temp.value;
          yield toString(e3);
        }
      } catch (temp) {
        error2 = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield new __await(temp.call(iter)));
        } finally {
          if (error2)
            throw error2[0];
        }
      }
    } else {
      var t2 = r2.body.getReader();
      var a2;
      try {
        while (!(a2 = yield new __await(t2.read())).done) {
          yield toString(a2.value);
        }
      } finally {
        t2.cancel();
      }
    }
  });
}
function split(r2, e3) {
  return __asyncGenerator(this, null, function* () {
    var t2 = "";
    var a2;
    try {
      for (var iter = __forAwait(r2), more, temp, error2; more = !(temp = yield new __await(iter.next())).done; more = false) {
        var o2 = temp.value;
        t2 += o2;
        while ((a2 = t2.indexOf(e3)) > -1) {
          yield t2.slice(0, a2);
          t2 = t2.slice(a2 + e3.length);
        }
      }
    } catch (temp) {
      error2 = [temp];
    } finally {
      try {
        more && (temp = iter.return) && (yield new __await(temp.call(iter)));
      } finally {
        if (error2)
          throw error2[0];
      }
    }
  });
}
function fetchOperation(r2, e3, t2) {
  return __asyncGenerator(this, null, function* () {
    var a2 = true;
    var o2 = null;
    var n2;
    try {
      yield yield new __await(Promise.resolve());
      var s2 = (n2 = yield new __await((r2.context.fetch || fetch)(e3, t2))).headers.get("Content-Type") || "";
      var i3;
      if (/multipart\/mixed/i.test(s2)) {
        i3 = function parseMultipartMixed(r3, e4) {
          return __asyncGenerator(this, null, function* () {
            var t3 = r3.match(h);
            var a3 = "--" + (t3 ? t3[1] : "-");
            var o3 = true;
            var n3;
            try {
              for (var iter2 = __forAwait(split(streamBody(e4), "\r\n" + a3)), more2, temp2, error3; more2 = !(temp2 = yield new __await(iter2.next())).done; more2 = false) {
                var s3 = temp2.value;
                if (o3) {
                  o3 = false;
                  var i4 = s3.indexOf(a3);
                  if (i4 > -1) {
                    s3 = s3.slice(i4 + a3.length);
                  } else {
                    continue;
                  }
                }
                try {
                  yield n3 = JSON.parse(s3.slice(s3.indexOf("\r\n\r\n") + 4));
                } catch (r4) {
                  if (!n3) {
                    throw r4;
                  }
                }
                if (n3 && false === n3.hasNext) {
                  break;
                }
              }
            } catch (temp2) {
              error3 = [temp2];
            } finally {
              try {
                more2 && (temp2 = iter2.return) && (yield new __await(temp2.call(iter2)));
              } finally {
                if (error3)
                  throw error3[0];
              }
            }
            if (n3 && false !== n3.hasNext) {
              yield {
                hasNext: false
              };
            }
          });
        }(s2, n2);
      } else if (/text\/event-stream/i.test(s2)) {
        i3 = function parseEventStream(r3) {
          return __asyncGenerator(this, null, function* () {
            var e4;
            try {
              for (var iter2 = __forAwait(split(streamBody(r3), "\n\n")), more2, temp2, error3; more2 = !(temp2 = yield new __await(iter2.next())).done; more2 = false) {
                var t3 = temp2.value;
                var a3 = t3.match(x);
                if (a3) {
                  var o3 = a3[1];
                  try {
                    yield e4 = JSON.parse(o3);
                  } catch (r4) {
                    if (!e4) {
                      throw r4;
                    }
                  }
                  if (e4 && false === e4.hasNext) {
                    break;
                  }
                }
              }
            } catch (temp2) {
              error3 = [temp2];
            } finally {
              try {
                more2 && (temp2 = iter2.return) && (yield new __await(temp2.call(iter2)));
              } finally {
                if (error3)
                  throw error3[0];
              }
            }
            if (e4 && false !== e4.hasNext) {
              yield {
                hasNext: false
              };
            }
          });
        }(n2);
      } else if (!/text\//i.test(s2)) {
        i3 = function parseJSON(r3) {
          return __asyncGenerator(this, null, function* () {
            yield JSON.parse(yield new __await(r3.text()));
          });
        }(n2);
      } else {
        i3 = function parseMaybeJSON(r3) {
          return __asyncGenerator(this, null, function* () {
            var e4 = yield new __await(r3.text());
            try {
              var t3 = JSON.parse(e4);
              if (true) {
                console.warn('Found response with content-type "text/plain" but it had a valid "application/json" response.');
              }
              yield t3;
            } catch (r4) {
              throw new Error(e4);
            }
          });
        }(n2);
      }
      var f3;
      try {
        for (var iter = __forAwait(i3), more, temp, error2; more = !(temp = yield new __await(iter.next())).done; more = false) {
          var v3 = temp.value;
          if (v3.pending && !o2) {
            f3 = v3.pending;
          } else if (v3.pending) {
            f3 = [...f3, ...v3.pending];
          }
          o2 = o2 ? mergeResultPatch(o2, v3, n2, f3) : makeResult(r2, v3, n2);
          a2 = false;
          yield o2;
          a2 = true;
        }
      } catch (temp) {
        error2 = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield new __await(temp.call(iter)));
        } finally {
          if (error2)
            throw error2[0];
        }
      }
      if (!o2) {
        yield o2 = makeResult(r2, {}, n2);
      }
    } catch (e4) {
      if (!a2) {
        throw e4;
      }
      yield makeErrorResult(r2, n2 && (n2.status < 200 || n2.status >= 300) && n2.statusText ? new Error(n2.statusText) : e4, n2);
    }
  });
}
function makeFetchSource(r2, e3, t2) {
  var a2;
  if ("undefined" != typeof AbortController) {
    t2.signal = (a2 = new AbortController()).signal;
  }
  return onEnd(() => {
    if (a2) {
      a2.abort();
    }
  })(filter((r3) => !!r3)(fromAsyncIterable(fetchOperation(r2, e3, t2))));
}

// node_modules/@urql/core/dist/urql-core.mjs
var collectTypes = (e3, r2) => {
  if (Array.isArray(e3)) {
    for (var t2 of e3) {
      collectTypes(t2, r2);
    }
  } else if ("object" == typeof e3 && null !== e3) {
    for (var n2 in e3) {
      if ("__typename" === n2 && "string" == typeof e3[n2]) {
        r2.add(e3[n2]);
      } else {
        collectTypes(e3[n2], r2);
      }
    }
  }
  return r2;
};
var formatNode = (r2) => {
  if ("definitions" in r2) {
    var t2 = [];
    for (var n2 of r2.definitions) {
      var a2 = formatNode(n2);
      t2.push(a2);
    }
    return __spreadProps(__spreadValues({}, r2), {
      definitions: t2
    });
  }
  if ("directives" in r2 && r2.directives && r2.directives.length) {
    var o2 = [];
    var i3 = {};
    for (var s2 of r2.directives) {
      var c3 = s2.name.value;
      if ("_" !== c3[0]) {
        o2.push(s2);
      } else {
        c3 = c3.slice(1);
      }
      i3[c3] = s2;
    }
    r2 = __spreadProps(__spreadValues({}, r2), {
      directives: o2,
      _directives: i3
    });
  }
  if ("selectionSet" in r2) {
    var u3 = [];
    var p3 = r2.kind === e.OPERATION_DEFINITION;
    if (r2.selectionSet) {
      for (var d3 of r2.selectionSet.selections || []) {
        p3 = p3 || d3.kind === e.FIELD && "__typename" === d3.name.value && !d3.alias;
        var v3 = formatNode(d3);
        u3.push(v3);
      }
      if (!p3) {
        u3.push({
          kind: e.FIELD,
          name: {
            kind: e.NAME,
            value: "__typename"
          },
          _generated: true
        });
      }
      return __spreadProps(__spreadValues({}, r2), {
        selectionSet: __spreadProps(__spreadValues({}, r2.selectionSet), {
          selections: u3
        })
      });
    }
  }
  return r2;
};
var I = /* @__PURE__ */ new Map();
var formatDocument = (e3) => {
  var t2 = keyDocument(e3);
  var n2 = I.get(t2.__key);
  if (!n2) {
    I.set(t2.__key, n2 = formatNode(t2));
    Object.defineProperty(n2, "__key", {
      value: t2.__key,
      enumerable: false
    });
  }
  return n2;
};
var maskTypename = (e3, r2) => {
  if (!e3 || "object" != typeof e3) {
    return e3;
  } else if (Array.isArray(e3)) {
    return e3.map((e4) => maskTypename(e4));
  } else if (e3 && "object" == typeof e3 && (r2 || "__typename" in e3)) {
    var t2 = {};
    for (var n2 in e3) {
      if ("__typename" === n2) {
        Object.defineProperty(t2, "__typename", {
          enumerable: false,
          value: e3.__typename
        });
      } else {
        t2[n2] = maskTypename(e3[n2]);
      }
    }
    return t2;
  } else {
    return e3;
  }
};
function withPromise(e3) {
  var source$ = (r2) => e3(r2);
  source$.toPromise = () => toPromise(take(1)(filter((e4) => !e4.stale && !e4.hasNext)(source$)));
  source$.then = (e4, r2) => source$.toPromise().then(e4, r2);
  source$.subscribe = (e4) => subscribe(e4)(source$);
  return source$;
}
function makeOperation(e3, r2, t2) {
  return __spreadProps(__spreadValues({}, r2), {
    kind: e3,
    context: r2.context ? __spreadValues(__spreadValues({}, r2.context), t2) : t2 || r2.context
  });
}
var addMetadata = (e3, r2) => makeOperation(e3.kind, e3, {
  meta: __spreadValues(__spreadValues({}, e3.context.meta), r2)
});
var noop = () => {
};
function gql(n2) {
  var a2 = /* @__PURE__ */ new Map();
  var o2 = [];
  var i3 = [];
  var s2 = Array.isArray(n2) ? n2[0] : n2 || "";
  for (var c3 = 1; c3 < arguments.length; c3++) {
    var u3 = arguments[c3];
    if (u3 && u3.definitions) {
      i3.push(u3);
    } else {
      s2 += u3;
    }
    s2 += arguments[0][c3];
  }
  i3.unshift(keyDocument(s2));
  for (var p3 of i3) {
    for (var d3 of p3.definitions) {
      if (d3.kind === e.FRAGMENT_DEFINITION) {
        var v3 = d3.name.value;
        var f3 = stringifyDocument(d3);
        if (!a2.has(v3)) {
          a2.set(v3, f3);
          o2.push(d3);
        } else if (a2.get(v3) !== f3) {
          console.warn("[WARNING: Duplicate Fragment] A fragment with name `" + v3 + "` already exists in this document.\nWhile fragment names may not be unique across your source, each name must be unique per document.");
        }
      } else {
        o2.push(d3);
      }
    }
  }
  return keyDocument({
    kind: e.DOCUMENT,
    definitions: o2
  });
}
var shouldSkip = ({ kind: e3 }) => "mutation" !== e3 && "query" !== e3;
var mapTypeNames = (e3) => {
  var r2 = formatDocument(e3.query);
  if (r2 !== e3.query) {
    var t2 = makeOperation(e3.kind, e3);
    t2.query = r2;
    return t2;
  } else {
    return e3;
  }
};
var cacheExchange = ({ forward: e3, client: r2, dispatchDebug: t2 }) => {
  var a2 = /* @__PURE__ */ new Map();
  var o2 = /* @__PURE__ */ new Map();
  var isOperationCached = (e4) => "query" === e4.kind && "network-only" !== e4.context.requestPolicy && ("cache-only" === e4.context.requestPolicy || a2.has(e4.key));
  return (i3) => {
    var s2 = map((e4) => {
      var o3 = a2.get(e4.key);
      t2(__spreadProps(__spreadValues({
        operation: e4
      }, o3 ? {
        type: "cacheHit",
        message: "The result was successfully retried from the cache"
      } : {
        type: "cacheMiss",
        message: "The result could not be retrieved from the cache"
      }), {
        source: "cacheExchange"
      }));
      var i4 = o3 || makeResult(e4, {
        data: null
      });
      i4 = __spreadProps(__spreadValues({}, i4), {
        operation: true ? addMetadata(e4, {
          cacheOutcome: o3 ? "hit" : "miss"
        }) : e4
      });
      if ("cache-and-network" === e4.context.requestPolicy) {
        i4.stale = true;
        reexecuteOperation(r2, e4);
      }
      return i4;
    })(filter((e4) => !shouldSkip(e4) && isOperationCached(e4))(i3));
    var c3 = onPush((e4) => {
      var { operation: n2 } = e4;
      if (!n2) {
        return;
      }
      var i4 = n2.context.additionalTypenames || [];
      if ("subscription" !== e4.operation.kind) {
        i4 = ((e5) => [...collectTypes(e5, /* @__PURE__ */ new Set())])(e4.data).concat(i4);
      }
      if ("mutation" === e4.operation.kind || "subscription" === e4.operation.kind) {
        var s3 = /* @__PURE__ */ new Set();
        t2({
          type: "cacheInvalidation",
          message: `The following typenames have been invalidated: ${i4}`,
          operation: n2,
          data: {
            typenames: i4,
            response: e4
          },
          source: "cacheExchange"
        });
        for (var c4 = 0; c4 < i4.length; c4++) {
          var u3 = i4[c4];
          var p3 = o2.get(u3);
          if (!p3) {
            o2.set(u3, p3 = /* @__PURE__ */ new Set());
          }
          for (var d3 of p3.values()) {
            s3.add(d3);
          }
          p3.clear();
        }
        for (var v3 of s3.values()) {
          if (a2.has(v3)) {
            n2 = a2.get(v3).operation;
            a2.delete(v3);
            reexecuteOperation(r2, n2);
          }
        }
      } else if ("query" === n2.kind && e4.data) {
        a2.set(n2.key, e4);
        for (var f3 = 0; f3 < i4.length; f3++) {
          var l3 = i4[f3];
          var h2 = o2.get(l3);
          if (!h2) {
            o2.set(l3, h2 = /* @__PURE__ */ new Set());
          }
          h2.add(n2.key);
        }
      }
    })(e3(filter((e4) => "query" !== e4.kind || "cache-only" !== e4.context.requestPolicy)(map((e4) => true ? addMetadata(e4, {
      cacheOutcome: "miss"
    }) : e4)(merge([map(mapTypeNames)(filter((e4) => !shouldSkip(e4) && !isOperationCached(e4))(i3)), filter((e4) => shouldSkip(e4))(i3)])))));
    return merge([s2, c3]);
  };
};
var reexecuteOperation = (e3, r2) => e3.reexecuteOperation(makeOperation(r2.kind, r2, {
  requestPolicy: "network-only"
}));
var T = /* @__PURE__ */ new Set();
var ssrExchange = (e3 = {}) => {
  var r2 = !!e3.staleWhileRevalidate;
  var t2 = !!e3.includeExtensions;
  var n2 = {};
  var o2 = [];
  var invalidate = (e4) => {
    o2.push(e4.operation.key);
    if (1 === o2.length) {
      Promise.resolve().then(() => {
        var e5;
        while (e5 = o2.shift()) {
          n2[e5] = null;
        }
      });
    }
  };
  var ssr = ({ client: o3, forward: i3 }) => (s2) => {
    var c3 = e3 && "boolean" == typeof e3.isClient ? !!e3.isClient : !o3.suspense;
    var u3 = i3(map(mapTypeNames)(filter((e4) => "teardown" === e4.kind || !n2[e4.key] || !!n2[e4.key].hasNext || "network-only" === e4.context.requestPolicy)(s2)));
    var p3 = map((e4) => {
      var i4 = ((e5, r3, t3) => ({
        operation: e5,
        data: r3.data ? JSON.parse(r3.data) : void 0,
        extensions: t3 && r3.extensions ? JSON.parse(r3.extensions) : void 0,
        error: r3.error ? new CombinedError({
          networkError: r3.error.networkError ? new Error(r3.error.networkError) : void 0,
          graphQLErrors: r3.error.graphQLErrors
        }) : void 0,
        stale: false,
        hasNext: !!r3.hasNext
      }))(e4, n2[e4.key], t2);
      if (r2 && !T.has(e4.key)) {
        i4.stale = true;
        T.add(e4.key);
        reexecuteOperation(o3, e4);
      }
      return __spreadProps(__spreadValues({}, i4), {
        operation: true ? addMetadata(e4, {
          cacheOutcome: "hit"
        }) : e4
      });
    })(filter((e4) => "teardown" !== e4.kind && !!n2[e4.key] && "network-only" !== e4.context.requestPolicy)(s2));
    if (!c3) {
      u3 = onPush((e4) => {
        var { operation: r3 } = e4;
        if ("mutation" !== r3.kind) {
          var a2 = ((e5, r4) => {
            var t3 = {
              data: JSON.stringify(e5.data),
              hasNext: e5.hasNext
            };
            if (void 0 !== e5.data) {
              t3.data = JSON.stringify(e5.data);
            }
            if (r4 && void 0 !== e5.extensions) {
              t3.extensions = JSON.stringify(e5.extensions);
            }
            if (e5.error) {
              t3.error = {
                graphQLErrors: e5.error.graphQLErrors.map((e6) => {
                  if (!e6.path && !e6.extensions) {
                    return e6.message;
                  }
                  return {
                    message: e6.message,
                    path: e6.path,
                    extensions: e6.extensions
                  };
                })
              };
              if (e5.error.networkError) {
                t3.error.networkError = "" + e5.error.networkError;
              }
            }
            return t3;
          })(e4, t2);
          n2[r3.key] = a2;
        }
      })(u3);
    } else {
      p3 = onPush(invalidate)(p3);
    }
    return merge([u3, p3]);
  };
  ssr.restoreData = (e4) => {
    for (var r3 in e4) {
      if (null !== n2[r3]) {
        n2[r3] = e4[r3];
      }
    }
  };
  ssr.extractData = () => {
    var e4 = {};
    for (var r3 in n2) {
      if (null != n2[r3]) {
        e4[r3] = n2[r3];
      }
    }
    return e4;
  };
  if (e3 && e3.initialState) {
    ssr.restoreData(e3.initialState);
  }
  return ssr;
};
var subscriptionExchange = ({ forwardSubscription: e3, enableAllOperations: r2, isSubscriptionOperation: t2 }) => ({ client: a2, forward: i3 }) => {
  var u3 = t2 || ((e4) => "subscription" === e4.kind || !!r2 && ("query" === e4.kind || "mutation" === e4.kind));
  return (r3) => {
    var t3 = mergeMap((t4) => {
      var { key: i4 } = t4;
      var u4 = filter((e4) => "teardown" === e4.kind && e4.key === i4)(r3);
      return takeUntil(u4)(((r4) => {
        var t5 = e3(makeFetchBody(r4), r4);
        return make((e4) => {
          var o2 = false;
          var i5;
          var u5;
          function nextResult(t6) {
            e4.next(u5 = u5 ? mergeResultPatch(u5, t6) : makeResult(r4, t6));
          }
          Promise.resolve().then(() => {
            if (o2) {
              return;
            }
            i5 = t5.subscribe({
              next: nextResult,
              error(t6) {
                if (Array.isArray(t6)) {
                  nextResult({
                    errors: t6
                  });
                } else {
                  e4.next(makeErrorResult(r4, t6));
                }
                e4.complete();
              },
              complete() {
                if (!o2) {
                  o2 = true;
                  if ("subscription" === r4.kind) {
                    a2.reexecuteOperation(makeOperation("teardown", r4, r4.context));
                  }
                  if (u5 && u5.hasNext) {
                    nextResult({
                      hasNext: false
                    });
                  }
                  e4.complete();
                }
              }
            });
          });
          return () => {
            o2 = true;
            if (i5) {
              i5.unsubscribe();
            }
          };
        });
      })(t4));
    })(filter((e4) => "teardown" !== e4.kind && u3(e4))(r3));
    var p3 = i3(filter((e4) => "teardown" === e4.kind || !u3(e4))(r3));
    return merge([t3, p3]);
  };
};
var debugExchange = ({ forward: e3 }) => {
  if (false) {
    return (r2) => e3(r2);
  } else {
    return (r2) => onPush((e4) => console.log("[Exchange debug]: Completed operation: ", e4))(e3(onPush((e4) => console.log("[Exchange debug]: Incoming operation: ", e4))(r2)));
  }
};
var dedupExchange = ({ forward: e3 }) => (r2) => e3(r2);
var fetchExchange = ({ forward: e3, dispatchDebug: r2 }) => (t2) => {
  var n2 = mergeMap((e4) => {
    var n3 = makeFetchBody(e4);
    var a3 = makeFetchURL(e4, n3);
    var i3 = makeFetchOptions(e4, n3);
    r2({
      type: "fetchRequest",
      message: "A fetch request is being executed.",
      operation: e4,
      data: {
        url: a3,
        fetchOptions: i3
      },
      source: "fetchExchange"
    });
    var s2 = takeUntil(filter((r3) => "teardown" === r3.kind && r3.key === e4.key)(t2))(makeFetchSource(e4, a3, i3));
    if (true) {
      return onPush((t3) => {
        var n4 = !t3.data ? t3.error : void 0;
        r2({
          type: n4 ? "fetchError" : "fetchSuccess",
          message: `A ${n4 ? "failed" : "successful"} fetch response has been returned.`,
          operation: e4,
          data: {
            url: a3,
            fetchOptions: i3,
            value: n4 || t3
          },
          source: "fetchExchange"
        });
      })(s2);
    }
    return s2;
  })(filter((e4) => "teardown" !== e4.kind && ("subscription" !== e4.kind || !!e4.context.fetchSubscriptions))(t2));
  var a2 = e3(filter((e4) => "teardown" === e4.kind || "subscription" === e4.kind && !e4.context.fetchSubscriptions)(t2));
  return merge([n2, a2]);
};
var composeExchanges = (e3) => ({ client: r2, forward: t2, dispatchDebug: n2 }) => e3.reduceRight((e4, t3) => {
  var a2 = false;
  return t3({
    client: r2,
    forward(r3) {
      if (true) {
        if (a2) {
          throw new Error("forward() must only be called once in each Exchange.");
        }
        a2 = true;
      }
      return share(e4(share(r3)));
    },
    dispatchDebug(e5) {
      n2(__spreadValues({
        timestamp: Date.now(),
        source: t3.name
      }, e5));
    }
  });
}, t2);
var mapExchange = ({ onOperation: e3, onResult: r2, onError: t2 }) => ({ forward: n2 }) => (a2) => mergeMap((e4) => {
  if (t2 && e4.error) {
    t2(e4.error, e4.operation);
  }
  var n3 = r2 && r2(e4) || e4;
  return "then" in n3 ? fromPromise(n3) : fromValue(n3);
})(n2(mergeMap((r3) => {
  var t3 = e3 && e3(r3) || r3;
  return "then" in t3 ? fromPromise(t3) : fromValue(t3);
})(a2)));
var fallbackExchange = ({ dispatchDebug: e3 }) => (r2) => {
  if (true) {
    r2 = onPush((r3) => {
      if ("teardown" !== r3.kind && true) {
        var t2 = `No exchange has handled operations of kind "${r3.kind}". Check whether you've added an exchange responsible for these operations.`;
        e3({
          type: "fallbackCatch",
          message: t2,
          operation: r3,
          source: "fallbackExchange"
        });
        console.warn(t2);
      }
    })(r2);
  }
  return filter((e4) => false)(r2);
};
var C = function Client(e3) {
  if (!e3.url) {
    throw new Error("You are creating an urql-client without a url.");
  }
  var r2 = 0;
  var t2 = /* @__PURE__ */ new Map();
  var n2 = /* @__PURE__ */ new Map();
  var a2 = /* @__PURE__ */ new Set();
  var o2 = [];
  var i3 = {
    url: e3.url,
    fetchSubscriptions: e3.fetchSubscriptions,
    fetchOptions: e3.fetchOptions,
    fetch: e3.fetch,
    preferGetMethod: e3.preferGetMethod,
    requestPolicy: e3.requestPolicy || "cache-first"
  };
  var s2 = makeSubject();
  function nextOperation(e4) {
    if ("mutation" === e4.kind || "teardown" === e4.kind || !a2.has(e4.key)) {
      if ("teardown" === e4.kind) {
        a2.delete(e4.key);
      } else if ("mutation" !== e4.kind) {
        a2.add(e4.key);
      }
      s2.next(e4);
    }
  }
  var c3 = false;
  function dispatchOperation(e4) {
    if (e4) {
      nextOperation(e4);
    }
    if (!c3) {
      c3 = true;
      while (c3 && (e4 = o2.shift())) {
        nextOperation(e4);
      }
      c3 = false;
    }
  }
  var makeResultSource = (r3) => {
    var i4 = takeUntil(filter((e4) => "teardown" === e4.kind && e4.key === r3.key)(s2.source))(filter((e4) => e4.operation.kind === r3.kind && e4.operation.key === r3.key && (!e4.operation.context._instance || e4.operation.context._instance === r3.context._instance))(O));
    if (e3.maskTypename) {
      i4 = map((e4) => __spreadProps(__spreadValues({}, e4), {
        data: maskTypename(e4.data, true)
      }))(i4);
    }
    if ("query" !== r3.kind) {
      i4 = takeWhile((e4) => !!e4.hasNext, true)(i4);
    } else {
      i4 = switchMap((e4) => {
        var t3 = fromValue(e4);
        return e4.stale || e4.hasNext ? t3 : merge([t3, map(() => {
          e4.stale = true;
          return e4;
        })(take(1)(filter((e5) => e5.key === r3.key)(s2.source)))]);
      })(i4);
    }
    if ("mutation" !== r3.kind) {
      i4 = onEnd(() => {
        a2.delete(r3.key);
        t2.delete(r3.key);
        n2.delete(r3.key);
        c3 = false;
        for (var e4 = o2.length - 1; e4 >= 0; e4--) {
          if (o2[e4].key === r3.key) {
            o2.splice(e4, 1);
          }
        }
        nextOperation(makeOperation("teardown", r3, r3.context));
      })(onPush((e4) => {
        if (e4.stale) {
          for (var n3 of o2) {
            if (n3.key === e4.operation.key) {
              a2.delete(n3.key);
              break;
            }
          }
        } else if (!e4.hasNext) {
          a2.delete(r3.key);
        }
        t2.set(r3.key, e4);
      })(i4));
    } else {
      i4 = onStart(() => {
        nextOperation(r3);
      })(i4);
    }
    return share(i4);
  };
  var u3 = this instanceof Client ? this : Object.create(Client.prototype);
  var p3 = Object.assign(u3, {
    suspense: !!e3.suspense,
    operations$: s2.source,
    reexecuteOperation(e4) {
      if ("teardown" === e4.kind) {
        dispatchOperation(e4);
      } else if ("mutation" === e4.kind || n2.has(e4.key)) {
        var r3 = false;
        for (var t3 = 0; t3 < o2.length; t3++) {
          r3 = r3 || o2[t3].key === e4.key;
        }
        if (!r3) {
          a2.delete(e4.key);
        }
        o2.push(e4);
        Promise.resolve().then(dispatchOperation);
      }
    },
    createRequestOperation(e4, t3, n3) {
      if (!n3) {
        n3 = {};
      }
      var a3;
      if ("teardown" !== e4 && (a3 = getOperationType(t3.query)) !== e4) {
        throw new Error(`Expected operation of type "${e4}" but found "${a3}"`);
      }
      return makeOperation(e4, t3, __spreadProps(__spreadValues(__spreadValues({
        _instance: "mutation" === e4 ? r2 = r2 + 1 | 0 : void 0
      }, i3), n3), {
        requestPolicy: n3.requestPolicy || i3.requestPolicy,
        suspense: n3.suspense || false !== n3.suspense && p3.suspense
      }));
    },
    executeRequestOperation(e4) {
      if ("mutation" === e4.kind) {
        return withPromise(makeResultSource(e4));
      }
      return withPromise(lazy(() => {
        var r3 = n2.get(e4.key);
        if (!r3) {
          n2.set(e4.key, r3 = makeResultSource(e4));
        }
        r3 = onStart(() => {
          dispatchOperation(e4);
        })(r3);
        var a3 = t2.get(e4.key);
        if ("query" === e4.kind && a3 && (a3.stale || a3.hasNext)) {
          return switchMap(fromValue)(merge([r3, filter((r4) => r4 === t2.get(e4.key))(fromValue(a3))]));
        } else {
          return r3;
        }
      }));
    },
    executeQuery(e4, r3) {
      var t3 = p3.createRequestOperation("query", e4, r3);
      return p3.executeRequestOperation(t3);
    },
    executeSubscription(e4, r3) {
      var t3 = p3.createRequestOperation("subscription", e4, r3);
      return p3.executeRequestOperation(t3);
    },
    executeMutation(e4, r3) {
      var t3 = p3.createRequestOperation("mutation", e4, r3);
      return p3.executeRequestOperation(t3);
    },
    readQuery(e4, r3, t3) {
      var n3 = null;
      subscribe((e5) => {
        n3 = e5;
      })(p3.query(e4, r3, t3)).unsubscribe();
      return n3;
    },
    query: (e4, r3, t3) => p3.executeQuery(createRequest(e4, r3), t3),
    subscription: (e4, r3, t3) => p3.executeSubscription(createRequest(e4, r3), t3),
    mutation: (e4, r3, t3) => p3.executeMutation(createRequest(e4, r3), t3)
  });
  var d3 = noop;
  if (true) {
    var { next: l3, source: x2 } = makeSubject();
    p3.subscribeToDebugTarget = (e4) => subscribe(e4)(x2);
    d3 = l3;
  }
  var g2 = composeExchanges(e3.exchanges);
  var O = share(g2({
    client: p3,
    dispatchDebug: d3,
    forward: fallbackExchange({
      dispatchDebug: d3
    })
  })(s2.source));
  publish(O);
  return p3;
};
var j = C;
export {
  C as Client,
  CombinedError,
  cacheExchange,
  composeExchanges,
  j as createClient,
  createRequest,
  debugExchange,
  dedupExchange,
  mapExchange as errorExchange,
  fetchExchange,
  formatDocument,
  gql,
  makeErrorResult,
  makeOperation,
  makeResult,
  mapExchange,
  maskTypename,
  mergeResultPatch,
  ssrExchange,
  stringifyDocument,
  stringifyVariables,
  subscriptionExchange
};
//# sourceMappingURL=@urql_core.js.map
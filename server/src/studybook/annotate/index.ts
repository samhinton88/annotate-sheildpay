import { parse } from "@babel/parser";
import babelTraverse, { NodePath, Visitor } from "@babel/traverse";
import babelGenerate from "@babel/generator";
import * as t from "@babel/types"
import { CommentLine, File, Statement, BlockStatement, Identifier, Expression } from "@babel/types";

export interface IParseResult {
  ast: File;
  source: string;
}

export type IParser = (code: string) => IParseResult

export const parser: IParser = (code) => ({ ast: parse(code), source: code });

export type ITraverse = (data: IParseResult, visitor: any) => File;

export const traverse: ITraverse = ({ ast, source }, visitor) => {
  const { comments = [] } = ast;
  const commentMapping = comments!
    .filter(({ type }) => type === "CommentLine")
    .map((comment) => [comment.loc.start.line, comment]) as INumberCommentLineTuple[];

  const lineCommentMap = toCommentMapping(commentMapping);

  babelTraverse(ast as any, visitor({ commentMapping: lineCommentMap, source }));

  return ast;
};
export interface ILineCommentMap {
  [key: number]: CommentLine;
}
export type INumberCommentLineTuple = [number, CommentLine];
export type IToCommentMapping = (array: INumberCommentLineTuple[]) => ILineCommentMap;
export const toCommentMapping: IToCommentMapping = (array) => array
  .reduce((
    acc: any, item: INumberCommentLineTuple
  ) => ({ ...acc, [item[0]]: item[1] }), {});

export const generate = (ast: File) => {
  return babelGenerate(ast as any).code;
};

const numericKeyVal = (key: string, value: number) =>
  t.objectProperty(
    t.identifier(key),
    t.numericLiteral(value)
  )

const stringKeyVal = (key: string, value: string) => t.objectProperty(
  t.identifier(key),
  t.stringLiteral(value)
)

const curriedVar = (name: string, config?: any) => {

  if (!config) {
    return t.memberExpression(
      t.callExpression(
        t.identifier("scope"),
        []
      ),
      t.identifier(name),
    )
  }

  const { start, end } = config;

  return t.memberExpression(
    t.callExpression(
      t.identifier("scope"),
      [
        t.objectExpression([
          t.objectProperty(
            t.identifier('loc'),
            t.objectExpression(
              [
                t.objectProperty(
                  t.identifier('start'), t.objectExpression([
                    numericKeyVal('line', start.line),
                    numericKeyVal('column', start.column)
                ])),
                t.objectProperty(
                  t.identifier('end'), t.objectExpression([
                    numericKeyVal('line', end.line),
                    numericKeyVal('column', end.column)
                ]))
              ]
            )
          ),
          stringKeyVal('type', config.type)
        ])
      ]
    ),
    t.identifier(name),
  )
}

const scopedVar = (config?: any) => (name: string) =>
  curriedVar(name, config);

const scopedAssignment = (config?: any) => (name: string, assignedExpression?: Expression | null) => {
  return t.assignmentExpression(
    "=",
    curriedVar(name, config),
    assignedExpression || t.identifier("undefined")
  );
};

const pushScope = (name: string) =>
  t.callExpression(
    t.memberExpression(scopedVar()("_depth"), t.identifier("push")),
    [t.stringLiteral(name)]
  );

const popDepth = () =>
  t.callExpression(
    t.memberExpression(scopedVar()("_depth"), t.identifier("pop")),
    []
  );

const callAnnotationMethod = (name: string, ...args: Expression[]) =>
  t.callExpression(scopedVar()(name), args);

const protectedNames = ["undefined", "Infinity"];

export type IAnnotationVisitorBuilder = (context: {
  commentMapping: ILineCommentMap
}) => IAnnotationVisitor;

export type IAnnotationVisitor = Visitor;

const annotationVisitor: IAnnotationVisitorBuilder = ({ commentMapping }) => ({
  IfStatement(path) {
    const { loc, consequent, alternate } = path.node;

    if (commentMapping[loc!.start.line + 1]) {
      const message = commentMapping[loc!.start.line + 1].value;
      (consequent as BlockStatement).body.unshift(
        callAnnotationMethod("_say", t.stringLiteral(message)) as unknown as Statement
      );
    }

    if (alternate && alternate.type !== 'IfStatement') {
      const message = commentMapping[alternate.loc!.start.line + 1].value;
      (alternate as BlockStatement).body.unshift(
        callAnnotationMethod("_say", t.stringLiteral(message)) as unknown as Statement
      );
    }
  },
  ForStatement(path) {
    const line = path.node.loc!.start.line;

    const message = commentMapping[line - 1]
      ? commentMapping[line - 1].value
      : "line: " + line;

    path.insertBefore(pushScope("for loop " + message) as any);
    path.insertAfter(popDepth() as any);
  },
  WhileStatement(path) {
    const line = path.node.loc!.start.line;

    const message = commentMapping[line - 1]
      ? commentMapping[line - 1].value
      : "line: " + line + " ";

    path.insertBefore(pushScope("while loop " + message + " ") as any);
    path.insertAfter(popDepth() as any);
  },
  Identifier(path) {
    const { name, loc, type } = path.node;

    if (
      !loc // Objects added by annotate will not have a location
    ) {
      return;
    }
    const { start, end } = loc;

    if (protectedNames.includes(name)) return;
    const parentMemberExpression = path.findParent((p) =>
      p.isMemberExpression()
    ) as NodePath<t.MemberExpression> | null;

    const parentArrowFunction = path.findParent((p) =>
      p.isArrowFunctionExpression()
    ) as NodePath<t.ArrowFunctionExpression> | null;

    if (parentArrowFunction && parentArrowFunction.node.params.length > 0) {
      const { params } = parentArrowFunction.node;
      const paramsStart = params[0].start;
      const paramsEnd = params[params.length - 1].end;

      if (paramsStart! <= path.node.start! && path.node.start! <= paramsEnd!) {
        // Identifier is in the parameters of function.
        (parentArrowFunction.node.body as BlockStatement).body.unshift(
          scopedAssignment({ start, end, type })(name, t.identifier(name)) as unknown as Statement
        );

        return;
      }
    }

    if (parentMemberExpression) {
      const { node: { object } } = parentMemberExpression;
      if (["length"].includes(path.node.name)) {

        return;
      }
    }

    path.replaceWith(scopedVar({ start, end, type })(name) as any);
  },
  VariableDeclaration(path) {
    const { declarations } = path.node;

    const replacements = [];

    for (const declaration of declarations) {
      const {

        init: assignedExpression,

        type,
        loc: { start, end }

      } = declaration;
      const name = (declaration.id as Identifier).name;



      replacements.push(scopedAssignment({ start, end, type })(name, assignedExpression));
    }

    path.replaceWithMultiple(replacements as any);
  },
});

export const annotate = ({ code }: { code: string }) => {
  return generate(traverse(parser(code), annotationVisitor))
};

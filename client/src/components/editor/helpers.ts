export const convertSelection = (sel: any) => {
  const { start, end } = sel;

  return  [
        { ch: start.column, line: start.line - 1  },
        { ch: end.column, line: end.line - 1 },
    ]
}
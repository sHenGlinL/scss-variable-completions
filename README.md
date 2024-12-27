# scss-variable-completions README

输入 `#颜色值` 或 `$变量` 时，提示对应的 scss 变量
输入 `#颜色值` 或 `var()` 时，提示对应的 css 变量

## Extension Settings

monorepo项目需要填入monorepo项目的根目录字段，不是monorepo不用填
- `scss-variable-completions.variableScssPaths`: 配置 scss 文件路径。如: [
  {
  "monorepo": "",
  "path": "relative/path/to/file.scss"
  }
  ]
- `scss-variable-completions.variableCssPaths`: 配置 css 文件路径。如: [
  {
  "monorepo": "",
  "path": "relative/path/to/file.css"
  }
  ]
- `scss-variable-completions.variableCssTheme`: 配置 css 文件中需要提示的主题。如: [
  {
  "monorepo": "",
  "theme": "dark"
  }
  ]

## CSS 变量文件主题定义规范

- [data-theme='yourTheme'] { ... }

```css
// example
- [data-theme="Dark"] {
  ...;
}
- [data-theme="Light"] {
  ...;
}
```

## Use

![alt text](example.png)

or

![alt text](example-1.png)

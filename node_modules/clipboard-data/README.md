# clipboard-data - 一个处理剪切板数据的node插件

[![Build Status](https://travis-ci.org/kotcmm/clipboard-data.svg?branch=master)](https://travis-ci.org/kotcmm/clipboard-data)
[![Build status](https://ci.appveyor.com/api/projects/status/ynisl47pglhv6euf?svg=true)](https://ci.appveyor.com/project/kotcmm/clipboard-data)

## 安装

```sh
npm install clipboard-data
```

## 使用

```javascript
const clip = require('clipboard-data')
```

### clip.getImage()

获取剪切板的图片数据，目前只支持`png`

### clip.setText("111")

设置文字到剪切板

### clip.getText()

从剪切板获取文字
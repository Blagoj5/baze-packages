# xss-advanced

Node.js Connect middleware to sanitize user input coming from POST body, GET queries, and url params. Works with **Express**.

**About middleware**:

- Built on top of [xss library](https://www.npmjs.com/package/xss)
- Upgraded version of [xss-clean middleware](https://www.npmjs.com/package/xss-clean) (you can add additional filtering options)

**Content**:

- [Install](https://github.com/Blagoj5/baze-packages/tree/main/xss-advanced#user-content-install)
- [How to use](https://github.com/Blagoj5/baze-packages/tree/main/xss-advanced#user-content-how-to-use)
- [Available options](https://github.com/Blagoj5/baze-packages/tree/main/xss-advanced#user-content-available-options)
- [Examples](https://github.com/Blagoj5/baze-packages/tree/main/xss-advanced#user-content-additional-examples)

## Install

```
npm install xss-advanced@latest
```

## How to use

**Important note:** You must use express.json() or body-parser middleware (in order to parse **req.body**) before adding xss-clean-advanced middleware

```
const xssAdvanced = require('xss-advanced')

const app = express();

<!-- First you add body parser middleware -->
app.use(express.json());

<!-- Then you add the middleware itself -->
app.use(xssAdvanced());
```

## Available options

Since this middleware is built on top of [xss](https://www.npmjs.com/package/xss), as a argument it acceps any options available by the xss library.

| Argument    | Default value                                                                                                                                                                       | Available value                                                       |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| xssOptions  | { **css**: false, **stripIgnoreTagBody**: ['script'] }                                                                                                                              | [CHECK ALL AVAILABLE OPTIONS HERE](https://www.npmjs.com/package/xss) |
| Explanation | For **default options**: anywhere in the body, params or query, if there's \<script> tag it will be **REMOVED**, however if element has css style property it will be **PERSISTED** |
| Examples    | \<script>test\</script>test2 **--->** test2;                                                                                                                                        |
|             | \<a href="test">da\</a> **--->** \<a href>da\</a>                                                                                                                                   |

<br />

```
<!-- Example with using custom option, instead of default-->
const options = var options = {
  whiteList: {
    a: ["href", "title", "target"]
  }
};

app.use(xssAdvanced(options));
```

If the example above returned **\<a href="test">da\</a> **--->** \<a href>da\</a>**, this will return the full value:

- **\<a href="test">da\</a> **--->** \<a href="test">da\</a>**

**THE DATA WILL BE FILTERED/XSS SANITIZED DEPENDING ON WHAT YOU PASS AS OPTIONS**

#### **REMINDER:**

By default all \<script> tags are **REMOVED**, css styles are **INCLUDED** (of course you can exclude it with additional options), additional parametars like href, target, title that point to **external links** are also **REMOVED**

## Additional examples

This examples are shown with the provided **default options**

- Example: GET http://localhost:5005?test=\<script>baze\</script>test  
  Initial value: In req.query you get {test: "\<script>baze\</script>test"}  
  Result: **xss-advanced middleware sanitizes it to {test: "d"}**
- Example: POST http://localhost:5005 with application/json body {"test": "\<script>baze\</script>d"  
  Initial value: In req.body you get {test: "\<script>baze\</script>test"}  
  Result: **xss-advanced middleware sanitizes it to {test: "d"}**

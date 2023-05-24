# Beautiful

A interactive programming language for the mobile device easy typing.
It is a programming language that is easy to type on a mobile device.

## Syntax Introduction

The syntax is basically the same as the HTML syntax, just the declaration of syntax is all using the dot(.)

```beau
.div
    .input type...text... input.
div.
```

The above example is equivalent to the following HTML code
```html
<div>
    <input type="text" />
</div>
```

## Grammer
1. tag
```
.div div.
```

2. attribute
<br>The attribute can be a variable, a string, a javascript function, or a number/math formula.
<br>
<br>- string literal: <code>... any form of string ...</code>
<br>- variable: .. <code>test</code>
<br>- number/formula: .. <code>1 + 2</code>
<br>- javascript function: .. <code>() => console.log('hello world')</code>
<br>
```
.div 
    id...div1...
    class...bold...
    onClick..() => console.log('input');
    value..1 + 2
div.
```

Which is equivalent to the following HTML code
```html
<div id="div1" class="bold" onClick="() => console.log('input')" value="3"></div>
```

3. chilren
<br>The children can another tag or a string.

```
.div
    .div
        .input type...text... input.
    div.
    .div
        .input type...text... input.
    div.
div.
```

Which is equivalent to the following HTML code
```html
<div>
    <div>
        <input type="text" />
    </div>
    <div>
        <input type="text" />
    </div>
</div>
```
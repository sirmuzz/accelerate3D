
/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}
body {
  line-height: 1;
}
ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
body {
 background-color: aliceblue;
}

.header {
  height: 80px;
  background-color: dimgrey;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-shim {
  height: 100px;
}

.main {
  background-color: aliceblue;
}

.canvas-container {
  width: 960px;
  height: 640px;
  margin-right: auto;
  margin-left: auto;
  position: relative;
}

.path-canvas {
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
}

#layer-codes-container {
  width: 308px;
  height: 638px;
  border: black solid 1px;
  position: absolute;
  top: 0;
  right: 0;
  overflow: scroll;
}

#layer-codes {

}

.layer-code {
  height: 10px;
  width: auto;
  font-family: Helvetica, "Arial Narrow";
  font-size: 8px;
  margin: 2px;
  padding-top: 2px;
  background-color: white;
  cursor: pointer;
}

.layer-code:hover {
  background-color: aquamarine;
}

.layer-code-selected {
  background-color: plum;
}

.io-container {
  width: 960px;
  height: 400px;
  position: relative;
  margin-top: 20px;
  margin-right: auto;
  margin-left: auto;
}

.input-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 470px;
  height: 400px;
}

.output-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  width: 470px;
  height: 400px;
}

.input {
  width: 464px;
  height: 394px;
}

.output {
  width: 464px;
  height: 394px;
}

.buttons {
  margin-top: 20px;
  height: 40px;
  width: 960px;
  margin-right: auto;
  margin-left: auto;
}

.button {
  text-align: center;
  padding-top: 6px;
  padding-left: 6px;
  padding-right: 6px;
  border: solid 1px black;
  height: 20px;
  font-family: Helvetica, "Arial Narrow";
  cursor: pointer;
  display: inline-block;
}

.label {
  text-align: center;
  padding-top: 6px;
  padding-left: 6px;
  padding-right: 6px;
  height: 22px;
  font-family: Helvetica, "Arial Narrow";
  cursor: pointer;
  display: inline-block;
}

input {
  font-family: Helvetica, "Arial Narrow";
  padding-top: 5px;
  height: 20px;
  width: 60px;
  display: inline-block;
}

input#circles {
  width: 15px;
}

.button:hover {
  background-color: aquamarine;
}

.footer {
  height: 300px;
}
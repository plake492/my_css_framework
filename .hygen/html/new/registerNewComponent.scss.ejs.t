---
inject: true
to: ./src/scss/index.scss
after: ----------new component---------
---

@import './components/<%=name%>';<% -%>

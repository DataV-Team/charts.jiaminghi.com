# 仪表盘

## 基本仪表盘

<demo :option="gauge1" />

<fold-box>
<<< @/docs/example/exampleData/gauge/gauge1.js
</fold-box>

## 详情仪表盘

<demo :option="gauge2" />

<fold-box>
<<< @/docs/example/exampleData/gauge/gauge2.js
</fold-box>

## 渐变仪表盘

<demo :option="gauge3" />

<fold-box>
<<< @/docs/example/exampleData/gauge/gauge3.js
</fold-box>

## 多组仪表盘

<demo :option="gauge4" />

<fold-box>
<<< @/docs/example/exampleData/gauge/gauge4.js
</fold-box>

<script>
import gauge1 from './exampleData/gauge/gauge1.js'
import gauge2 from './exampleData/gauge/gauge2.js'
import gauge3 from './exampleData/gauge/gauge3.js'
import gauge4 from './exampleData/gauge/gauge4.js'

export default {
  data () {
    return {
      gauge1,
      gauge2,
      gauge3,
      gauge4
    }
  }
}
</script>
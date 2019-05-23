# 折线图

## 基本折线图

<demo :option="line1" />

<fold-box>
<<< @/docs/example/exampleData/line/line1.js
</fold-box>

## 光滑折线图

<demo :option="line2" />

<fold-box>
<<< @/docs/example/exampleData/line/line2.js
</fold-box>

## 虚线折线图

<demo :option="line3" />

<fold-box>
<<< @/docs/example/exampleData/line/line3.js
</fold-box>

## 填充折线图

<demo :option="line4" />

<fold-box>
<<< @/docs/example/exampleData/line/line4.js
</fold-box>

## 渐变填充折线图

<demo :option="line5" />

<fold-box>
<<< @/docs/example/exampleData/line/line5.js
</fold-box>

<script>
import line1 from './exampleData/line/line1.js'
import line2 from './exampleData/line/line2.js'
import line3 from './exampleData/line/line3.js'
import line4 from './exampleData/line/line4.js'
import line5 from './exampleData/line/line5.js'

export default {
  data () {
    return {
      line1,
      line2,
      line3,
      line4,
      line5
    }
  }
}
</script>
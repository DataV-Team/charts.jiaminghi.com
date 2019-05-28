# 实例

这里将提供一些具体的实例，在构建图表前，应确保图表容器节点已在页面中完成渲染，否则这可能导致一些异常。

## 极简柱状图

<demo :option="example1" />

<fold-box>
<<< @/docs/example/exampleData/example/example1.js
</fold-box>

## 多系列柱状图

<demo :option="example2" />

<fold-box>
<<< @/docs/example/exampleData/example/example2.js
</fold-box>

## 线柱混用

<demo :option="example3" :debug="true" />

<fold-box>
<<< @/docs/example/exampleData/example/example3.js
</fold-box>

<script>
import example1 from './exampleData/example/example1.js'
import example2 from './exampleData/example/example2.js'
import example3 from './exampleData/example/example3.js'

export default{
    data () {
        return {
            example1,
            example2,
            example3
        }
    }
}
</script>
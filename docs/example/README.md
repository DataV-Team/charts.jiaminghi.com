# 实例

这里将提供一些具体的实例，在构建图表前，应确保图表容器节点已在页面中完成渲染，否则这可能导致异常。

::: tip TIP
点击示例可以切换图表数据，以便于观察动画效果。
:::

## 实例化

```js
import Charts from '@jiaminghi/charts'

const container = document.getElementById('container')

const myChart = new Charts(container)
```

## 实例方法

目前仅有两个实例方法，分别用于设置图表配置和重置图表大小。

### setOption

```js
/**
 * @description 设置图表配置
 * @param {Object} option 图表配置
 * @return {Undefined} 无返回值
 */
Charts.prototype.setOption = function (option) {
  //...
}
```

### resize

```js
/**
 * @description 重置图表大小
 * @return {Undefined} 无返回值
 */
Charts.prototype.resize = function () {
  //...
}
```

<script>

export default{
  data () {
    return {
    }
  }
}
</script>
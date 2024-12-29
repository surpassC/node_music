<template>
  <div>
    <h2>流派可视化</h2>
    <div ref="visualization" style="width: 100%; height: 400px"></div>
    <el-button type="primary" @click="startVisualization">开始可视化</el-button>
  </div>
</template>

<script>
  import * as d3 from 'd3'

  export default {
    methods: {
      startVisualization() {
        // 这里可以添加音频文件的可视化逻辑
        const svg = d3.select(this.$refs.visualization).append('svg').attr('width', '100%').attr('height', '100%')

        // 示例：绘制一个简单的圆形
        svg.append('circle').attr('cx', 100).attr('cy', 100).attr('r', 50).style('fill', 'blue')
      }
    }
  }
</script>

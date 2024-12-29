<template>
  <div class="map-container">
    <div class="map-title">
      <h2>Composer Nationalities Map</h2>
    <!-- 添加标题 -->
    <p>这个地球仪展示了世界各国作曲家的数量。你可以通过拖动地球仪来查看不同国家的数据。</p>
    </div>
    <!-- 添加描述 -->
    <div ref="globeContainer"></div>
    <div id="map-tooltip" class="tooltip" style="opacity: 0"></div>
    <!-- 添加 tooltip -->
  </div>
</template>
<script>
  import {ref, onMounted} from 'vue'
  import * as d3 from 'd3'
  import {feature} from 'topojson-client'
  import axios from '../utils/axios' // 引入 Axios
  import {ElMessage} from 'element-plus' // 引入 Element Plus 消息提示

  export default {
    name: 'InteractiveGlobe',
    setup() {
      const composerData = ref({}) // 存储作曲家数量的对象
      const globeContainer = ref(null)

      const fetchComposerAnalysis = async () => {
        try {
          const response = await axios.get('/dataShow/musicnet') // 请求作曲家分析数据
          const data = response // 假设返回的数据是一个数组

          // 更新 composerData 的结构
          composerData.value = data.reduce((acc, item) => {
            acc[item.country] = item.count // 将国家和数量存储到 composerData
            return acc
          }, {})
        } catch (error) {
          console.error(error)
          ElMessage.error('获取作曲家分析数据失败') // 显示错误消息
        }
      }

      onMounted(() => {
        fetchComposerAnalysis()
        const width = 800
        const height = 600
        const sensitivity = 75

        const projection = d3
          .geoOrthographic()
          .scale(250)
          .center([0, 0])
          .rotate([0, -30])
          .translate([width / 2, height / 2])

        const path = d3.geoPath().projection(projection)
        const svg = d3.select(globeContainer.value).append('svg').attr('width', width).attr('height', height)

        const globe = svg
          .append('circle')
          .attr('fill', '#EEE')
          .attr('stroke', '#000')
          .attr('stroke-width', '0.2')
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .attr('r', projection.scale())

        const map = svg.append('g')
        const mapData = []
        // Load world map data
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data) => {
          const countryData = feature(data, data.objects.countries).features

          map
            .selectAll('path')
            .data(countryData)
            .enter()
            .append('path')
            .attr('d', path)
            .style('fill', (d) => {
              const count = composerData.value[d.properties.name] || 0
              mapData.push(d.properties.name)
              return getColor(count)
            })
            .style('stroke', '#333')
            .style('stroke-width', 0.3)
            .on('mouseover', (event, d) => {
              d3.select(event.target).style('fill', 'yellow')
              showTooltip(event, d) // 显示 tooltip
            })
            .on('mouseout', (event, d) => {
              d3.select(event.target).style('fill', getColor(composerData.value[d.properties.name] || 0))
              hideTooltip()
            })

          // 添加图例
          addLegend(svg)
          console.log(mapData)

          enableRotation()
        })

        function enableRotation() {
          svg.call(
            d3.drag().on('drag', (event) => {
              const rotate = projection.rotate()
              const k = sensitivity / projection.scale()
              projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k])
              path.projection(projection)
              svg.selectAll('path').attr('d', path)
            })
          )
        }

        function getColor(value) {
          const color = d3.scaleLinear().domain([0, 15]).range(['#FFF5F0', '#A50F15'])
          return color(value)
        }

        function showTooltip(event, d) {
          const count = composerData.value[d.properties.name] || 0 // 获取作曲家数量
          console.log(`显示 tooltip: ${d.properties.name}: ${count} 作曲家`) // 调试信息

          const tooltip = d3.select('#map-tooltip') // 选择当前组件中的 tooltip
          tooltip.transition().duration(200).style('opacity', 0.9) // 过渡到可见状态
          tooltip
            .html(`${d.properties.name}: ${count} 名作曲家`) // 显示国家名称和作曲家数量
            .style('left', 50 + 'px') // 使用相对视口的坐标
            .style('top', 50 + 'px') // 使用相对视口的坐标
        }

        function hideTooltip() {
          d3.select('#map-tooltip').transition().duration(200).style('opacity', 0) // 隐藏 tooltip
        }

        function addLegend(svg) {
          const legendWidth = 20 // 图例宽度
          const legendHeight = 300 // 图例高度

          const legend = svg.append('g').attr('transform', `translate(${width - 50}, ${height / 2 - legendHeight / 2})`) // 移动图例位置

          // 添加颜色渐变
          const gradient = svg
            .append('defs')
            .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%') // 使渐变垂直
            .attr('y2', '100%')

          gradient.append('stop').attr('offset', '0%').attr('stop-color', '#A50F15')
          gradient.append('stop').attr('offset', '100%').attr('stop-color', '#FFF5F0')

          // 添加图例的矩形
          legend.append('rect').attr('width', legendWidth).attr('height', legendHeight).style('fill', 'url(#gradient)') // 使用渐变填充

          // 添加图例的文本
          const yAxis = d3
            .axisRight(d3.scaleLinear().domain([0, 15]).range([legendHeight, 0])) // 垂直方向的坐标轴
            .ticks(5)
            .tickFormat((d) => d)

          legend.append('g').attr('transform', `translate(${legendWidth}, 0)`).call(yAxis) // 添加坐标轴
        }
      })

      return {
        globeContainer
      }
    }
  }
</script>

<style scoped>
  .map-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tooltip {
    position: absolute;
    text-align: center;
    padding: 8px;
    font: 12px sans-serif;
    background: lightsteelblue; /* 背景颜色 */
    border: 1px solid #333; /* 边框颜色 */
    border-radius: 8px;
    pointer-events: none; /* 不响应鼠标事件 */
    opacity: 0; /* 初始透明度 */
    transition: opacity 0.2s; /* 过渡效果 */
  }
</style>

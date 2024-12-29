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
  import {ref, onMounted, watch} from 'vue'
  import * as d3 from 'd3'
  import {feature} from 'topojson-client'
  import {ElMessage} from 'element-plus' // 引入 Element Plus 消息提示

  export default {
    name: 'InteractiveGlobe',
    props: {
      mapData: {
        type: Array,
        required: true
      }
    },
    setup(props) {
      const globeContainer = ref(null)

      // 监听 mapData 的变化
      watch(
        () => props.mapData,
        (newData) => {
          renderMap(newData)
        }
      )

      const renderMap = (newData) => {
        const width = 800
        const height = 600
        const sensitivity = 75

        // 清空之前的 SVG 内容
        d3.select(globeContainer.value).selectAll('*').remove()

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

        // Load world map data
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data) => {
          const countryData = feature(data, data.objects.countries).features

          // 创建一个国家到作曲家数量的映射
          const countryComposerCount = {}
          newData.forEach((composer) => {
            const country = composer.country
            if (!countryComposerCount[country]) {
              countryComposerCount[country] = 0
            }
            countryComposerCount[country] += 1 // 增加作曲家数量
          })

          console.log('Country Composer Count:', countryComposerCount) // 调试信息

          map
            .selectAll('path')
            .data(countryData)
            .enter()
            .append('path')
            .attr('d', path)
            .style('fill', (d) => {
              const count = countryComposerCount[d.properties.name] || 0
              return getColor(count)
            })
            .style('stroke', '#333')
            .style('stroke-width', 0.3)
            .on('mouseover', (event, d) => {
              d3.select(event.target).style('fill', 'yellow')
              showTooltip(event, d, countryComposerCount[d.properties.name] || 0)
            })
            .on('mouseout', (event, d) => {
              d3.select(event.target).style('fill', getColor(countryComposerCount[d.properties.name] || 0))
              hideTooltip()
            })
          addLegend(svg)
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

        function showTooltip(event, d, count) {
          const tooltip = d3.select('#map-tooltip')
          tooltip.transition().duration(200).style('opacity', 0.9)
          tooltip
            .html(`${d.properties.name}: ${count} 名作曲家`)
            .style('left', event.pageX + 'px')
            .style('top', event.pageY + 'px')
        }

        function hideTooltip() {
          d3.select('#map-tooltip').transition().duration(200).style('opacity', 0)
        }
        function addLegend(svg) {
          const legendWidth = 20 // 图例宽度
          const legendHeight = 300 // 图例高度
          const legendX = width - 50 // 图例 X 位置
          const legendY = height / 2 - legendHeight / 2 // 图例 Y 位置

          const legend = svg.append('g').attr('transform', `translate(${legendX}, ${legendY})`)

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
          const yScale = d3.scaleLinear().domain([0, 15]).range([legendHeight, 0]) // Y 轴比例尺
          const yAxis = d3
            .axisRight(yScale)
            .ticks(5)
            .tickFormat((d) => d)

          legend.append('g').attr('transform', `translate(${legendWidth}, 0)`).call(yAxis) // 添加坐标轴
        }
      }

      onMounted(() => {})

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
    text-align: center;
    padding: 8px;
    font: 12px sans-serif;
    background: lightsteelblue; /* 背景颜色 */
    border: 1px solid #333; /* 边框颜色 */
    border-radius: 8px;
    pointer-events: none; /* 不响应鼠标事件 */
    opacity: 0; /* 初始透明度 */
    width: 200px;
    transition: opacity 0.2s; /* 过渡效果 */
  }
</style>

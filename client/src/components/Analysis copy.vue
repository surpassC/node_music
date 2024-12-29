<script setup>
  import {ref, onMounted} from 'vue'
  import axios from '../utils/axios' // 引入 Axios
  import {ElMessage} from 'element-plus' // 引入 Element Plus 消息提示
  import * as d3 from 'd3' // 引入 D3.js
  import Map from './Map.vue'

  const composerData = ref([]) // 存储作曲家分析数据
  const selectedComposer = ref(null) // 存储选中的作曲家
  const sortOrder = ref('asc') // 存储排序状态

  const fetchComposerAnalysis = async () => {
    try {
      const response = await axios.get('/dataShow/composer-analysis') // 请求作曲家分析数据
      composerData.value = response.data // 将数据存储到 composerData
      sortData() // 排序数据
      renderComposerAnalysis() // 渲染可视化
      renderBarChart() // 渲染柱状图
    } catch (error) {
      console.error(error)
      ElMessage.error('获取作曲家分析数据失败') // 显示错误消息
    }
  }

  const sortData = () => {
    composerData.value.sort((a, b) => {
      return sortOrder.value === 'asc' ? b.count - a.count : a.count - b.count
    })
  }

  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc' // 切换排序状态
    sortData() // 重新排序数据
    renderBarChart() // 重新渲染柱状图
  }

  const renderComposerAnalysis = () => {
    const svg = d3.select('#composer-analysis') // 选择 SVG 容器
    svg.selectAll('*').remove() // 清空之前的内容

    const width = 500
    const height = 500
    const radius = Math.min(width, height) / 3 - 10 // 调整半径

    svg.attr('width', width).attr('height', height)

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`) // 确保饼图在中心

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const pie = d3.pie().value((d) => d.count) // 使用 count 属性

    const arc = d3
      .arc()
      .innerRadius(0) // 外半径
      .outerRadius(radius) // 内半径

    const arcs = g.selectAll('.arc').data(pie(composerData.value)).enter().append('g').attr('class', 'arc')

    arcs
      .append('path')
      .attr('d', arc)
      .style('fill', (d) => color(d.data.name))
      .on('mouseover', (event, d) => {
        selectedComposer.value = d.data.name // 设置选中的作曲家
        updateBarChart(d.data.name) // 更新柱状图
        updateLegend(d.data.name) // 更新图例
      })
      .transition() // 添加过渡效果
      .duration(1000) // 动画持续时间
      .attrTween('d', function (d) {
        const i = d3.interpolate(0, d.endAngle - d.startAngle)
        return function (t) {
          d.endAngle = d.startAngle + i(t)
          return arc(d)
        }
      })

    // 添加外部文本和连线
    arcs
      .append('text')
      .attr('transform', (d) => {
        const centroid = arc.centroid(d)
        return `translate(${centroid[0] * 1.5}, ${centroid[1] * 1.5})` // 将文本放置在外部
      })
      .attr('dy', '.35em')
      .text((d) => `${d.data.name} (${((d.data.count / d3.sum(composerData.value, (d) => d.count)) * 100).toFixed(1)}%)`)

    // 添加图例
    const legend = d3
      .select('#legend')
      .selectAll('.legend')
      .data(composerData.value)
      .enter()
      .append('div')
      .attr('class', 'legend')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('margin', '5px 0')

    legend
      .append('div')
      .style('width', '20px')
      .style('height', '20px')
      .style('background-color', (d) => color(d.name))
      .style('margin-right', '10px')

    legend.append('span').text((d) => `${d.name} (${((d.count / d3.sum(composerData.value, (d) => d.count)) * 100).toFixed(1)}%)`) // 显示占比

    // 添加标题和描述
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('作曲家分析饼图')

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('各作曲家作品数量占比')
  }

  const renderBarChart = () => {
    const svg = d3.select('#bar-chart') // 选择柱状图 SVG 容器
    svg.selectAll('*').remove() // 清空之前的内容

    const width = 700
    const height = 500
    const margin = {top: 20, right: 30, bottom: 70, left: 60} // 增加边距
    const x = d3
      .scaleBand()
      .domain(composerData.value.map((d) => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(composerData.value, (d) => d.count)]) // 使用 count 属性
      .range([height - margin.bottom, margin.top])

    svg.attr('width', width).attr('height', height).style('background-color', '#e0f7fa') // 设置背景颜色

    // 添加 X 轴
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x))

    // 添加 Y 轴
    svg.append('g').attr('transform', `translate(${margin.left}, 0)`).call(d3.axisLeft(y).ticks(10)) // 设置 Y 轴的刻度

    // 添加 X 轴标签
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - margin.bottom + 40) // 增加底部空间
      .attr('text-anchor', 'middle')
      .text('作曲家')

    // 添加 Y 轴标签
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left - 40) // 增加左侧空间
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('作品数量')

    svg
      .selectAll('.bar')
      .data(composerData.value)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.name))
      .attr('y', (d) => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - margin.bottom - y(d.count))
      .attr('fill', '#42a5f5') // 设置柱子的颜色
      .on('mouseover', (event, d) => {
        selectedComposer.value = d.name // 设置选中的作曲家
        updatePieChart(d.name) // 更新饼图
        updateLegend(d.name) // 更新图例
      })
      .transition() // 添加过渡效果
      .duration(1000) // 动画持续时间

    // 在柱子上方添加数量文本描述
    svg
      .selectAll('.label')
      .data(composerData.value)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d) => x(d.name) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.count) - 5) // 在柱子上方，增加了5的偏移量
      .attr('text-anchor', 'middle')
      .text((d) => d.count) // 显示数量

    // 在柱子下方添加流派名
    svg
      .selectAll('.genre-label')
      .data(composerData.value)
      .enter()
      .append('text')
      .attr('class', 'genre-label')
      .attr('x', (d) => x(d.name) + x.bandwidth() / 2)
      .attr('y', height - margin.bottom + 20) // 在柱子下方
      .attr('text-anchor', 'middle')
      .text((d) => d.genre) // 显示流派名
  }

  const updateBarChart = (composerName) => {
    const svg = d3.select('#bar-chart')
    svg
      .selectAll('.bar')
      .transition()
      .duration(500)
      .attr('fill', (d) => (d.name === composerName ? 'orange' : '#42a5f5')) // 高亮选中的作曲家
  }

  const updatePieChart = (composerName) => {
    const svg = d3.select('#composer-analysis')
    svg
      .selectAll('.arc path')
      .transition()
      .duration(500)
      .attr('opacity', (d) => (d.data.name === composerName ? 1 : 0.3)) // 高亮选中的扇区
  }

  const updateLegend = (composerName) => {
    const legendItems = d3.selectAll('.legend span')
    legendItems.style('font-weight', (d) => (d.name === composerName ? 'bold' : 'normal')) // 高亮选中的图例
  }
  onMounted(() => {
    fetchComposerAnalysis() // 组件挂载后请求数据
  })
</script>

<template>
  <div>
    <h2>作曲家分析</h2>
    <button @click="toggleSortOrder">切换排序</button>
    <el-card style="flex: 1">
      <div class="d-flex">
        <div class="d-flex">
          <div id="legend" style="width: 200px"></div>
          <svg id="composer-analysis"></svg>
        </div>
        <svg id="bar-chart" style="margin-top: 20px"></svg>
      </div>
    </el-card>
    <Map />

    <!-- 图例容器 -->
  </div>
  <!-- 添加柱状图 SVG 容器 -->
  <!-- 排序按钮 -->
</template>
<style scoped>
  .d-flex {
    display: flex;
  }
  .d-flex > * {
  }
</style>


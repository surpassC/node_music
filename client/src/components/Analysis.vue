<script setup>
  import {ref, onMounted} from 'vue'
  import axios from '../utils/axios' // 引入封装的 Axios
  import * as d3 from 'd3'
  import {ElMessage} from 'element-plus'
  import Map from './Map.vue'

  const genres = ref([]) // 存储所有流派
  const selectedGenre = ref('') // 当前选中的流派
  const mapData = ref([]) // 存储作曲家分析数据
  // 获取所有流派
  const fetchGenres = async () => {
    try {
      const response = await axios.get('/genres') // 假设后端提供获取所有流派的接口
      genres.value = response // 假设返回的数据是流派数组

      selectedGenre.value = genres.value[0]['id'] // 默认选中第一个流派
      fetchComposerAnalysis() // 获取默认流派的作曲家分析
    } catch (error) {
      console.error(error)
      ElMessage.error('获取流派数据失败')
    }
  }

  // 根据选定流派获取作曲家分析数据
  const fetchComposerAnalysis = async () => {
    try {
      const genre = genres.value.filter((genre) => genre.id == selectedGenre.value)[0]['id']

      const response = await axios.get(`/composers/getGenreType?genre=${genre}`) // 根据流派类型获取作曲家数据
      const composerData = response // 假设返回的数据是作曲家数组
      // 处理数据以获取每个国家的作曲家数量
      // const countryData = processComposerData(composerData)
      mapData.value = composerData // 假设你有一个响应式变量 mapData 用于存储地图数据
      console.log(mapData.value)

      // 更新可视化
      renderComposerAnalysis(composerData)
      renderBarChart(composerData)
      // renderMap(composerData)
    } catch (error) {
      console.error(error)
      ElMessage.error('获取作曲家分析数据失败')
    }
  }

  // D3.js 可视化函数
  const renderComposerAnalysis = (composerData) => {
    const svg = d3
      .select('#composer-analysis')
      .attr('width', 500) // 设置宽度
      .attr('height', 500) // 设置高度

    svg.selectAll('*').remove() // 清空之前的内容

    const width = 500
    const height = 500
    const radius = Math.min(width, height) / 3 - 10 // 调整半径

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`) // 确保饼图在中心

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    // 使用作品数量作为饼图的值
    const pie = d3.pie().value((d) => d.number_works || 0) // 使用 number_works 属性

    const arc = d3.arc().innerRadius(0).outerRadius(radius) // 外半径

    const arcs = g
      .selectAll('.arc')
      .data(pie(composerData)) // 传递 composerData
      .enter()
      .append('g')
      .attr('class', 'arc')

    arcs
      .append('path')
      .attr('d', arc)
      .style('fill', (d) => color(d.data.name))
      .style('stroke', '#fff') // 添加边框
      .style('stroke-width', '2px') // 边框宽度
      .on('mouseover', (event, d) => {
        // 高亮当前饼图部分
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .style('opacity', 1) // 取消透明度
          .style('filter', 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))') // 添加阴影效果

        // 高亮对应的图例
        d3.selectAll('.legend')
          .filter((legend) => legend.name === d.data.name)
          .select('div')
          .style('border', '2px solid #000') // 高亮图例
        // 加粗图例文本
        d3.selectAll('.legend')
          .filter((legend) => legend.name === d.data.name)
          .select('span') // 选择文本元素
          .style('font-weight', 'bold') // 加粗文字
      })
      .on('mouseout', (event, d) => {
        // 恢复当前饼图部分的透明度
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .style('opacity', 1) // 恢复透明度
          .style('filter', 'none') // 移除阴影效果

        // 恢复对应的图例样式
        d3.selectAll('.legend')
          .filter((legend) => legend.name === d.data.name)
          .select('div')
          .style('border', '1px solid #000') // 恢复图例边框

        // 加粗图例文本
        d3.selectAll('.legend')
          .filter((legend) => legend.name === d.data.name)
          .select('span') // 选择文本元素
          .style('font-weight', 'normal') // 恢复图例文本样式
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
    // arcs.append('text')
    //   .attr('transform', d => {
    //     const centroid = arc.centroid(d);
    //     return `translate(${centroid[0] * 1.5}, ${centroid[1] * 1.5})`; // 将文本放置在外部
    //   })
    //   .attr('dy', '.35em')
    //   .text(d => `${d.data.name} (${((d.data.number_works / d3.sum(composerData, d => d.number_works)) * 100).toFixed(1)}%)`); // 显示占比

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

    // 更新图例
    const legend = d3.select('#legend')
    legend.selectAll('*').remove() // 清空之前的图例

    const legendItems = legend
      .selectAll('.legend')
      .data(composerData)
      .enter()
      .append('div')
      .attr('class', 'legend')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('margin', '5px 0')

    legendItems
      .append('div')
      .style('width', '20px')
      .style('height', '20px')
      .style('background-color', (d) => color(d.name))
      .style('margin-right', '10px')
      .style('border', '1px solid #000') // 图例边框

    legendItems
      .append('span')
      .text((d) => `${d.name} (${((d.number_works / d3.sum(composerData, (d) => d.number_works)) * 100).toFixed(1)}%)`) // 显示占比
      .style('cursor', 'pointer') // 鼠标悬停时显示手型
      .on('mouseover', function (event, d) {
        // 高亮对应的饼图部分
        d3.selectAll('.arc path')
          .filter((arcData) => arcData.data.name === d.name)
          .transition()
          .duration(200)
          .style('opacity', .5) // 取消透明度
          .style('filter', 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))') // 添加阴影效果

        // 高亮图例
        d3.select(this).style('font-weight', 'bold') // 高亮图例文本
      })
      .on('mouseout', function (event, d) {
        // 恢复对应的饼图部分的透明度
        d3.selectAll('.arc path')
          .filter((arcData) => arcData.data.name === d.name)
          .transition()
          .duration(200)
          .style('opacity', 1) // 恢复透明度
          .style('filter', 'none') // 移除阴影效果

        // 恢复图例文本样式
        d3.select(this).style('font-weight', 'normal') // 恢复图例文本样式
      })
  }

  const renderBarChart = (composerData) => {
    const svg = d3.select('#bar-chart') // 选择柱状图 SVG 容器
    svg.selectAll('*').remove() // 清空之前的内容
    // 确保 composerData 是有效的数组
    if (!composerData || !Array.isArray(composerData) || composerData.length === 0) {
      console.warn('没有可用的作曲家数据，无法渲染柱状图')
      return // 如果没有数据，提前返回
    }

    const width = 800
    const height = 600
    const margin = {top: 20, right: 30, bottom: 120, left: 60} // 增加边距

    // 根据 name 渲染 X 轴
    const x = d3
      .scaleBand()
      .domain(composerData.map((d) => d.name)) // 使用 name 属性
      .range([margin.left, width - margin.right])
      .padding(0.1)

    // 根据 number_works 渲染 Y 轴
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(composerData, (d) => d.number_works) * 1.1]) // 使用 number_works 属性并增加缓冲
      .range([height - margin.bottom, margin.top])

    svg.attr('width', width).attr('height', height).style('background-color', '#e0f7fa') // 设置背景颜色

    // 添加 X 轴
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text') // 选择所有文本元素
      .style('text-anchor', 'end') // 设置文本锚点
      .attr('dx', '-.8em') // 调整 x 方向位置
      .attr('dy', '.15em') // 调整 y 方向位置
      .attr('transform', 'rotate(-45)') // 旋转文本

    // 添加 Y 轴
    svg.append('g').attr('transform', `translate(${margin.left}, 0)`).call(d3.axisLeft(y).ticks(10)) // 设置 Y 轴的刻度

    // 添加 X 轴标签
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - margin.bottom + 60) // 增加底部空间
      .attr('text-anchor', 'middle')
      .text('作曲家')
      .attr('y', margin.left + 530) // 让标签下移

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
      .data(composerData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.name)) // 使用 name 属性
      .attr('y', (d) => y(d.number_works)) // 使用 number_works 属性
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - margin.bottom - y(d.number_works)) // 确保高度计算正确
      .attr('fill', '#42a5f5') // 设置柱子的颜色
      .on('mouseover', (event, d) => {})
      .transition() // 添加过渡效果
      .duration(1000) // 动画持续时间

    // 在柱子上方添加数量文本描述
    svg
      .selectAll('.label')
      .data(composerData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d) => x(d.name) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.number_works) - 5) // 在柱子上方，增加了5的偏移量
      .attr('text-anchor', 'middle')
      .text((d) => d.number_works) // 显示数量
  }
  const processComposerData = (data) => {
    const countryMap = {}

    // 检查 data 是否存在且为数组
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((composer) => {
        const country = composer.country
        if (!countryMap[country]) {
          countryMap[country] = 0 // 初始化国家的作��家数量
        }
        countryMap[country] += 1 // 增加作曲家数量
      })
    }

    // 将对象转换为数组格式
    return Object.entries(countryMap).map(([country, count]) => ({
      country,
      count
    }))
  }

  // 组件挂载时获取流派数据
  onMounted(fetchGenres)
</script>

<template>
  <div>
    <h2>选择流派</h2>
    <el-select v-model="selectedGenre" @change="fetchComposerAnalysis">
      <el-option v-for="genre in genres" :key="genre.id" :label="genre.name" :value="genre.id" />
    </el-select>
    <div class="d-flex">
      <div id="legend"></div>
      <div class="d-flex">
        <svg id="composer-analysis"></svg>
        <svg id="bar-chart"></svg>
      </div>
    </div>
    <Map :mapData="mapData" />
  </div>
</template>
<style scoped>
  .d-flex {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .d-flex > * {
    margin: 2% 0;
  }
</style>

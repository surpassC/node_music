<template>
  <div class="chart-container">
    <div class="box">
      <div class="left">
        <h2>D3.js 流派数据可视化</h2>
        <el-button @click="drawWordCloud" :disabled="!chartData.length">生成词云</el-button>
        <el-button @click="drawBarChart" :disabled="!chartData.length">生成柱状图</el-button>
        <!-- <el-button @click="drawPieChart" :disabled="!chartData.length">生成饼图</el-button> -->
        <div ref="chart" class="chart" style="width: 500px; height: 400px"></div>
      </div>
      <div class="right">
        <div class="music-list">
          <h3>音乐列表</h3>
          <div class="card-container">
            <div v-for="music in musicList" :key="music.id" class="music-card">
              <h4>{{ music.title }}</h4>
              <p>{{ music.artist }}</p>
              <el-button @click="togglePlay(music)">播放/暂停</el-button>
            </div>
          </div>
        </div>
        <div id="visualization" ref="visualization" class="visualization" style="width: 500px; height: 200px"></div>
      </div>
    </div>
    <!-- 音频可视化区域 -->
  </div>
</template>

<script setup>
  import {ref, onMounted} from 'vue'
  import * as d3 from 'd3'
  import cloud from 'd3-cloud'
  import axios from '../utils/axios' // 引入 Axios
  import {ElMessage} from 'element-plus'

  const chartData = ref([]) // 存储从后端获取的数据
  const chart = ref(null) // 引用图表的 DOM 元素
  const composers = ref([])
  const musicList = ref([])

  const visualization = ref(null)
  let audioContext = null // 音频上下文
  let analyser = null // 分析器
  let dataArray = null // 音频数据数组
  let currentAudio = null // 当前播放的音频元素
  // 获取流派的数据
  const fetchChartData = async () => {
    try {
      const response = await axios.get('/genres') // 替换为实际的 API 路径
      chartData.value = response // 确保将数据赋值给 chartData
    } catch (error) {
      console.error('获取数据失败', error)
    }
  }
  // 获取音乐列表
  const fetchMusicList = async () => {
    try {
      const response = await axios.get('/music') // 替换为实际的 API 路径
      musicList.value = response
    } catch (error) {
      console.error(error)
      ElMessage.error('获取音乐列表失败')
    }
  }
  // 作曲家
  const fetchComposers = async () => {
    try {
      const response = await axios.get('/composers') // 替换为实际的 API 路径
      composers.value = response // 假设返回的是作曲家数组
    } catch (error) {
      console.error('获取作曲家失败', error)
    }
  }

  // 绘制词云
  const drawWordCloud = () => {
    if (!chartData.value || chartData.value.length === 0) return // 确保数据已加载

    const words = chartData.value.flatMap((item) => {
      const name = item.name // 流派名称
      const description = item.description // 流派描述
      const wordArray = description.split(/\s+/) // 按空格分割描述为单词
      return [
        {text: name, size: Math.random() * 50 + 10}, // 流派名称
        ...wordArray.map((word) => ({text: word, size: Math.random() * 30 + 10})) // 描述中的单词
      ]
    })

    const uniqueComposers = Array.from(new Set(composers.value.map((composer) => composer.name)))
    words.push(...uniqueComposers.map((composer) => ({text: composer, size: Math.random() * 30 + 10})))

    d3.select(chart.value).selectAll('*').remove() // 清空之前的图表

    const title = d3
      .select(chart.value)
      .append('h3')
      .text('流派词云') // 设置词云标题
      .style('text-align', 'center')

    const layout = cloud()
      .size([500, 400])
      .words(words)
      .padding(5)
      .rotate(0) // 设置为 0，确保所有文本方向正向
      .fontSize((d) => d.size)
      .on('end', draw) // 词云生成完成后调用 draw 函数

    layout.start()

    function draw(words) {
      const svg = d3.select(chart.value).append('svg').attr('width', 500).attr('height', 400).append('g').attr('transform', 'translate(250,200)') // 将词云居中

      svg
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-size', (d) => d.size + 'px')
        .style('fill', () => d3.schemeCategory10[Math.floor(Math.random() * 10)]) // 随机颜色
        .attr('text-anchor', 'middle')
        .attr('transform', (d) => `translate(${d.x},${d.y})`) // 移除旋转
        .text((d) => d.text)
    }
  }

  // 绘制柱状图
  const drawBarChart = () => {
    if (!chartData.value || chartData.value.length === 0 || !composers.value || composers.value.length === 0) return // 确保数据已加载

    d3.select(chart.value).selectAll('*').remove() // 清空之前的图表

    const svg = d3.select(chart.value).append('svg').attr('width', 500).attr('height', 400)

    // 计算每个流派的作曲家数量
    const data = chartData.value.map((item) => ({
      name: item.name,
      count: musicList.value.filter((music) => music.genre_id === item.id && composers.value.some((composer) => composer.id === music.composers_id))
        .length // 过滤作曲家以获取数量
    }))

    const margin = {top: 20, right: 30, bottom: 40, left: 40}
    const width = 500 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('流派作品数量') // 设置柱状图标题

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .padding(0.1)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) || 1]) // 确保 Y 轴的最大值至少为 1
      .range([height, 0])
      .nice() // 使用 nice() 方法使得 Y 轴的刻度更整齐

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.name))
      .attr('y', (d) => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d.count))
      .style('fill', 'orange')

    // 添加 X 轴
    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale)) // 使用 xScale 生成 X 轴

    // 添加 Y 轴
    g.append('g').call(d3.axisLeft(yScale).ticks(5)) // 使用 yScale 生成 Y 轴，并设置刻度数量为 5

    // 在每个柱子上方添加文本标签，显示作曲家数量
    g.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .attr('x', (d) => xScale(d.name) + xScale.bandwidth() / 2) // 中心对齐
      .attr('y', (d) => yScale(d.count) - 5) // 在柱子上方
      .attr('text-anchor', 'middle')
      .attr('fill', 'black') // 设置文本颜色为黑色
      .text((d) => d.count) // 显示作家数量
  }

  // 绘制饼图
  const drawPieChart = () => {
    if (!chartData.value || chartData.value.length === 0 || !composers.value || composers.value.length === 0) return // 确保数据已加载

    d3.select(chart.value).selectAll('*').remove() // 清空之前的图表

    const svg = d3.select(chart.value).append('svg').attr('width', 800).attr('height', 800).append('g').attr('transform', 'translate(250,200)') // 将饼图居中
    // 添加饼图标题
    svg
      .append('text')
      .attr('x', 0)
      .attr('y', -120) // 调整位置
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('流派作曲家数量') // 设置饼图标题

    // 计算每个流派的作曲家数量，并过滤掉数量为 0 的流派
    const data = chartData.value
      .map((item) => ({
        name: item.name,
        count: musicList.value.filter((music) => music.genre_id === item.id && composers.value.some((composer) => composer.id === music.composers_id))
          .length // 过滤作曲家以获取数量
      }))
      .filter((d) => d.count > 0) // 只保留数量大于 0 的流派

    if (data.length === 0) return // 如果没有有效数据，则不绘制饼图

    const pie = d3.pie().value((d) => d.count) // 使用作曲家数量作为饼图的值
    const arc = d3.arc().innerRadius(0).outerRadius(100) // 设置饼图的半径

    const arcs = pie(data) // 计算每个扇区的角度

    svg
      .selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => d3.schemeCategory10[i % 10]) // 随机颜色
      .attr('transform', 'translate(0,0)')

    // 在每个扇区中添加文本标签，显示流派名称和作曲家数量
    svg
      .selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`) // 将文本放置在扇区的中心
      .attr('dy', '0.35em') // 垂直居中
      .attr('text-anchor', 'middle')
      .text((d) => `${d.data.name}: ${d.data.count}`) // 显示流派名称和作家数量
  }

  // 播放或暂停音乐
  const togglePlay = (music) => {
    if (currentAudio && currentAudio.src === music.file_path) {
      // 如果当前音频正在播放，则暂停
      if (currentAudio.paused) {
        currentAudio.play()
      } else {
        currentAudio.pause()
      }
    } else {
      // 否则播放新的音频
      if (currentAudio) {
        currentAudio.pause() // 暂停当前音频
      }

      currentAudio = new Audio(music.file_path) // 创建新的音频元素
      currentAudio.crossOrigin = 'anonymous'

      // 创建音频上下文和分析器
      audioContext = new (window.AudioContext || window.webkitAudioContext)() // 创建音频上下文
      analyser = audioContext.createAnalyser() // 创建分析器
      analyser.fftSize = 256 // 设置 FFT 大小
      dataArray = new Uint8Array(analyser.frequencyBinCount) // 创建数据数组

      const source = audioContext.createMediaElementSource(currentAudio) // 创建音频源
      source.connect(analyser) // 连接分析器
      analyser.connect(audioContext.destination) // 连接到音频上下文的输出

      currentAudio.play() // 播放音乐
      visualize()
    }
  }

  // 可视化函数
  const visualize = () => {
    const svgContainer = d3.select('#visualization').selectAll('*').remove() // 清空之前的可视化
    const width = 500
    const height = 200

    // 创建 SVG 元素
    const svg = d3.select('#visualization').append('svg').attr('width', width).attr('height', height)

    const barWidth = width / dataArray.length // 每个条形的宽度

    // 绘制条形图
    const bars = svg
      .selectAll('rect')
      .data(dataArray)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * barWidth) // X 坐标
      .attr('y', height) // 初始 Y 坐标
      .attr('width', barWidth - 1) // 减去 1 以避免条形之间的间隙
      .attr('height', 0) // 初始高度为 0
      .style('fill', (d) => d3.interpolateRainbow(d / 255)) // 使用彩虹色填充

    // 动画效果
    const animate = () => {
      requestAnimationFrame(animate)
      analyser.getByteFrequencyData(dataArray) // 获取频率数据

      bars
        .data(dataArray)
        .attr('y', (d) => height - (d / 255) * height) // 更新 Y 坐标
        .attr('height', (d) => Math.max(0, (d / 255) * height)) // 确保高度不为负数
    }

    animate()
  }
  // 组件挂载时获取数据
  onMounted(() => {
    fetchChartData() // 组件挂载时获取数据
    fetchComposers() // 获取作曲家数据
    fetchMusicList()
  })
</script>
<style scoped>
  .chart-container {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  .box {
    display: flex;
    justify-content: space-between;
  }
  .right{
    flex: 60%;
  }
  .chart {
    margin-top: 20px;
  }

  .music-list {
    margin-top: 20px;
  }

  .card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* 卡片之间的间距 */
  }

  .music-card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    width: 150px; /* 卡片宽度 */
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s; /* 添加过渡效果 */
  }

  .music-card:hover {
    transform: scale(1.05); /* 鼠标悬停时放大 */
  }
</style>

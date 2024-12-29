<template>
  <div class="music-list">
    <h1>音乐列表</h1>

    <div class="container">
      <div class="filter-container">
        <div class="filter-group">
          <h3>选择流派</h3>
          <el-checkbox-group v-model="selectedGenres" @change="filterMusicList">
            <el-checkbox v-for="genre in genres" :key="genre.id" :value="genre.name">
              {{ genre.name }}
            </el-checkbox>
          </el-checkbox-group>
        </div>

        <div class="filter-group">
          <h3>选择作曲家</h3>
          <el-checkbox-group v-model="selectedComposers" @change="filterMusicList">
            <el-checkbox v-for="composer in composers" :key="composer.id" :value="composer.name">
              {{ composer.name }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="results-container">
        <el-input v-model="searchQuery" placeholder="搜索音乐标题" style="margin-bottom: 20px" />

        <div class="card-container">
          <el-card v-for="music in filteredMusicList" :key="music.id" class="music-card" :body-style="{padding: '10px'}">
            <div class="card-content">
              <img v-if="music.photo_path" :src="music.photo_path" alt="封面" class="cover-image" />
              <h3>{{ music.title }}</h3>
              <p>作曲家: {{ music.composerName }}</p>
              <p>流派: {{ music.genreName }}</p>
              <p>描述: {{ music.information }}</p>
              <audio width="100%" v-if="music.file_path" :src="music.file_path" controls></audio>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '../utils/axios'; // 引入封装的 Axios
import { ElMessage } from 'element-plus';

const musicList = ref([]);
const searchQuery = ref('');
const selectedGenres = ref([]); // 确保初始化为数组
const selectedComposers = ref([]); // 确保初始化为数组
const genres = ref([]); // 存储流派
const composers = ref([]); // 存储作曲家

// 获取音乐列表
const fetchMusicList = async (filters = {}) => {
  try {
    const response = await axios.get('/music', { params: filters }); // 替换为实际的 API 路径
    musicList.value = response.map((music) => ({
      ...music,
      composerName: music.composerName || '未知作曲家',
      genreName: music.genreName || '未知流派'
    }));
  } catch (error) {
    console.error(error);
    ElMessage.error('获取音乐列表失败');
  }
};

// 获取流派
const fetchGenres = async () => {
  try {
    const response = await axios.get('/genres'); // 替换为实际的 API 路径
    genres.value = response; // 假设返回的是流派数组
  } catch (error) {
    console.error(error);
    ElMessage.error('获取流派失败');
  }
};

// 获取作曲家
const fetchComposers = async () => {
  try {
    const response = await axios.get('/composers'); // 替换为实际的 API 路径
    composers.value = response; // 假设返回的是作曲家数组
  } catch (error) {
    console.error(error);
    ElMessage.error('获取作曲家失败');
  }
};

// 计算筛选后的音乐列表
const filteredMusicList = computed(() => {
  return musicList.value.filter((music) => {
    const titleMatch = music.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const genreMatch = selectedGenres.value.length === 0 || selectedGenres.value.includes(music.genreName);
    const composerMatch = selectedComposers.value.length === 0 || selectedComposers.value.includes(music.composerName);
    return titleMatch && (genreMatch || composerMatch); // 只要匹配流派或作曲家即可
  });
});

// 筛选音乐列表
const filterMusicList = () => {
  // 触发计算属性更新
  filteredMusicList.value; // 访问计算属性以触发更新
};

// 组件挂载时获取数据
onMounted(() => {
  fetchMusicList(); // 初始获取所有音乐
  fetchGenres();
  fetchComposers();
});
</script>

<style scoped>
.music-list {
  padding: 10px;
}

.container {
  display: flex;
  gap: 10px; /* 左右间距 */
}

.filter-container {
  flex: 1; /* 左侧占据1份空间 */
  background-color: #f9f9f9; /* 背景色 */
  padding: 20px; /* 内边距 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 阴影 */
}

.results-container {
  flex: 4; /* 右侧占据2份空间 */
  padding: 20px; /* 内边距 */
}

.filter-group {
  margin-bottom: 20px; /* 每个选择框组之间的间距 */
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* 卡片之间的间距 */
}

.music-card {
  width: 350px; /* 卡片宽度 */
}

.cover-image {
  width: 100%; /* 封面图片宽度 */
  height: 200px; /* 自适应高度 */
  object-fit: cover;
}
</style>
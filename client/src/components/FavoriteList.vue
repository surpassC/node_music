<template>
  <div class="favorite-list">
    <h1>我的收藏</h1>
    
    <div class="results-container">
      <!-- 加载状态 -->
      <el-skeleton :loading="loading" animated :count="3" v-if="loading">
        <template #template>
          <div style="padding: 14px">
            <el-skeleton-item variant="image" style="width: 100%; height: 200px" />
            <div style="padding: 14px">
              <el-skeleton-item variant="h3" style="width: 50%" />
              <div style="display: flex; align-items: center; justify-items: space-between; margin-top: 16px">
                <el-skeleton-item variant="text" style="margin-right: 16px" />
                <el-skeleton-item variant="text" style="width: 30%" />
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>
      <!-- 空状态 -->
      <el-empty 
        v-else-if="!loading && (!favoriteList || favoriteList.length === 0)" 
        description="暂无收藏" 
      />
      
      <!-- 数据展示 -->
      <div v-else class="card-container">
        <el-card
          v-for="music in favoriteList"
          :key="music.id"
          class="music-card"
          :body-style="{ padding: '10px' }"
        >
          <div class="card-content">
            <img
              v-if="music.photo_path"
              :src="music.photo_path"
              alt="封面"
              class="cover-image"
            />
            <div v-else class="no-image">暂无封面</div>
            <h3>{{ music.title }}</h3>
            <p>作曲家: {{ composers.length ? getComposerName(music.composers_id) : '加载中...' }}</p>
            <p>流派: {{ genres.length ? getGenreName(music.genre_id) : '加载中...' }}</p>
            <p v-if="music.information">描述: {{ music.information }}</p>
            <audio
              width="100%"
              v-if="music.file_path"
              :src="music.file_path"
              controls
            ></audio>
            <div class="card-actions">
              <el-button
                type="danger"
                size="small"
                @click="removeFavorite(music)"
              >
                <el-icon><Star /></el-icon>
                取消收藏
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Star } from '@element-plus/icons-vue';
import { useStore } from '../stores/useStore';
import axios from '../utils/axios';
import { ElMessage } from 'element-plus';

const store = useStore();
const loading = ref(true);
const favoriteList = ref([]);
const composers = ref([]);
const genres = ref([]);

// 获取作曲家和流派数据
const fetchMetadata = async () => {
  try {
    const [composersRes, genresRes] = await Promise.all([
      axios.get('/composers'),
      axios.get('/genres')
    ]);
    composers.value = composersRes.data || [];
    genres.value = genresRes.data || [];
  } catch (error) {
    console.error('获取元数据失败:', error);
    ElMessage.error('获取元数据失败');
    composers.value = [];
    genres.value = [];
  }
};

// 获取作曲家名称
const getComposerName = (composerId) => {
  if (!composers.value || !composers.value.length) return '加载中...';
  const composer = composers.value.find(c => c.id === composerId);
  return composer ? composer.name : '未知作曲家';
};

// 获取流派名称
const getGenreName = (genreId) => {
  if (!genres.value || !genres.value.length) return '加载中...';
  const genre = genres.value.find(g => g.id === genreId);
  return genre ? genre.name : '未知流派';
};

// 获取收藏列表
const fetchFavorites = async () => {
  try {
    if (!store.user?.id) {
      ElMessage.warning('请先登录');
      return;
    }
    const response = await axios.get(`/music/favorites/${store.user.id}`);
    favoriteList.value = response || [];
    console.log(favoriteList);
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    ElMessage.error('获取收藏列表失败');
    favoriteList.value = [];
  }
};

// 取消收藏
const removeFavorite = async (music) => {
  try {
    await axios.delete('/music/favorite', {
      params: {
        user_id: store.user.id,
        music_id: music.id
      }
    });
    
    // 从列表中移除
    favoriteList.value = favoriteList.value.filter(item => item.id !== music.id);
    ElMessage.success('取消收藏成功');
  } catch (error) {
    console.error('取消收藏失败:', error);
    ElMessage.error('取消收藏失败');
  }
};

onMounted(async () => {
  if (!store.user?.id) {
    ElMessage.warning('请先登录');
    return;
  }
  loading.value = true;
  try {
    await Promise.all([
      fetchMetadata(),
      fetchFavorites()
    ]);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.favorite-list {
  padding: 20px;
}

.results-container {
  padding: 20px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.music-card {
  width: 300px;
  margin-bottom: 20px;
}

.no-image {
  width: 100%;
  height: 200px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  margin-bottom: 10px;
}

audio {
  width: 100%;
  margin-top: 10px;
}

.cover-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 10px;
}

.card-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.card-content {
  padding: 15px;
}

h3 {
  margin: 10px 0;
  font-size: 18px;
}

p {
  margin: 5px 0;
  color: #606266;
}
</style> 
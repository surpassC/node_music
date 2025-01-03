<template>
  <div class="music-list">
    <h1>音乐列表</h1>

    <div class="container">
      <div class="filter-container">
        <div class="filter-group">
          <h3>选择流派</h3>
          <el-checkbox-group v-model="selectedGenres" @change="filterMusicList">
            <el-checkbox
              v-for="genre in genres"
              :key="genre.id"
              :value="genre.name"
            >
              {{ genre.name }}
            </el-checkbox>
          </el-checkbox-group>
        </div>

        <div class="filter-group">
          <h3>选择作曲家</h3>
          <el-checkbox-group
            v-model="selectedComposers"
            @change="filterMusicList"
          >
            <el-checkbox
              v-for="composer in composers"
              :key="composer.id"
              :value="composer.name"
            >
              {{ composer.name }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="results-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索音乐标题"
          style="margin-bottom: 20px"
        />

        <div class="card-container">
          <el-card
            v-for="music in filteredMusicList"
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
              <h3>{{ music.title }}</h3>
              <p>作曲家: {{ music.composerName }}</p>
              <p>流派: {{ music.genreName }}</p>
              <p>描述: {{ music.information }}</p>
              <audio
                width="100%"
                v-if="music.file_path"
                :src="music.file_path"
                controls
              ></audio>
              <div class="card-actions">
                <el-button
                  v-if="store.user && store.user.role !== 'admin'"
                  :type="music.isFavorite ? 'danger' : 'primary'"
                  size="small"
                  @click="toggleFavorite(music)"
                >
                  <el-icon><Star /></el-icon>
                  {{ music.isFavorite ? "取消收藏" : "收藏" }}
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Star } from "@element-plus/icons-vue";
import { useStore } from "../stores/useStore";
import axios from "../utils/axios";
import { ElMessage } from "element-plus";

const store = useStore();
const userFavorites = ref(new Set());
const musicList = ref([]);
const searchQuery = ref("");
const selectedGenres = ref([]); // 确保初始化为数组
const selectedComposers = ref([]); // 确保初始化为数组
const genres = ref([]); // 存储流派
const composers = ref([]); // 存储作曲家

// 获取音乐列表
const fetchMusicList = async () => {
  try {
    const params = {};
    // 只有普通用户才获取收藏状态
    if (store.user && store.user.role !== "admin") {
      params.userId = store.user.id;
    }

    const response = await axios.get("/music", { params });
    console.log(response);
    if (!response || !response.data) {
      throw new Error("No data received from server");
    }

    // 确保数据是数组
    const musicData = Array.isArray(response.data) ? response.data : [];

    // 处理每个音乐项
    musicList.value = musicData.map((music) => ({
      ...music,
      composerName: music.composerName || "未知作曲家",
      genreName: music.genreName || "未知流派",
      // 根据用户角色设置收藏状态
      isFavorite:
        store.user && store.user.role !== "admin"
          ? Boolean(music.isFavorite)
          : false,
    }));
  } catch (error) {
    console.error("获取音乐列表失败:", error);
    ElMessage.error("获取音乐列表失败");
  }
};

// 获取流派
const fetchGenres = async () => {
  try {
    const response = await axios.get("/genres"); // 替换为实际的 API 路径
    genres.value = response; // 假设返回的是流派数组
  } catch (error) {
    console.error(error);
    ElMessage.error("获取流派失败");
  }
};

// 获取作曲家
const fetchComposers = async () => {
  try {
    const response = await axios.get("/composers"); // 替换为实际的 API 路径
    composers.value = response; // 假设返回的是作曲家数组
  } catch (error) {
    console.error(error);
    ElMessage.error("获取作曲家失败");
  }
};

// 获取用户收藏列表
const fetchUserFavorites = async () => {
  try {
    if (!store.user?.id) {
      console.warn("用户未登录");
      return;
    }
    if (store.user.role !== "admin") {
      const response = await axios.get(`/music/favorites/${store.user.id}`);
      userFavorites.value = new Set(response.data.map((item) => item.id));
      updateMusicListFavoriteStatus();
    }
  } catch (error) {
    console.error("获取收藏列表失败:", error);
  }
};

// 更新音乐列表的收藏状态
const updateMusicListFavoriteStatus = () => {
  musicList.value = musicList.value.map((music) => ({
    ...music,
    isFavorite: userFavorites.value.has(music.id),
  }));
};

// 切换收藏状态
const toggleFavorite = async (music) => {
  try {
    if (!store.user?.id) {
      ElMessage.warning("请先登录");
      return;
    }

    if (music.isFavorite) {
      await axios.delete("/music/favorite", {
        params: {
          user_id: store.user.id,
          music_id: music.id,
        },
      });
      userFavorites.value.delete(music.id);
    } else {
      await axios.post("/music/favorite", {
        user_id: store.user.id,
        music_id: music.id,
      });
      userFavorites.value.add(music.id);
    }

    music.isFavorite = !music.isFavorite;
    ElMessage.success(music.isFavorite ? "收藏成功" : "取消收藏成功");
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error(error.response?.data?.message || "操作失败");
  }
};

// 计算筛选后的音乐列表
const filteredMusicList = computed(() => {
  return musicList.value.filter((music) => {
    const titleMatch = music.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const genreMatch =
      selectedGenres.value.length === 0 ||
      selectedGenres.value.includes(music.genreName);
    const composerMatch =
      selectedComposers.value.length === 0 ||
      selectedComposers.value.includes(music.composerName);
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
  fetchUserFavorites(); // 获取用户收藏列表
});
</script>

<style scoped>
.music-list {
  padding: 20px;
}

.container {
  display: flex;
  gap: 20px;
}

.filter-container {
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.results-container {
  flex: 4;
  padding: 20px;
}

.filter-group {
  margin-bottom: 20px;
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
audio {
  width: 100%;
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
</style>

<template>
  <div>
    <h2>管理音乐流派</h2>
    <el-form @submit.prevent="isEditing ? updateGenre() : addGenre()" label-width="120px">
      <el-form-item label="流派名称">
        <el-input v-model="genreName" placeholder="请输入流派名称" required />
      </el-form-item>
      <el-form-item label="流派介绍">
        <el-input type="textarea" v-model="genreDescription" placeholder="请输入流派介绍" />
      </el-form-item>
      <el-form-item label="流派图片">
        <el-upload
          class="upload-demo"
          action="http://localhost:3000/api/upload"
          name="image"
          :on-success="handleImageUploadSuccess"
          :show-file-list="false"
          :before-upload="beforeImageUpload">
          <el-button size="small" type="primary">上传图片</el-button>
        </el-upload>
        <img v-if="genreImage" :src="genreImage" alt="流派图片" style="width: 100px; height: 100px; object-fit: cover; margin-top: 10px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="isEditing ? updateGenre() : addGenre()">
          {{ isEditing ? '更新流派' : '添加流派' }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="genres" style="width: 100%">
      <el-table-column prop="name" label="流派名称" />
      <el-table-column prop="description" label="流派介绍" />
      <el-table-column label="流派图片">
        <template #default="scope">
          <img v-if="scope.row.image_path" :src="scope.row.image_path" alt="流派图片" style="width: 50px; height: 50px; object-fit: cover" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="editGenre(scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteGenre(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 使用 Element Plus 的分页组件 -->
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalGenres"
      layout="total, prev, pager, next, jumper" />
  </div>
</template>

<script setup>
  import {ref, onMounted} from 'vue'
  import axios from '../utils/axios'
  import {ElMessage} from 'element-plus'

  const genreName = ref('')
  const genreDescription = ref('')
  const genreImage = ref('')
  const isEditing = ref(false)
  const currentGenreId = ref(null)

  const genres = ref([])
  const currentPage = ref(1) // 当前页码
  const pageSize = ref(10) // 每页显示的流派数量
  const totalGenres = ref(0) // 总流派数量

  // 获取流派列表
  const fetchGenres = async () => {
    try {
      const response = await axios.get(`/genres?page=${currentPage.value}&limit=${pageSize.value}`)
      genres.value = response.genres // 假设返回的数据是流派数组
      totalGenres.value = response.total // 假设返回的总数在 response.total 中
    } catch (error) {
      console.error(error)
      ElMessage.error('获取流派列表失败')
    }
  }

  // 处理页码变化
  const handleCurrentChange = (page) => {
    currentPage.value = page
    fetchGenres() // 获取新的流派列表
  }

  // 添加流派
  const addGenre = async () => {
    try {
      await axios.post('/genres', {
        name: genreName.value,
        description: genreDescription.value,
        image_path: genreImage.value
      })
      resetForm()
      await fetchGenres()
      ElMessage.success('流派添加成功')
    } catch (error) {
      ElMessage.error('添加流派失败: ' + error.response.data.message)
    }
  }

  // 编辑流派
  const editGenre = (genre) => {
    genreName.value = genre.name
    genreDescription.value = genre.description
    genreImage.value = genre.image_path
    currentGenreId.value = genre.id
    isEditing.value = true
  }

  // 更新流派
  const updateGenre = async () => {
    try {
      await axios.put(`/genres/${currentGenreId.value}`, {
        name: genreName.value,
        description: genreDescription.value,
        image_path: genreImage.value
      })
      resetForm()
      await fetchGenres()
      ElMessage.success('流派更新成功')
    } catch (error) {
      ElMessage.error('更新流派失败: ' + error.response.data.message)
    }
  }

  // 删除流派
  const deleteGenre = async (id) => {
    try {
      await axios.delete(`/genres/${id}`)
      await fetchGenres()
      ElMessage.success('流派删除成功')
    } catch (error) {
      ElMessage.error('删除流派失败: ' + error.response.data.message)
    }
  }

  // 处理图片上传成功
  const handleImageUploadSuccess = (response, file) => {
    genreImage.value = response.url // 假设后端返回的响应中有 url 字段
  }

  // 上传前的检查
  const beforeImageUpload = (file) => {
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    const isGIF = file.type === 'image/gif'
    const isImage = isJPG || isPNG || isGIF

    if (!isImage) {
      ElMessage.error('上传图片只能是 JPG、PNG 或 GIF 格式!')
    }
    return isImage
  }

  // 重置表单
  const resetForm = () => {
    genreName.value = ''
    genreDescription.value = ''
    genreImage.value = ''
    isEditing.value = false
    currentGenreId.value = null
  }

  // 组件挂载时获取流派列表
  onMounted(fetchGenres)
</script>

<style scoped>
  .upload-demo {
    margin-bottom: 20px;
  }
</style>

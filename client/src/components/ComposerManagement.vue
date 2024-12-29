<template>
  <div class="composer-management">
    <h1>作曲家管理</h1>
    <el-button type="primary" @click="showAddComposerDialog">添加作曲家</el-button>

    <el-table :data="composers" style="width: 100%">
      <el-table-column prop="name" label="作曲家姓名" />
      <el-table-column prop="genre_name" label="流派" />
      <el-table-column prop="number_works" label="作品数量" />
      <el-table-column prop="bio" label="简介" />
      <el-table-column prop="country" label="国家" />
      <el-table-column label="图片">
        <template #default="scope">
          <img v-if="scope.row.image_path" :src="scope.row.image_path" alt="作曲家图片" style="width: 50px; height: 50px; object-fit: cover" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="showEditComposerDialog(scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteComposer(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalComposers"
      layout="total, prev, pager, next, jumper" />

    <el-dialog title="添加作曲家" v-model="addComposerDialogVisible">
      <el-form :model="newComposer">
        <el-form-item label="姓名" :rules="[{required: true, message: '请输入作曲家姓名', trigger: 'blur'}]">
          <el-input v-model="newComposer.name" />
        </el-form-item>

        <el-form-item label="流派" :rules="[{required: true, message: '请选择流派', trigger: 'blur'}]">
          <el-select v-model="newComposer.genre" placeholder="选择流派">
            <el-option v-for="genre in genres" :key="genre.id" :label="genre.name" :value="genre.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="作品数量">
          <el-input v-model="newComposer.number_works" />
        </el-form-item>
        <el-form-item label="国家">
          <el-select v-model="newComposer.country" placeholder="选择国家">
            <el-option v-for="country in countrys" :key="country" :label="country" :value="country" />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="newComposer.birth_date" type="date" placeholder="选择出生日期" />
        </el-form-item>
        <el-form-item label="去世日期">
          <el-date-picker v-model="newComposer.death_date" type="date" placeholder="选择去世日期" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" v-model="newComposer.bio" placeholder="请输入作曲家简介" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            action="http://localhost:3000/api/upload"
            name="image"
            :on-success="handleImageUploadSuccess"
            :show-file-list="false"
            :before-upload="beforeImageUpload">
            <el-button size="small" type="primary">上传图片</el-button>
          </el-upload>
          <img
            v-if="newComposer.image_path"
            :src="newComposer.image_path"
            alt="作曲家图片"
            style="width: 100px; height: 100px; object-fit: cover; margin-top: 10px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addComposerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addComposer">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑作曲家" v-model="editComposerDialogVisible">
      <el-form :model="editComposer">
        <el-form-item label="姓名" :rules="[{required: true, message: '请输入作曲家姓名', trigger: 'blur'}]">
          <el-input v-model="editComposer.name" />
        </el-form-item>
        <el-form-item label="流派" :rules="[{required: true, message: '请选择流派', trigger: 'blur'}]">
          <el-select v-model="editComposer.genre" placeholder="选择流派">
            <el-option v-for="genre in genres" :key="genre.id" :label="genre.name" :value="genre.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="作品数量">
          <el-input v-model="editComposer.number_works" />
        </el-form-item>
        <el-form-item label="国家">
          <el-select v-model="editComposer.country" placeholder="选择国家">
            <el-option v-for="country in countrys" :key="country" :label="country" :value="country" />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="editComposer.birth_date" type="date" placeholder="选择出生日期" />
        </el-form-item>
        <el-form-item label="去世日期">
          <el-date-picker v-model="editComposer.death_date" type="date" placeholder="选择去世日期" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" v-model="editComposer.bio" placeholder="请输入作曲家简介" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            action="http://localhost:3000/api/upload"
            name="image"
            :on-success="handleImageUploadSuccess"
            :show-file-list="false"
            :before-upload="beforeImageUpload">
            <el-button size="small" type="primary">上传图片</el-button>
          </el-upload>
          <img
            v-if="editComposer.image_path"
            :src="editComposer.image_path"
            alt="作曲家图片"
            style="width: 100px; height: 100px; object-fit: cover; margin-top: 10px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editComposerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateComposer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
  import countrys from '../data/Country'
  import {ref, onMounted} from 'vue'
  import axios from '../utils/axios' // 引入封装的 Axios
  import {ElMessage} from 'element-plus'

  const genres = ref([])
  const composers = ref([])
  const addComposerDialogVisible = ref(false)
  const editComposerDialogVisible = ref(false)
  const newComposer = ref({
    name: '',
    genre: '',
    birth_date: null,
    death_date: null,
    bio: '',
    number_works: '',
    image_path: '', // 新增图片字段
    country: ''
  })
  const editComposer = ref({
    id: null,
    name: '',
    genre: '',
    birth_date: null,
    death_date: null,
    bio: '',
    number_works: '',
    image_path: '', // 新增图片字段
    country: ''
  })

  const currentPage = ref(1)
  const pageSize = ref(10) // 每页显示的作曲家数量
  const totalComposers = ref(0) // 总作曲家数量
  // 获取流派列表
  const fetchGenres = async () => {
    try {
      const response = await axios.get('/genres')
      genres.value = response
    } catch (error) {
      ElMessage.error('获取流派失败: ' + error.response.data.message)
    }
  }

  // 获取作曲家列表
  const fetchComposers = async () => {
    try {
      const response = await axios.get(`/composers?page=${currentPage.value}&limit=${pageSize.value}`)
      composers.value = response.composers // 假设返回的数据是作曲家数组
      totalComposers.value = response.total // 假设返回的总数在 response.total 中
    } catch (error) {
      console.error(error)
      ElMessage.error('获取作曲家列表失败')
    }
  }

  // 处理页码变化
  const handleCurrentChange = (page) => {
    currentPage.value = page
    fetchComposers() // 获取新的作曲家列表
  }

  // 显示添加作曲家对话框
  const showAddComposerDialog = () => {
    newComposer.value = {name: '', genre: '', birth_date: null, death_date: null, bio: '', image_path: ''}
    addComposerDialogVisible.value = true
  }

  // 处理图片上传成功
  const handleImageUploadSuccess = (response, file) => {
    newComposer.value.image_path = response.url
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

  // 添加作曲家
  const addComposer = async () => {
    try {
      // 格式化日期
      if (newComposer.value.birth_date) {
        newComposer.value.birth_date = newComposer.value.birth_date.toISOString().split('T')[0] // 转换为 YYYY-MM-DD
      }
      if (newComposer.value.death_date) {
        newComposer.value.death_date = newComposer.value.death_date.toISOString().split('T')[0] // 转换为 YYYY-MM-DD
      }

      await axios.post('/composers', newComposer.value) // 替换为实际的 API 路径
      ElMessage.success('作曲家添加成功')
      addComposerDialogVisible.value = false
      fetchComposers() // 刷新作曲家列表
    } catch (error) {
      console.error(error)
      ElMessage.error('添加作曲家失败')
    }
  }

  // 显示编辑作曲家对话框
  const showEditComposerDialog = (composer) => {
    editComposer.value = {...composer} // 复制作曲家信息
    editComposerDialogVisible.value = true
  }

  // 更新作曲家
  const updateComposer = async () => {
    try {
      // 格式化日期
      if (editComposer.value.birth_date instanceof Date) {
        editComposer.value.birth_date = editComposer.value.birth_date.toISOString().split('T')[0] // 转换为 YYYY-MM-DD
      }
      if (editComposer.value.death_date instanceof Date) {
        editComposer.value.death_date = editComposer.value.death_date.toISOString().split('T')[0] // 转换为 YYYY-MM-DD
      }

      await axios.put(`/composers/${editComposer.value.id}`, editComposer.value) // 替换为实际的 API 路径
      ElMessage.success('作曲家更新成功')
      editComposerDialogVisible.value = false
      fetchComposers() // 刷新作曲家列表
    } catch (error) {
      console.error(error)
      ElMessage.error('更新作曲家失败')
    }
  }

  // 删除作曲家
  const deleteComposer = async (id) => {
    try {
      await axios.delete(`/composers/${id}`) // 替换为实际的 API 路径
      ElMessage.success('作曲家删除成功')
      fetchComposers() // 刷新作曲家列表
    } catch (error) {
      console.error(error)
      ElMessage.error('删除作曲家失败')
    }
  }

  // 组件挂载时获取作曲家列表和流派列表
  onMounted(fetchComposers)
  onMounted(fetchGenres)
</script>

<style scoped>
  .composer-management {
    padding: 20px;
  }
</style>

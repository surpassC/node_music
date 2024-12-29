<template>
  <div class="music-management">
    <h1>音乐管理</h1>
    <el-button type="primary" @click="showAddMusicDialog">添加音乐</el-button>

    <el-table :data="musicList" style="width: 100%">
      <el-table-column prop="title" label="音乐标题" min-width="150" />
      <el-table-column label="封面" min-width="80">
        <template #default="scope">
          <img v-if="scope.row.photo_path" :src="scope.row.photo_path" alt="封面" width="50" />
        </template>
      </el-table-column>
      <el-table-column label="音频" min-width="150">
        <template #default="scope">
          <audio v-if="scope.row.file_path" :src="scope.row.file_path" controls></audio>
        </template>
      </el-table-column>
      <el-table-column prop="composerName" label="作曲家" min-width="100" />
      <el-table-column prop="genreName" label="流派" min-width="100" />
      <el-table-column prop="information" label="描述" min-width="200" />
      <el-table-column label="操作" min-width="150">
        <template #default="scope">
          <el-button @click="showEditMusicDialog(scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteMusic(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalMusic"
      layout="total, prev, pager, next, jumper" />

    <el-dialog title="添加音乐" v-model="addMusicDialogVisible">
      <el-form :model="newMusic">
        <el-form-item label="标题" :rules="[{required: true, message: '请输入音乐标题', trigger: 'blur'}]">
          <el-input v-model="newMusic.title" />
        </el-form-item>
        <el-form-item label="作曲家" :rules="[{required: true, message: '请选择作曲家', trigger: 'blur'}]">
          <el-select v-model="newMusic.composers_id" placeholder="选择作曲家">
            <el-option v-for="composer in composers" :key="composer.id" :label="composer.name" :value="composer.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="流派" :rules="[{required: true, message: '请选择流派', trigger: 'blur'}]">
          <el-select v-model="newMusic.genre_id" placeholder="选择流派">
            <el-option v-for="genre in genres" :key="genre.id" :label="genre.name" :value="genre.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="信息">
          <el-input type="textarea" v-model="newMusic.information" />
        </el-form-item>
        <el-form-item label="音频文件" :rules="[{required: true, message: '请上传音频文件', trigger: 'change'}]">
          <el-upload
            class="upload-demo"
            action="http://localhost:3000/api/upload/audio"
            name="audio"
            :on-success="handleAudioUploadSuccess"
            :show-file-list="false"
            :before-upload="beforeAudioUpload">
            <el-button size="small" type="primary">上传音频文件</el-button>
          </el-upload>
          <div v-if="newMusic.file_path" style="margin-top: 10px">已上传: {{ newMusic.file_path }}</div>
        </el-form-item>
        <el-form-item label="封面图片" :rules="[{required: true, message: '请上传封面图片', trigger: 'change'}]">
          <el-upload
            class="upload-demo"
            action="http://localhost:3000/api/upload"
            name="image"
            :on-success="handlePhotoUploadSuccess"
            :show-file-list="false"
            :before-upload="beforePhotoUpload">
            <el-button size="small" type="primary">上传封面图片</el-button>
          </el-upload>
          <div v-if="newMusic.photo_path" style="margin-top: 10px">已上传: <img width="50" :src="newMusic.photo_path" alt="" /></div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addMusicDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMusic">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑音乐" v-model="editMusicDialogVisible">
      <el-form :model="editMusic">
        <el-form-item label="标题" :rules="[{required: true, message: '请输入音乐标题', trigger: 'blur'}]">
          <el-input v-model="editMusic.title" />
        </el-form-item>
        <el-form-item label="作曲家" :rules="[{required: true, message: '请选择作曲家', trigger: 'blur'}]">
          <el-select v-model="editMusic.composers_id" placeholder="选择作曲家">
            <el-option v-for="composer in composers" :key="composer.id" :label="composer.name" :value="composer.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="流派" :rules="[{required: true, message: '请选择流派', trigger: 'blur'}]">
          <el-select v-model="editMusic.genre_id" placeholder="选择流派">
            <el-option v-for="genre in genres" :key="genre.id" :label="genre.name" :value="genre.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="信息">
          <el-input type="textarea" v-model="editMusic.information" />
        </el-form-item>
        <el-form-item label="音频文件">
          <el-upload
            class="upload-demo"
            action="http://localhost:3000/api/upload/audio"
            name="audio"
            :on-success="handleAudioUploadSuccess"
            :show-file-list="false"
            :before-upload="beforeAudioUpload">
            <el-button size="small" type="primary">上传音频文件</el-button>
          </el-upload>
          <div v-if="editMusic.file_path" style="margin-top: 10px"><audio width="100%" :src="editMusic.file_path" controls></audio></div>
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload
            class="upload-demo"
            action="http://localhost:3000/api/upload"
            name="image"
            :on-success="handlePhotoUploadSuccess"
            :show-file-list="false"
            :before-upload="beforePhotoUpload">
            <el-button size="small" type="primary">上传封面图片</el-button>
          </el-upload>
          <div v-if="editMusic.photo_path" style="margin-top: 10px"><img width="50" :src="editMusic.photo_path" alt="" /></div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editMusicDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateMusic">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
  import {ref, onMounted} from 'vue'
  import axios from '../utils/axios' // 引入封装的 Axios
  import {ElMessage} from 'element-plus'

  const musicList = ref([])
  const composers = ref([]) // 存储作曲家列表
  const genres = ref([]) // 存储流派列表
  const addMusicDialogVisible = ref(false)
  const editMusicDialogVisible = ref(false)
  const newMusic = ref({
    title: '',
    composers_id: '',
    genre_id: '',
    information: '',
    file_path: '',
    photo_path: '' // 新增封面图片路径字段
  })
  const editMusic = ref({
    id: null,
    title: '',
    composers_id: '',
    genre_id: '',
    information: '',
    file_path: '',
    photo_path: '' // 新增封面图片路径字段
  })

  const currentPage = ref(1) // 当前页码
  const pageSize = ref(10) // 每页显示的音乐数量
  const totalMusic = ref(0) // 总音乐数量

  // 获取音乐列表
  const fetchMusicList = async () => {
    try {
      const response = await axios.get(`/music?page=${currentPage.value}&limit=${pageSize.value}`)
      musicList.value = response.musicList // 假设返回的数据是音乐数组
      totalMusic.value = response.total // 假设返回的总数在 response.total 中
    } catch (error) {
      console.error(error)
      ElMessage.error('获取音乐列表失败')
    }
  }

  // 处理页码变化
  const handleCurrentChange = (page) => {
    currentPage.value = page
    fetchMusicList() // 获取新的音乐列表
  }
  // 获取作曲家列表
  const fetchComposers = async () => {
    try {
      const response = await axios.get('/composers') // 替换为实际的 API 路径
      composers.value = response
    } catch (error) {
      console.error(error)
      ElMessage.error('获取作曲家列表失败')
    }
  }

  // 获取流派列表
  const fetchGenres = async () => {
    try {
      const response = await axios.get('/genres') // 替换为实际的 API 路径
      genres.value = response
    } catch (error) {
      console.error(error)
      ElMessage.error('获取流派列表失败')
    }
  }

  // 显示添加音乐对话框
  const showAddMusicDialog = () => {
    newMusic.value = {title: '', composers_id: '', genre_id: '', information: '', file_path: '', photo_path: ''}
    addMusicDialogVisible.value = true
  }

  // 添加音乐
  const addMusic = async () => {
    try {
      await axios.post('/music', newMusic.value) // 替换为实际的 API 路径
      ElMessage.success('音乐添加成功')
      addMusicDialogVisible.value = false
      fetchMusicList() // 刷新音乐列表
    } catch (error) {
      console.error(error)
      ElMessage.error('添加音乐失败')
    }
  }

  // 显示编辑音乐对话框
  const showEditMusicDialog = (music) => {
    editMusic.value = {...music} // 复制作曲家信息
    editMusicDialogVisible.value = true
  }

  // 更新音乐
  const updateMusic = async () => {
    try {
      await axios.put(`/music/${editMusic.value.id}`, editMusic.value) // 替换为实际的 API 路径
      ElMessage.success('音乐更新成功')
      editMusicDialogVisible.value = false
      fetchMusicList() // 刷新音乐列表
    } catch (error) {
      console.error(error)
      ElMessage.error('更新音乐失败')
    }
  }

  // 删除音乐
  const deleteMusic = async (id) => {
    try {
      await axios.delete(`/music/${id}`) // 替换为实际的 API 路径
      ElMessage.success('音乐删除成功')
      fetchMusicList() // 刷新音乐列表
    } catch (error) {
      console.error(error)
      ElMessage.error('删除音乐失败')
    }
  }

  // 处理音频上传成功
  const handleAudioUploadSuccess = (response, file) => {
    if (addMusicDialogVisible.value) {
      newMusic.value.file_path = response.url // 假设返回的 URL 是音频文件的路径
    } else {
      editMusic.value.file_path = response.url // 假设返回的 URL 是音频文件的路径
    }
  }

  // 处理封面图片上传成功
  const handlePhotoUploadSuccess = (response, file) => {
    if (addMusicDialogVisible.value) {
      newMusic.value.photo_path = response.url // 假设返回的 URL 是封面图片的路径
    } else {
      editMusic.value.photo_path = response.url // 假设返回的 URL 是封面图片的路径
    }
  }

  // 上传前的检查
  const beforeAudioUpload = (file) => {
    const isMP3 = file.type === 'audio/mpeg'
    const isWAV = file.type === 'audio/wav'
    const isOGG = file.type === 'audio/ogg'
    const isAudio = isMP3 || isWAV || isOGG

    if (!isAudio) {
      ElMessage.error('上传音频文件只能是 MP3、WAV 或 OGG 格式!')
    }
    return isAudio
  }

  // 上传前的检查
  const beforePhotoUpload = (file) => {
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    const isGIF = file.type === 'image/gif'
    const isImage = isJPG || isPNG || isGIF

    if (!isImage) {
      ElMessage.error('上传封面图片只能是 JPG、PNG 或 GIF 格式!')
    }
    return isImage
  }

  // 组件挂载时获取音乐列表、作曲家列表和流派列表
  onMounted(() => {
    fetchComposers()
    fetchGenres()
    fetchMusicList()
  })
</script>

<style scoped>
  .music-management {
    padding: 20px;
  }
</style>

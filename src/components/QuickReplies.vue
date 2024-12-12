<template>
  <div class="content-group">
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索分组或话术"
        clearable
        class="search-input">
      </el-input>
      <el-button
        icon="el-icon-plus"
        title="创建分组"
        type="primary"
        class="add-group-button"
        @click="showAddGroupDialog = true">
        新增分组
      </el-button>
    </div>

    <div v-for="group in filteredGroups" :key="group.id" class="group">
      <div class="group-header" @click="toggleGroup(group)">
        <i :class="group.expanded ? 'el-icon-folder-opened' : 'el-icon-folder'" class="folder-icon"></i>
        <span class="group-name">{{ group.name }}</span>
        <div class="action-buttons">
          <el-button 
            v-if="group.messages.length === 0"
            icon="el-icon-plus"
            title="新增"
            type="text"
            class="action-button"
            @click.stop="addContent(group)">
          </el-button>
          <el-button
            icon="el-icon-edit"
            title="编辑"
            type="text"
            class="action-button"
            @click.stop="editGroup(group)">
          </el-button>
          <el-button
            icon="el-icon-delete"
            title="删除"
            type="text"
            class="action-button"
            @click.stop="confirmDeleteGroup(group)">
          </el-button>
        </div>
      </div>

      <div v-if="group.expanded || isSearching" class="msglist">
        <div
          v-for="msg in group.messages"
          :key="msg.id"
          class="msg-card">
          <div class="msg-header" @click="toggleMessage(msg)">
            <i :class="getMessageIcon(msg.type)" class="msg-icon"></i>
            <span class="msg-describe">{{ msg.describe }}</span>
            <div class="msg-action-buttons">
              <el-button
                icon="el-icon-s-promotion"
                type="text"
                title="发送"
                class="action-button"
                @click.stop="sendMessage(msg)"
              >
              </el-button>
              <el-button
                icon="el-icon-edit"
                title="编辑"
                type="text"
                class="action-button"
                @click.stop="editMessage(msg)">
              </el-button>
              <el-button
                icon="el-icon-delete"
                title="删除"
                type="text"
                class="action-button"
                @click.stop="confirmDeleteMessage(msg)">
              </el-button>
            </div>
          </div>

          <div v-if="msg.expanded" class="msg-body">
              <div v-if="msg.type==1">{{ msg.body }}</div>
              <img v-if="msg.type==2" :src="msg.body" alt="图片" style="max-width: 100%;">
              <audio v-if="msg.type==3" :src="msg.body" controls></audio>
          </div>

        </div>
        <el-button
          v-if="!group.children.length"
          icon="el-icon-plus"
          type="text"
          class="add-message-button"
          @click="addMessage(group)">
          创建话术
        </el-button>
      </div>

      <template v-if="group.expanded">
        <div v-for="child in group.children" :key="child.id" class="child-groups">
          <div class="group-header" @click="toggleGroup(child)">
            <i :class="child.expanded ? 'el-icon-folder-opened' : 'el-icon-folder'" class="folder-icon"></i>
            <span class="group-name">{{ child.name }}</span>
            <div class="action-buttons">
              <el-button
                v-if="child.messages.length === 0"
                icon="el-icon-plus"
                title="新增"
                type="text"
                class="action-button"
                @click.stop="addContent(child)">
              </el-button>
              <el-button
                icon="el-icon-edit"
                title="编辑"
                type="text"
                class="action-button"
                @click.stop="editGroup(child)">
              </el-button>
              <el-button
                icon="el-icon-delete"
                title="删除"
                type="text"
                class="action-button"
                @click.stop="confirmDeleteGroup(child)">
              </el-button>
            </div>
          </div>

          <div v-if="child.expanded || isSearching" class="msglist">
            <div
              v-for="msg in child.messages"
              :key="msg.id"
              class="msg-card">
              <div class="msg-header" @click="toggleMessage(msg)">
                <i :class="getMessageIcon(msg.type)" class="msg-icon"></i>
                <span class="msg-describe">{{ msg.describe }}</span>
                <div class="msg-action-buttons">
                  <el-button
                    icon="el-icon-s-promotion"
                    title="发送"
                    type="text"
                    class="action-button"
                    @click.stop="sendMessage(msg)"
                  >
                  </el-button>
                  <el-button
                    icon="el-icon-edit"
                    title="编辑"
                    type="text"
                    class="action-button"
                    @click.stop="editMessage(msg)">
                  </el-button>
                  <el-button
                    icon="el-icon-delete"
                    title="删除"
                    type="text"
                    class="action-button"
                    @click.stop="confirmDeleteMessage(msg)">
                  </el-button>
                  
                </div>
              </div>
              <div v-if="msg.expanded" class="msg-body">
                  <div v-if="msg.type==1">{{ msg.body }}</div>
                  <img v-if="msg.type==2" :src="msg.body" alt="图片" style="max-width: 100%;">
                  <audio v-if="msg.type==3" :src="msg.body" controls></audio>
              </div>
            </div>
            <el-button
              v-if="!child.children.length"
              icon="el-icon-plus"
              title="创建话术"
              type="text"
              class="add-message-button"
              @click="addMessage(child)">
              创建话术
            </el-button>
          </div>

          <template v-if="child.expanded">
            <div v-for="subChild in child.children" :key="subChild.id" class="child-groups">
              <div class="group-header" @click="toggleGroup(subChild)">
                <i :class="subChild.expanded ? 'el-icon-folder-opened' : 'el-icon-folder'" class="folder-icon"></i>
                <span class="group-name">{{ subChild.name }}</span>
                <div class="action-buttons">
                  <el-button
                    icon="el-icon-edit"
                    title="编辑"
                    type="text"
                    class="action-button"
                    @click.stop="editGroup(subChild)">
                  </el-button>
                  <el-button
                    icon="el-icon-delete"
                    title="删除"
                    type="text"
                    class="action-button"
                    @click.stop="confirmDeleteGroup(subChild)">
                  </el-button>
                </div>
              </div>

              <div v-if="subChild.expanded || isSearching" class="msglist">
                <div
                  v-for="msg in subChild.messages"
                  :key="msg.id"
                  class="msg-card">
                  <div class="msg-header" @click="toggleMessage(msg)">
                    <i :class="getMessageIcon(msg.type)" class="msg-icon"></i>
                    <span class="msg-describe">{{ msg.describe }}</span>
                    <div class="msg-action-buttons">
                      <el-button
                        icon="el-icon-s-promotion"
                        title="发送"
                        type="text"
                        class="action-button"
                        @click.stop="sendMessage(msg)"
                      >
                      </el-button>
                      <el-button
                        icon="el-icon-edit"
                        title="编辑"
                        type="text"
                        class="action-button"
                        @click.stop="editMessage(msg)">
                      </el-button>
                      <el-button
                        icon="el-icon-delete"
                        title="删除"
                        type="text"
                        class="action-button"
                        @click.stop="confirmDeleteMessage(msg)">
                      </el-button>
                    </div>
                  </div>
                  <div v-if="msg.expanded" class="msg-body">
                      <div v-if="msg.type==1">{{ msg.body }}</div>
                      <img v-if="msg.type==2" :src="msg.body" style="max-width: 100%;">
                      <audio v-if="msg.type==3" :src="msg.body" controls></audio>
                  </div>
                </div>
                <el-button
                  v-if="!subChild.children.length"
                  icon="el-icon-plus"
                  title="创建话术"
                  type="text"
                  class="add-message-button"
                  @click="addMessage(subChild)">
                  创建话术
                </el-button>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>

    <!-- Add Group Dialog -->
    <el-dialog title="新增分组" :visible.sync="showAddGroupDialog">
      <el-input v-model="newGroupName" placeholder="请输入分组名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddGroupDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddGroup">确认</el-button>
      </span>
    </el-dialog>

    <!-- Edit Message Dialog -->
    <el-dialog title="编辑消息" :visible.sync="showEditMessageDialog">
      <el-form :model="editMessageData">
        <el-form-item label="描述">
          <el-input v-model="editMessageData.describe"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="editMessageData.type" placeholder="请选择">
            <el-option label="文本" :value="1"></el-option>
            <el-option label="图片" :value="2"></el-option>
            <el-option label="音频" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="editMessageData.body"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditMessageDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmEditMessage">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      //这里是所有分组的数据结构 expanded是展开还是收起 parentId是上级分组id
      rawGroups: [
        { id: 1, name: "招呼常用", expanded: false, parentId: null },
        { id: 2, name: "营销话术", expanded: false, parentId: null },
        { id: 3, name: "子级分组", expanded: false, parentId: 2 },
        { id: 4, name: "主", expanded: false, parentId: null },
        { id: 5, name: "子分组1", expanded: false, parentId: 4 },
        { id: 6, name: "子分组2", expanded: false, parentId: 5 }
      ],
      //这里是所有消息内容结构 
      messages: [
        { id: 1, type: 1, body: "你好我是张三", describe: "首次联系", expanded: false, groupId: 1 },
        { id: 2, type: 2, body: "https://www.baidu.com/1.jpg", describe: "介绍自己的生活照", expanded: false, groupId: 1 },
        { id: 3, type: 1, body: "文本内容", describe: "这是内容的描述", expanded: false, groupId: 3 },
        { id: 4, type: 2, body: "https://www.baidu.com/1.jpg", describe: "这是图片的描述", expanded: false, groupId: 3 },
        { id: 5, type: 1, body: "文本内容", describe: "这是内容的描述", expanded: false, groupId: 6 },
        { id: 6, type: 2, body: "https://www.baidu.com/1.jpg", describe: "这是图片的描述", expanded: false, groupId: 6 },
        { id: 7, type: 3, body: "https://www.baidu.com/1.mp3", describe: "这是音频的描述", expanded: false, groupId: 6 }
      ],
      groups: [],
      showAddGroupDialog: false,
      showEditMessageDialog: false,
      newGroupName: '',
      editMessageData: { id: null, type: 1, body: '', describe: '' }
    };
  },
  created() {
    this.groups = this.buildTreeStructure();
  },
  computed: {
    isSearching() {
      return this.searchQuery.trim() !== '';
    },
    filteredGroups() {
      if (!this.searchQuery) {
        return this.groups;
      }
      const query = this.searchQuery.toLowerCase();
      return this.groups.filter(group => group.name.toLowerCase().includes(query));
    }
  },
  methods: {

    //将数据编译成树形结构
    buildTreeStructure() {
      const groupMap = {};
      this.rawGroups.forEach(group => {
        group.children = [];
        group.messages = this.getMessagesByGroupId(group.id);
        group.expanded = false;
        groupMap[group.id] = group;
      });

      const tree = [];
      this.rawGroups.forEach(group => {
        if (group.parentId === null) {
          tree.push(group);
        } else {
          const parent = groupMap[group.parentId];
          if (parent) {
            parent.children.push(group);
          } else {
            console.warn(`Parent with ID ${group.parentId} not found for group ID ${group.id}`);
          }
        }
      });

      return tree;
    },
    toggleGroup(group) {
      group.expanded = !group.expanded;
    },
    toggleMessage(msg) {
      msg.expanded = !msg.expanded;
    },

    // 确认添加子级分组 id由后端返回后再插入
    addContent(group) {
      const newSubGroup = {
        id: Date.now(),
        name: `新子分组 ${group.children.length + 1}`,
        expanded: false,
        parentId: group.id,
        children: [],
        messages: []
      };
      group.children.push(newSubGroup);
      this.$forceUpdate();
      console.log('Add content to:', group, 'New Subgroup:', newSubGroup);
    },
    editGroup(group) {
      this.newGroupName = group.name;
      this.showAddGroupDialog = true;
      this.currentEditGroup = group;
    },

    // 确认添加顶级分组 id由后端返回后再插入
    confirmAddGroup() {
      if (this.newGroupName.trim()) {
        if (this.currentEditGroup) {
          this.currentEditGroup.name = this.newGroupName;
          this.currentEditGroup = null;
        } else {
          const newGroup = {
            id: Date.now(),
            name: this.newGroupName.trim(),
            expanded: false,
            parentId: null,
            children: [],
            messages: []
          };
          this.groups.push(newGroup);
        }
        this.showAddGroupDialog = false;
        this.newGroupName = '';
      }
    },
    confirmDeleteGroup(group) {
      this.$confirm('确认删除该分组及其内容吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteContent(group);
      }).catch(() => {});
    },

    //删除分组 需要先到数据库删除 返回true后再来执行这句
    deleteContent(group) {
      const parent = this.findParentGroup(this.groups, group.parentId);
      if (parent) {
        const index = parent.children.findIndex(g => g.id === group.id);
        if (index !== -1) parent.children.splice(index, 1);
      } else {
        const index = this.groups.findIndex(g => g.id === group.id);
        if (index !== -1) this.groups.splice(index, 1);
      }
      this.$forceUpdate();
      console.log('Delete content:', group);
    },


    //添加消息
    addMessage(group) {
      this.editMessageData = { id: null, type: 1, body: '', describe: '', groupId: group.id };
      this.showEditMessageDialog = true;
    },

    //触发编辑消息
    editMessage(msg) {
      this.editMessageData = { ...msg };
      this.showEditMessageDialog = true;
    },

    //确认编辑消息内容 id由后端返回后再插入
    confirmEditMessage() {
      if (this.editMessageData.describe.trim() && this.editMessageData.body.trim()) {
        if (this.editMessageData.id === null) {
          // Adding a new message
          const newMsg = {
            ...this.editMessageData,
            id: Date.now(),
            expanded: false
          };
          this.messages.push(newMsg);
          const group = this.findGroupById(this.groups, newMsg.groupId);
          if (group) group.messages.push(newMsg);
        } else {
          // Editing an existing message
          const index = this.messages.findIndex(m => m.id === this.editMessageData.id);
          if (index !== -1) {
            // Update global messages array
            this.messages.splice(index, 1, { ...this.editMessageData });

            // Update group-specific messages array
            const group = this.findGroupById(this.groups, this.editMessageData.groupId);
            if (group) {
              const groupMessageIndex = group.messages.findIndex(m => m.id === this.editMessageData.id);
              if (groupMessageIndex !== -1) {
                group.messages.splice(groupMessageIndex, 1, { ...this.editMessageData });
              }
            }
          }
        }
        this.showEditMessageDialog = false;
        //this.$forceUpdate(); // Typically not necessary
      }
    },
    confirmDeleteMessage(msg) {
      this.$confirm('确认删除该消息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMessage(msg);
      }).catch(() => {});
    },

    //删除消息 需要先到数据库删除 返回true后再来执行这句
    deleteMessage(msg) {
      const group = this.findGroupById(this.groups, msg.groupId);
      if (group) {
        const index = group.messages.findIndex(m => m.id === msg.id);
        if (index !== -1) {
          group.messages.splice(index, 1);
          this.$forceUpdate();
          console.log('Delete message:', msg);
        }
      }
    },
    sendMessage(msg){
      console.log('sendMessage:', msg);
    },

    //查找分组的id
    findGroupById(groups, groupId) {
      for (const group of groups) {
        if (group.id === groupId) {
          return group;
        } else if (group.children.length > 0) {
          const foundGroup = this.findGroupById(group.children, groupId);
          if (foundGroup) return foundGroup;
        }
      }
      return null;
    },
    getComponentByType(type) {
      switch (type) {
        case 1: return 'TextMessage';
        case 2: return 'ImageMessage';
        case 3: return 'AudioMessage';
        default: return 'UnknownMessage';
      }
    },
    getMessageIcon(type) {
      switch (type) {
        case 1: return 'el-icon-document';
        case 2: return 'el-icon-picture';
        case 3: return 'el-icon-headset';
        default: return 'el-icon-question';
      }
    },
    getMessagesByGroupId(groupId) {
      return this.messages.filter(msg => msg.groupId === groupId);
    },
    findParentGroup(groups, parentId) {
      for (const group of groups) {
        if (group.id === parentId) {
          return group;
        } else if (group.children.length > 0) {
          const parent = this.findParentGroup(group.children, parentId);
          if (parent) return parent;
        }
      }
      return null;
    }
  }
};
</script>




<style scoped>
.content-group {
  margin: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.search-input {
  flex: 1;
}

.add-group-button {
  margin-left: 10px;
}

.group-header {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.folder-icon {
  padding-right: 5px;
}

.group-name {
  margin-right: 10px;
  flex-grow: 1; /* This allows the text to take up the available space */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left; /* Ensures text is left-aligned */
}

.action-buttons {
  display: flex;
  gap: 5px; /* Adds space between buttons */
}

.msglist {
  padding-left: 20px;
  border-left: 1px dashed #dcdcdc;
}

.msg-card {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
  transition: all 0.3s ease;
}

.msg-header {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.msg-icon {
  margin-right: 10px;
}

.msg-describe {
  flex-grow: 1; /* Allows the description to take up available space */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left; /* Ensures text is left-aligned */
}

.msg-body {
  padding: 10px;
  color: #606266;
  text-align: left;
  margin-left: 20px;
}

.child-groups {
  margin-left: 20px;
}

.msg-action-buttons {
  display: flex;
  gap: 5px; /* Adds space between buttons */
}

.add-message-button {
  margin-top: 10px;
  display: block;
}
</style>
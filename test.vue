<template>
  <pg-modal v-model="visible" width="10.6rem">
    <div class="add-group">
      <div class="header">
        <div class="title">
            <img alt="" class="icon" src="@/assets/icon/common/icon-title.png" />
            {{ form.id ? 'Edit Group' : 'Add Group' }}
        </div>
      </div>
      <div v-if="!this.isAdminUser" class="body scroll">
        <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
        >
            <a-form-model-item ref="name" label="Project Name" prop="name">
              <a-input style="width: 3rem" v-model="form.name" placeholder="Please enter" size="large" />
            </a-form-model-item>
            <a-form-model-item ref="desc" label="Project Description" prop="desc">
              <a-textarea v-model="form.remark" placeholder="Please enter" :rows="4" />
            </a-form-model-item>
            <a-form-model-item ref="admin" label="Project Admin" prop="admin">
              <SelectUsers v-model="form.projectAdmins" />
            </a-form-model-item>
            <a-form-model-item ref="admin" label="Project Members" prop="admin">
              <SelectUsers v-model="form.projectMembers" />
            </a-form-model-item>
        </a-form-model>
      </div>
      <div v-if="this.isAdminUser" class="body scroll">
        <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
        >
            <!-- <a-form-model-item ref="name" label="User Group Name" prop="name">
              <a-input style="width: 3rem" v-model="form.name" placeholder="Please enter" size="large" />
            </a-form-model-item> -->
            <a-form-model-item  label="Application" prop="selectedApplication" :rules="[{
              required : true,
              message: 'Please select an application',
              trigger: 'change'
            }]">
              <a-select
                v-model="form.selectedApplication"
                placeholder="Please Select Application"
                allowClear
                showSearch
                style="width: 1.65rem"
              >
                <a-select-option
                  v-for="(item, i) in userSecurityConfig.applications"
                  :key="i"
                  :value="item"
                  >{{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item>
              <template #label>
                <span style="color: red;">*</span> Roles
              </template>
              <a-select
                mode="multiple"
                v-model="form.selectedRoles"
                @change="handleSelectRoles"
                placeholder="Please select roles"
                style="width: 400px"
              >
                <a-select-option
                  v-for="(item, i) in userSecurityConfig.applicationRoles"
                  :key="i"
                  :value="item"
                  >{{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item  v-if="form.selectedRoles.length > 0" ref="admin">
              <template #label>
                <span style="color: red;">*</span> Permissions
              </template>
              <a-select
                mode="multiple"
                v-model="form.selectedPermissions"
                placeholder="Please select"
                disabled="true"
                @change="handleSelectPermissions"
                style="width: 400px"
              >
                <a-select-option
                  v-for="(item, i) in userSecurityConfig.rolePermissions"
                  :key="i"
                  :value="item"
                  >{{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <!-- <a-form-model-item ref="desc" label="User Group Description" prop="desc">
              <a-textarea v-model="form.remark" placeholder="Please enter" :rows="4" />
            </a-form-model-item> -->
            <a-form-model-item ref="admin" label="User Group Members" prop="admin">
              <SelectUsers v-model="form.projectMembers" />
            </a-form-model-item>
        </a-form-model>
      </div>
      <div class="footer">
        <a-button @click="cancel">Cancel</a-button>
        <a-button type="primary" @click="onSubmit">Transfer</a-button>
      </div>
    </div>
  </pg-modal>
</template>

<script>
import SelectUsers from '@/components/SelectUsers'
import { queryByIdUserGroup, createUserGroup, createUserGroupForAdmin, updateUserGroup } from '@/services/manageUserGroup'
import { getRolePermissions, adminValidation, getApplications, editAdmin, getApplicationRoles } from '../../../services/manageUserGroup'

class UserGroup {
  constructor (data = {}) {
    const {
      id,
      name,
      remark,
      dataVersion = 0,
      status = 'Normal',
      projectAdmins,
      projectMembers,
      selectedApplication = '',
      selectedRoles = [],
      selectedPermissions = [],
      userGroupType = 'PROJECT_GROUP'
    } = data
    this.id = id
    this.name = name
    this.remark = remark
    this.dataVersion = dataVersion
    this.status = status
    this.selectedApplication = selectedApplication
    this.selectedRoles = selectedRoles
    this.selectedPermissions = selectedPermissions
    this.projectAdmins = projectAdmins || []
    this.projectMembers = projectMembers || []
    this.userGroupType = userGroupType
  }
}

export default {
  components: {
    SelectUsers
  },
  props: {
    isAdminUser: {
      type: Boolean
    }
  },
  data () {
    return {
      visible: false,
      isPipelineAdminUser: false,
      switchRole: false,
      form: new UserGroup(),
      userSecurityConfig: {
        applications: [],
        applicationRoles: [],
        rolePermissions: []
      },
      rules: {
        name: [
          { required: true, message: 'Please input Project Name', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (data, switchRole) {
      this.switchRole = switchRole
      if (switchRole === false) {
        if (data) {
          this.visible = true
          queryByIdUserGroup(data.id).then(res => {
            this.form = new UserGroup(res)
          })
        } else {
          this.visible = true
        }
      } else {
        if (data) {
          adminValidation().then(rolesRes => {
            const appRoles = rolesRes
            this.userSecurityConfig.applicationRoles = appRoles
            if (!(appRoles === undefined || appRoles.length === 0)) {
              this.isPipelineAdminUser = true
              getApplications().then(applications => { this.userSecurityConfig.applications = applications })
            }
            let pipelineAdmin = []
            if (data.pipelineAdmin.length > 0) {
              data.pipelineAdmin.forEach(admin => {
                let tempAdmin = {
                  firstName: admin.split(' ')[0],
                  lastName: admin.split(' ')[1]
                }
                pipelineAdmin.push(tempAdmin)
              })
            }
            let roles = []
            // data.role.forEach(r => {
            //   roles.push(r)
            // })
            roles.push(data.role)
            let value = {
              name: data.role,
              selectedApplication: data.application,
              selectedRoles: roles,
              selectedPermissions: data.permissions,
              remark: data.description,
              projectMembers: pipelineAdmin
            }
            this.form = new UserGroup(value)
            this.visible = true
          })
        } else {
          this.visible = true
        }
      }
      getApplicationRoles().then(rolesRes => {
        const appRoles = rolesRes
        this.userSecurityConfig.applicationRoles = appRoles
        if (!(appRoles === undefined || appRoles.length === 0)) {
          this.isPipelineAdminUser = true
          getApplications().then(applications => { this.userSecurityConfig.applications = applications })
        }
      })
    },
    handleSelectRoles () {
      if (!this.form.selectedRoles) return
      if (this.form.selectedRoles.length === 0) {
        this.validationRole = 'error'
        this.validationHelpForRole = 'Please select roles here'
        this.userSecurityConfig.rolePermissions = []
      } else {
        this.validationRole = 'success'
        this.validationHelpForRole = ''
        const roles = this.form.selectedRoles.length === 1 ? this.form.selectedRoles[0] : this.form.selectedRoles
        getRolePermissions({ roles }).then(permRes => {
          const permissions = permRes
          this.userSecurityConfig.rolePermissions = permissions
          this.form.selectedPermissions = this.userSecurityConfig.rolePermissions
        })
      }
    },
    handleSelectPermissions () {
      if (!this.form.selectedPermissions) return
      if (this.form.selectedPermissions.length === 0) {
        this.validationPermission = 'error'
        this.validationHelpForPermission = 'Please select permissions here'
      } else {
        this.validationPermission = 'success'
        this.validationHelpForPermission = ''
      }
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let action = 'E'
          if (this.switchRole === undefined) {
            this.switchRole = this.isAdminUser
            action = 'A'
          }
          console.log(this.switchRole)
          if (!this.switchRole) {
            if (!this.form.id) {
              createUserGroup(this.form).then(res => {
                this.$message.success('Created successfully！')
                this.$emit('created', true)
                this.cancel()
              })
            } else {
              updateUserGroup(this.form).then(res => {
                this.$message.success('Updated Successfully！')
                this.$emit('updated', true)
                this.cancel()
              })
            }
          } else {
            if (action === 'A') {
              if (this.isPipelineAdminUser) {
                const payload = {}
                payload.role = this.form.selectedRoles.join(',')
                payload.permission = [this.form.selectedPermissions.join(' & ')]
                payload.application = this.form.selectedApplication
                payload.userGroupMember = this.form.projectMembers.map(({ firstName, lastName }) => firstName + ' ' + lastName)
                createUserGroupForAdmin(payload).then(res => {
                  this.$message.success('Created successfully！')
                  this.$emit('created', true)
                  this.cancel()
                })
              }
            } else {
              if (this.isPipelineAdminUser) {
                let members = []
                this.form.projectMembers.forEach(member => {
                  members.push(member.firstName + ' ' + member.lastName)
                })
                let srole = this.form.selectedRoles.join(',')
                let dataForEdit = {
                  role: srole,
                  permission: this.form.selectedPermissions,
                  application: this.form.selectedApplication,
                  userGroupMember: members
                }
                editAdmin(dataForEdit).then(res => {
                  this.$message.success('Updated successfully!')
                  this.$emit('updated', true)
                  this.cancel()
                })
              }
            }
          }
        } else {
          return false
        }
      })
    },
    cancel () {
      this.form = new UserGroup()
      this.visible = false
    }
  }
}
</script>

<style lang="less">
.add-group {
    padding: 24px 48px;
    background: url('~@/assets/icon/manageUserGroup/bg-add-group.png') no-repeat;
    background-position-x: right;
    background-size: 190px;
    .header {
        .title {
            font-size: 22px;
            font-weight: 600;
            color: #333333;
            line-height: 48px;
            .icon {
                width: 24px;
                height: 24px;
                float: left;
                margin: 12px 12px 0 0;
            }
        }
    }
    .body {
        margin: 12px 0;
        height: 60vh;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .footer {
      text-align: center;
      margin: 24px 0 12px 0;
    }
}
</style>

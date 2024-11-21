<template>
  <div class="profile-container">
    <h2>Tài khoản của tôi</h2>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="avatar">Ảnh đại diện</label>
        <input type="file" @change="onFileChange" />
        <img :src="avatarPreview" alt="Avatar Preview" v-if="avatarPreview" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div class="form-group">
        <label for="phone">Số điện thoại</label>
        <input v-model="phone" type="text" required />
      </div>
      <div class="form-group">
        <label for="address">Địa chỉ</label>
        <input v-model="address" type="text" required />
      </div>
      <button type="submit">Cập nhật</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      phone: '',
      address: '',
      avatar: null,
      avatarPreview: null,
    };
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      this.avatar = file;
      this.avatarPreview = URL.createObjectURL(file);
    },
    updateProfile() {
      alert('Profile updated!');
    },
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #8B4513;
  margin-bottom: 20px;
  font-size: 2em;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input[type="file"] {
  display: block;
  margin-top: 10px;
}

.form-group img {
  display: block;
  max-width: 100px;
  margin-top: 10px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group input[type="email"],
.form-group input[type="text"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #8B4513;
  outline: none;
}

button {
  width: 100%;
  padding: 14px;
  background-color: #8B4513;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #693410;
}
</style>
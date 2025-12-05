<template>
  <div class="user-profile">
    <h2>Thông tin cá nhân</h2>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div v-else class="profile-details">
      <form
        @submit.prevent="handleUpdateProfile"
        class="needs-validation"
        novalidate
      >
        <div class="mb-3">
          <label for="hoLot" class="form-label"
            >Họ<span class="text-danger">*</span></label
          >
          <input
            type="text"
            class="form-control"
            id="hoLot"
            v-model="userProfile.hoLot"
            :class="{ 'is-invalid': errors.hoLot }"
            required
          />
          <div class="invalid-feedback" v-if="errors.hoLot">
            {{ errors.hoLot }}
          </div>
        </div>

        <div class="mb-3">
          <label for="ten" class="form-label"
            >Tên <span class="text-danger">*</span></label
          >
          <input
            type="text"
            class="form-control"
            id="ten"
            v-model="userProfile.ten"
            :class="{ 'is-invalid': errors.ten }"
            required
          />
          <div class="invalid-feedback" v-if="errors.ten">{{ errors.ten }}</div>
        </div>

        <div class="mb-3">
          <label for="ngaySinh" class="form-label">Ngày sinh</label>
          <input
            type="date"
            class="form-control"
            id="ngaySinh"
            v-model="userProfile.ngaySinh"
            :class="{ 'is-invalid': errors.ngaySinh }"
          />
          <div class="invalid-feedback" v-if="errors.ngaySinh">
            {{ errors.ngaySinh }}
          </div>
        </div>

        <div class="mb-3">
          <label for="phai" class="form-label">Giới tính</label>
          <select
            class="form-select"
            id="phai"
            v-model="userProfile.phai"
            :class="{ 'is-invalid': errors.phai }"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          <div class="invalid-feedback" v-if="errors.phai">
            {{ errors.phai }}
          </div>
        </div>

        <div class="mb-3">
          <label for="diaChi" class="form-label">Địa chỉ</label>
          <input
            type="text"
            class="form-control"
            id="diaChi"
            v-model="userProfile.diaChi"
            :class="{ 'is-invalid': errors.diaChi }"
          />
          <div class="invalid-feedback" v-if="errors.diaChi">
            {{ errors.diaChi }}
          </div>
        </div>

        <div class="mb-3">
          <label for="dienThoai" class="form-label">Số điện thoại</label>
          <input
            type="text"
            class="form-control"
            id="dienThoai"
            v-model="userProfile.dienThoai"
            :class="{ 'is-invalid': errors.dienThoai }"
          />
          <div class="invalid-feedback" v-if="errors.dienThoai">
            {{ errors.dienThoai }}
          </div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="userProfile.email"
            :class="{ 'is-invalid': errors.email }"
          />
          <div class="invalid-feedback" v-if="errors.email">
            {{ errors.email }}
          </div>

          <br />
          <div class="mb-3">
            <a href="#" class="text-primary" @click.prevent="showPasswordHelp">
              Quên mật khẩu?
            </a>
          </div>
          <br />
          <div
            v-if="showPasswordMessage"
            class="alert alert-warning alert-dismissible fade show mb-3"
            role="alert"
          >
            Vui lòng liên hệ quản trị viên để được hỗ trợ đổi mật khẩu.
            <button
              type="button"
              class="btn-close"
              @click="showPasswordMessage = false"
            ></button>
          </div>
        </div>

        <div class="text-end">
          <button
            type="button"
            class="btn btn-secondary me-2"
            @click="cancelUpdate"
          >
            Hủy
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? "Đang lưu..." : "Cập nhật thông tin" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { showError, showSuccess } from "@/utils/notifications";
import { useRouter } from "vue-router";

export default {
  name: "UserProfile",
  setup() {
    const showPasswordMessage = ref(false);
    const store = useStore();
    const userProfile = ref({
      hoLot: "",
      ten: "",
      ngaySinh: "",
      phai: "Nam",
      diaChi: "",
      dienThoai: "",
      email: "",
    });

    const router = useRouter(); //
    const errors = ref({});
    const loading = ref(false);
    const error = ref(null); //
    const message = ref(""); //
    const showPasswordHelp = () => {
      showPasswordMessage.value = true;
    };

    // Hàm chuyển đổi định dạng ISO sang yyyy-MM-dd
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      return dateStr.split("T")[0]; // Lấy phần yyyy-MM-dd
    };

    const fetchProfile = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await store.dispatch("auth/updateProfile", {}); // Gọi để lấy profile
        userProfile.value = {
          ...response.data,
          ngaySinh: formatDate(response.data.ngaySinh), // Chuyển đổi định dạng ngày
        };
      } catch (err) {
        error.value = err.message || "Không thể tải thông tin cá nhân";
        showError(error.value);
      } finally {
        loading.value = false;
      }
    };
    const validateForm = () => {
      const newErrors = {};
      if (!userProfile.value.hoLot) newErrors.hoLot = "Họ lót là bắt buộc";
      if (!userProfile.value.ten) newErrors.ten = "Tên là bắt buộc";
      if (
        userProfile.value.ngaySinh &&
        isNaN(new Date(userProfile.value.ngaySinh))
      ) {
        newErrors.ngaySinh = "Ngày sinh không hợp lệ";
      }
      if (!userProfile.value.dienThoai.match(/^\d{10}$/)) {
        newErrors.dienThoai = "Số điện thoại phải gồm 10 chữ số";
      }
      if (
        userProfile.value.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.value.email)
      ) {
        newErrors.email = "Email không hợp lệ";
      }

      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const handleUpdateProfile = async () => {
      if (!validateForm()) return;
      try {
        loading.value = true;
        error.value = null;
        const allowedFields = [
          "hoLot",
          "ten",
          "ngaySinh",
          "phai",
          "diaChi",
          "dienThoai",
          "email",
        ];
        const updateData = Object.fromEntries(
          Object.entries(userProfile.value).filter(([key]) =>
            allowedFields.includes(key)
          )
        );
        // Chuyển đổi lại ngaySinh về ISO nếu cần, nhưng để server xử lý định dạng
        console.log("Sending update data:", updateData); // Debug
        const response = await store.dispatch("auth/updateProfile", updateData);
        userProfile.value = {
          ...response.data,
          ngaySinh: formatDate(response.data.ngaySinh), // Đảm bảo định dạng sau khi cập nhật
        };
        showSuccess(response.data.message || "Cập nhật thông tin thành công");
        message.value = "Cập nhật thông tin thành công";
      } catch (err) {
        error.value = err.message || "Cập nhật thông tin thất bại";
        errors.value = err.response?.data?.errors || {};
        console.error(
          "Update profile error:",
          err.response?.data || err.message
        ); // Debug
        showError(error.value);
        message.value = "Cập nhật thông tin thất bại";
      } finally {
        loading.value = false;
      }
    };

    const clearError = () => {
      store.commit("publisher/SET_ERROR", null); //
    };
    const clearMessage = () => {
      message.value = "";
    };

    const cancelUpdate = () => {
      fetchProfile(); // Lấy lại dữ liệu gốc khi hủy
    };

    onMounted(fetchProfile);

    return {
      userProfile,
      errors,
      loading,
      error,
      clearError,
      clearMessage,
      message,
      handleUpdateProfile,
      cancelUpdate,
      showPasswordMessage,
      showPasswordHelp,
    };
  },
};
</script>

<style scoped>
/* Card */
.card {
  transition: transform 0.2s;
  border: 1px solid #ffe082;
  border-radius: 12px;
  background-color: #fffdf5;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(255, 179, 0, 0.25);
}

/* Modal overlay */
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Table */
.table {
  font-size: 0.95rem;
  border-collapse: collapse;
}
.table thead th {
  background-color: #ffe082; /* vàng nhạt */
  color: #8d6e00; /* vàng đậm */
  font-weight: 600;
  vertical-align: middle;
  padding: 12px;
  border-bottom: 2px solid #ffb300;
}
.table-striped > tbody > tr:nth-child(odd) {
  background-color: #fffde7; /* rất nhạt */
}
.table-striped > tbody > tr:hover {
  background-color: #fff9c4; /* hover highlight */
}

/* Input group */
.input-group {
  max-width: 500px;
}
.input-group-text {
  background-color: #fff8e1;
  border-left: none;
  color: #8d6e00;
  border-radius: 0 6px 6px 0;
  border: 1px solid #ffecb3;
  border-left: 0;
}

/* Input */
.form-control {
  border-right: none;
  border-radius: 6px 0 0 6px;
  font-size: 0.95rem;
  border: 1px solid #ffecb3;
  transition: border-color 0.2s ease;
}
.form-control:focus {
  border-color: #ffb300;
  box-shadow: 0 0 0 2px rgba(255, 179, 0, 0.2);
  outline: none;
}
.form-control:focus + .input-group-text {
  border-color: #ffb300;
}

/* Badge color */
.badge {
  font-size: 0.85em;
  padding: 0.4em 0.6em;
  border-radius: 6px;
  text-transform: capitalize;
}
.badge.bg-warning {
  background-color: #ffecb3;
  color: #8d6e00;
}
.badge.bg-success {
  background-color: #e8f5e9;
  color: #2e7d32;
}
.badge.bg-danger {
  background-color: #ffebee;
  color: #c62828;
}
.badge.bg-info {
  background-color: #fff9c4;
  color: #6d4c41;
}
.badge.bg-secondary {
  background-color: #eceff1;
  color: #546e7a;
}

/* Text */
.text-danger {
  font-weight: bold;
  color: #c62828 !important;
}
.text-warning {
  font-weight: bold;
  color: #ffb300 !important;
}
.text-success {
  font-weight: bold;
  color: #2e7d32 !important;
}
.text-muted {
  font-size: 0.85em;
  font-style: italic;
  color: #757575;
}

/* Button primary */
.btn-primary {
  background: linear-gradient(135deg, #ffd54f 0%, #ffb300 100%);
  border: none;
  font-weight: 500;
  padding: 8px 16px;
  transition: all 0.2s ease;
  border-radius: 6px;
  color: #5d4037;
}
.btn-primary:hover {
  background: linear-gradient(135deg, #ffb300 0%, #ffa000 100%);
  color: white;
}

/* User Profile Container */
.user-profile {
  background-color: #fffdf5;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(255, 179, 0, 0.15);
  max-width: 700px;
  margin: auto;
  border: 1px solid #ffe082;
}

/* Form Labels */
.profile-details .form-label {
  font-weight: 500;
  color: #6d4c41;
}

/* Form Inputs */
.profile-details input,
.profile-details select {
  font-size: 0.95rem;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ffecb3;
  transition: border-color 0.2s ease;
  background: white;
}

/* Focus Form */
.profile-details input:focus,
.profile-details select:focus {
  border-color: #ffb300;
  box-shadow: 0 0 0 2px rgba(255, 179, 0, 0.25);
  outline: none;
}

/* Required label icon */
.profile-details .form-label .text-danger {
  color: #c62828;
}

/* Validation */
.invalid-feedback {
  display: block;
  font-size: 0.85rem;
}

/* Alert */
.alert-success {
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: #e8f5e9;
  color: #2e7d32;
}

/* Secondary Button */
.btn-secondary {
  background-color: #fff8e1;
  border: 1px solid #ffecb3;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  color: #8d6e00;
}
.btn-secondary:hover {
  background-color: #ffe082;
  border-color: #ffb300;
  color: #5d4037;
}
.fw-bold {
  font-weight: bold !important;
}
</style>

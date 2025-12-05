<template>
  <div class="home-page">
    <LoadingSpinner :show="loading" />
    <div class="container py-5">
      <div class="row">
        <div class="col-md-8 mx-auto text-center">
          <h1 class="display-4 mb-4">
            Chào mừng đến với thư viện sách trực tuyến
          </h1>
          <p class="lead mb-5">
            Mỗi cuốn sách là một thế giới đang chờ bạn khám phá
          </p>

          <!-- Thống kê. -->
          <div class="row mb-5">
            <div class="col-md-3">
              <div class="card mb-3 stat-card">
                <div class="card-body">
                  <h3 class="card-title text-success">{{ totalBooks }}</h3>
                  <p class="card-text">Số lượng sách</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card mb-3 stat-card">
                <div class="card-body">
                  <h3 class="card-title text-warning">{{ totalPublishers }}</h3>
                  <p class="card-text">Số nhà xuất bản</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card mb-3 stat-card">
                <div class="card-body">
                  <h3 class="card-title text-primary">{{ totalAuthors }}</h3>
                  <p class="card-text">Số tác giả</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card mb-3 stat-card">
                <div class="card-body">
                  <h3 class="card-title text-danger">{{ approvedBooks }}</h3>
                  <p class="card-text">Số sách bạn đã mượn</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Hướng dẫn -->
          <div class="guide-section">
            <h2 class="mb-4">Chức năng của thư viện</h2>
            <div class="row">
              <div class="col-md-6 mb-4">
                <div class="card h-100 guide-card">
                  <div class="card-body">
                    <h5 class="card-title">
                      <i class="fas fa-search"></i> Tìm sách
                    </h5>
                    <p class="card-text">
                      Tìm sách nhanh chóng theo tên, mã, nhà xuất bản hoặc tác
                      giả
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="card h-100 guide-card">
                  <div class="card-body">
                    <h5 class="card-title">
                      <i class="fas fa-book"></i> Mượn sách
                    </h5>
                    <p class="card-text">
                      Đặt sách nhanh chóng – kiểm tra trạng thái duyệt mọi lúc,
                      mọi nơi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  name: "HomePage",
  components: {
    LoadingSpinner,
  },
  setup() {
    const store = useStore();
    const totalBooks = computed(() => store.getters["book/allBooks"].length);
    const totalPublishers = computed(
      () => store.getters["publisher/allPublishers"].length
    );
    const totalAuthors = computed(
      () => store.getters["author/allAuthors"].length
    );
    const approvedBooks = computed(() => {
      return store.getters["borrow/borrowHistory"].filter(
        (item) => item.trangThai === "Đã duyệt"
      ).length;
    });

    onMounted(async () => {
      await Promise.all([
        store.dispatch("book/fetchBooks"),
        store.dispatch("publisher/fetchPublishers"),
        store.dispatch("borrow/fetchBorrowHistory"),
        store.dispatch("author/fetchAuthors"),
      ]);
    });

    return {
      totalBooks,
      totalPublishers,
      approvedBooks,
      totalAuthors,
    };
  },
};
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #ffe082; /* vàng nhạt */
  box-shadow: 0 4px 12px rgba(255, 179, 0, 0.06); /* ánh vàng nhẹ */
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(255, 179, 0, 0.25); /* hover vàng đậm */
}

/* Title trong card */
.card-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #8d6e00; /* vàng đậm Material */
}

/* Sub text */
.card-text {
  font-size: 1rem;
  color: #6d4c41; /* nâu ấm, dễ đọc hơn #78909c */
}

/* Card trong khu vực Guide */
.guide-section .card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffb300; /* vàng tươi */
}

/* Icon */
.guide-section .fas {
  margin-right: 8px;
  color: #ffb300; /* icon vàng */
}
</style>

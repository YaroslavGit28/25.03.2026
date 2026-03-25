const API = "/api";

let selectedProductId = 1; // текущий выбранный товар

const productsBar = document.getElementById("products-bar");

async function loadProducts() {
  try {
    const res  = await fetch(`${API}/products/`);
    const data = await res.json();
    productsBar.innerHTML = "";

    data.forEach((p) => {
      const btn = document.createElement("button");
      btn.className = "product-btn" + (p.id === selectedProductId ? " active" : "");
      btn.textContent = `${p.image} ${p.name}`;
      btn.addEventListener("click", () => {
        selectedProductId = p.id;
        loadProducts();   // обновить подсветку
        loadReviews();    // загрузить отзывы для товара
        loadStats();      // обновить статистику
      });
      productsBar.append(btn);
    });
  } catch (err) {
    productsBar.innerHTML = "<p style='color:red'>❌ Запусти сервер</p>";
    console.error("loadProducts error:", err);
  }
}

const reviewsList = document.getElementById("reviews-list");

// Вспомогательная функция — рендер звёзд
function renderStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating); // repeat - повторение строки указанное кол раз
}

async function loadReviews() {
 
  try {
    const res = await fetch(
      `${API}/reviews/?product_id=${selectedProductId}`
    );
    const data = await res.json();

    reviewsList.innerHTML = "";
    if (data.length === 0) {
      reviewsList.innerHTML = "<p>Пока нет отзывов</p>";
      return;
    }

    data.forEach((r) => {
      const card = document.createElement("div");
      card.className = "review-card";
      card.innerHTML = `
        <div class="review-header">
          <span class="review-author">${r.author}</span>
          <span class="review-date">${r.date}</span>
        </div>
        <div class="review-stars">${renderStars(r.rating)}</div>
        <div class="review-text">${r.text}</div>
      `;
      reviewsList.append(card);
    });
  } catch (err) {
    reviewsList.innerHTML = "<p style='color:red'>❌ Не удалось загрузить отзывы</p>";
    console.error("loadReviews error:", err);
  }
}


const avgNum        = document.getElementById("avg-num");
const avgStars      = document.getElementById("avg-stars");
const breakdown     = document.getElementById("stars-breakdown");
const totalReviews  = document.getElementById("total-reviews");

async function loadStats() {

  try {
    const res = await fetch(
      `${API}/reviews/stats?product_id=${selectedProductId}`
    );
    const data = await res.json();

    avgNum.textContent = Number(data.average_rating).toFixed(1); // средний рейтинг, преобразует в число, округляет
    avgStars.textContent = renderStars(Math.round(data.average_rating)); // Math.round - округляет до целого
    totalReviews.textContent = `${data.total_reviews} отзывов`;

    breakdown.innerHTML = "";
    for (let i = 5; i >= 1; i--) {
      const count = data.stars[String(i)];
      const percent = data.total_reviews
        ? (count / data.total_reviews) * 100
        : 0;

      const row = document.createElement("div");
      row.className = "star-row";
      row.innerHTML = `
        <span class="label">${i}★</span>
        <div class="star-bar">
          <div class="star-bar-fill" style="width:${percent}%"></div>
        </div>
        <span class="num">${count}</span>
      `;
      breakdown.append(row);
    }
  } catch (err) {
    avgNum.textContent = "0.0";
    avgStars.textContent = renderStars(0);
    totalReviews.textContent = "0 отзывов";
    breakdown.innerHTML = "";
    console.error("loadStats error:", err);
  }
}

const starPicker = document.getElementById("star-picker");
const ratingInput = document.getElementById("review-rating");

let currentRating = 0;

if (starPicker && ratingInput) {
  starPicker.addEventListener("click", (e) => {
    if (!e.target.classList.contains("pick-star")) return; // проверка нажатия на звезду с помощью контейнера

    currentRating = Number(e.target.dataset.value); // уст выбранный рейтинг
    ratingInput.value = currentRating;

    document.querySelectorAll(".pick-star").forEach((s) => {
      s.classList.toggle(
        "lit",
        Number(s.dataset.value) <= currentRating
      );
    });
  });
}

const reviewForm = document.getElementById("review-form");
const reviewAuthor = document.getElementById("review-author");
const reviewText = document.getElementById("review-text");

if (reviewForm && reviewAuthor && reviewText) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (currentRating === 0) {
      alert("Выбери рейтинг!");
      return;
    }

    try {
      const res = await fetch(`${API}/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProductId,
          author: reviewAuthor.value.trim(),
          text: reviewText.value.trim(),
          rating: currentRating,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "Ошибка при отправке отзыва");
        return;
      }
    } catch (err) {
      alert("Ошибка при отправке отзыва");
      console.error("submit review error:", err);
      return;
    }

    reviewForm.reset();
    currentRating = 0;
    if (ratingInput) ratingInput.value = 0;
    document.querySelectorAll(".pick-star").forEach((s) =>
      s.classList.remove("lit")
    );

    loadReviews();
    loadStats();
  });
}


loadProducts();
loadReviews();
loadStats();

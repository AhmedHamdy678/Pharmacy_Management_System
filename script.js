// 1. العناصر والمتغيرات الأساسية
// ===========================================
let medName = document.getElementById("medName");
let company = document.getElementById("company");
let price = document.getElementById("price");
let discount = document.getElementById("discount");
let total = document.querySelector(".total span");
let count = document.getElementById("count");
let expiryDate = document.getElementById("expiryDate");
let type = document.getElementById("type");
let submit = document.getElementById("create");
let search = document.getElementById("search");
let searchName = document.getElementById("searchName");
// let searchCategory = document.getElementById("searchCategory"); // Removed in favor of local selector or new ID
let deleteAll = document.getElementById("delAll");
let tbody = document.querySelector("tbody");
let salesByCategoryChart = null;

let imageFile = document.getElementById("imageFile");
let imageUrl = document.getElementById("imageURL");

let searchMood = "name";
let mood = "create";
let temp;

// تحميل قائمة الأدوية من الملف JSON
let drugDataset = [];
fetch("../assets/data/drugs_data.json")
  .then((res) => res.json())
  .then((data) => {
    drugDataset = data.drugs;
    console.log(`تم تحميل ${drugDataset.length} اسم دواء ✅`);
  })
  .catch((err) => console.error("خطأ في تحميل ملف الأدوية:", err));


const suggestionsBox = document.getElementById("drug-suggestions");
medName.addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();
  suggestionsBox.innerHTML = "";

  if (query.length < 2) {
    suggestionsBox.style.display = "none";
    return;
  }

  const results = drugDataset
    .filter((drug) => drug.tradename.toLowerCase().includes(query))
    .slice(0, 12);

  results.forEach((drug) => {
    const item = document.createElement("div");
    item.innerText = drug.tradename;
    item.addEventListener("click", function () {
      medName.value = drug.tradename;
      company.value = drug.company || "";
      price.value = drug.new_price || "";
      discount.value = "0";
      getTotal();
      suggestionsBox.style.display = "none";
    });
    suggestionsBox.appendChild(item);
  });

  suggestionsBox.style.display = results.length ? "block" : "none";
});



// مصفوفات تخزين البيانات
let medications = [];
let missingItems = JSON.parse(localStorage.getItem("missingItems") || "[]");

let sales = JSON.parse(localStorage.getItem("sales") || "[]");

// 2. تحميل وحفظ البيانات
// تحميل البيانات من Local Storage
if (window.localStorage.getItem("medications") != null) {
  medications = JSON.parse(localStorage.getItem("medications"));
}

// دالة حفظ الأدوية والمخزون
function saveData() {
  window.localStorage.setItem("medications", JSON.stringify(medications));
}

//  دالة حفظ سجلات المبيعات
function saveSales() {
  localStorage.setItem("sales", JSON.stringify(sales));
}

// ############################################
// دالة لعرض جدول المبيعات في صفحة المبيعات
function renderSalesTable() {
  const tbody = document.getElementById("sales-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  // Sort sales by date (newest first)
  const sortedSales = [...sales].reverse();

  sortedSales.forEach((sale) => {
    const tr = document.createElement("tr");

    const total = (
      parseFloat(sale.priceSold) * parseFloat(sale.quantity)
    ).toFixed(2);
    
    // Attempt to parse date safely
    let dateObj = new Date(sale.dateTime || sale.date);
    if (isNaN(dateObj.getTime())) {
        // Fallback or handle invalid date
        dateObj = new Date(); 
    }
    const dateTime = dateObj.toLocaleString("ar-EG");

    tr.innerHTML = `
            <td>${sale.name}</td>
            <td>${sale.priceSold}</td>
            <td>${sale.quantity}</td>
            <td>${total}</td>
            <td>${dateTime}</td>
        `;

    tbody.appendChild(tr);
  });

  updateSalesSummary();
}

// دالة لحساب مبيعات اليوم / الأسبوع / الشهر
function updateSalesSummary() {
  const todaySalesElem = document.getElementById("today-sales");
  const weekSalesElem = document.getElementById("week-sales");
  const monthSalesElem = document.getElementById("month-sales");

  const now = new Date();
  let todayTotal = 0,
    weekTotal = 0,
    monthTotal = 0;

  sales.forEach((sale) => {
    const saleDate = new Date(sale.dateTime || sale.date);
    const saleAmount = parseFloat(sale.priceSold) * parseFloat(sale.quantity);

    // مبيعات اليوم
    if (
      saleDate.getDate() === now.getDate() &&
      saleDate.getMonth() === now.getMonth() &&
      saleDate.getFullYear() === now.getFullYear()
    ) {
      todayTotal += saleAmount;
    }

    // مبيعات الأسبوع (آخر 7 أيام)
    const diffDays = (now - saleDate) / (1000 * 60 * 60 * 24);
    if (diffDays <= 7) {
      weekTotal += saleAmount;
    }

    // مبيعات الشهر الحالي
    if (
      saleDate.getMonth() === now.getMonth() &&
      saleDate.getFullYear() === now.getFullYear()
    ) {
      monthTotal += saleAmount;
    }
  });

  if (todaySalesElem) todaySalesElem.textContent = todayTotal.toFixed(2);
  if (weekSalesElem) weekSalesElem.textContent = weekTotal.toFixed(2);
  if (monthSalesElem) monthSalesElem.textContent = monthTotal.toFixed(2);
}

// تحديث الجدول عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  renderSalesTable();
});

// تعديل بسيط داخل دالة sellMedication
// بعد saveSales() أضف السطر التالي:
renderSalesTable();

// #############################################
// دالة حفظ نواقص المخزون
function saveMissingItems() {
  localStorage.setItem("missingItems", JSON.stringify(missingItems));
}

// 3. دوال الإدخال والإنشاء
if (submit) {
  submit.addEventListener("click", function () {
    medName.focus();
    createMedication();
    clearInputs();
    saveData();
    getTotal();
    showMedications();
    // تحديث صفحة العرض عند الإضافة
    renderProductsGrid();
  });
}

// دالة حساب المجموع
function getTotal() {
  const p = parseFloat(price ? price.value : 0) || 0;
  const d = parseFloat(discount ? discount.value : 0) || 0;

  if (p > 0) {
    let result = p - d;
    if (total) total.innerHTML = result.toFixed(2);
    if (total && total.parentElement)
      total.parentElement.style.backgroundColor = "var(--secondary-color)";
  } else {
    if (total) total.innerHTML = "";
    if (total && total.parentElement)
      total.parentElement.style.backgroundColor = "var(--danger-color)";
  }
}

// دالة إنشاء دواء
function createMedication() {
  if (medName && medName.value != "") {
    let medication = {
      id: mood == "create" ? Date.now() : medications[temp].id,
      name: medName.value,
      company: company.value,
      imageURL: imageUrl.value || "",
      price: price.value,
      discount: discount.value,
      total: total ? total.innerHTML : "",
      count: count.value,
      expiryDate: expiryDate.value,
      sell: 0,
    }; // التحقق من تاريخ الصلاحية

    if (medication.expiryDate && checkExpiry(medication.expiryDate)) {
      Swal.fire({
        title: "تنبيه!",
        text: "هذا الدواء منتهي الصلاحية. هل تريد إضافته مع العلم بذلك؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم",
        cancelButtonText: "إلغاء",
      }).then((result) => {
        if (result.isConfirmed) {
          addMedication(medication);
        }
      });
      return;
    }

    addMedication(medication);
  } else {
    Swal.fire({ title: "الرجاء إدخال اسم الدواء" });
  }
}

// دالة إضافة الدواء للمصفوفة
function addMedication(medication) {
  if (mood == "create") {
    let medExists = false;
    for (let i = 0; i < medications.length; i++) {
      if (
        medications[i].name === medication.name &&
        medications[i].company === medication.company &&
        medications[i].expiryDate === medication.expiryDate
      ) {
        medications[i].count = String(
          Number(medications[i].count) + Number(medication.count)
        );
        medExists = true;
        break;
      }
    }
    if (!medExists) {
      medications.push(medication);
    }
  } else {
    // وضع التحديث
    medications[temp] = medication;
    mood = "create";
    if (submit) submit.innerHTML = "إضافة دواء";
    if (count) count.style.display = "block";
  }

  saveData();
  showMedications();
  updateStats();
  showInventoryAlerts();
  clearInputs();
  // تحديث صفحة العرض بعد إضافة/تحديث دواء
  renderProductsGrid();
}

// دالة مسح الحقول
function clearInputs() {
  if (medName) medName.value = "";
  if (company) company.value = "";
  if (imageFile) imageFile.value = "";
  if (imageUrl) imageUrl.value = "";

  if (price) price.value = "";
  if (discount) discount.value = "";
  if (count) count.value = "";
  if (expiryDate) expiryDate.value = "";

  mood = "create";
  if (submit) submit.innerHTML = "إضافة دواء";
  if (count) count.style.display = "block";
  getTotal();
}

// 4. دوال العرض والتحديث
// دالة التحقق من انتهاء الصلاحية
function checkExpiry(expiryDate) {
  if (!expiryDate) return false;
  let expiry = new Date(expiryDate);
  let today = new Date();
  expiry.setDate(expiry.getDate() + 1);
  return expiry < today;
}

// دالة لإنشاء صف في الجدول
function renderRow(med, i) {
  if (!tbody) return;

  let tr = document.createElement("tr");
  let isExpired = checkExpiry(med.expiryDate);
  if (isExpired) {
    tr.classList.add("expired");
  }

  // 1. تجميع جميع بيانات الأعمدة بالترتيب الذي تم تحديده في <thead> HTML
  const data = [
    i + 1,
    med.name,
    med.company || "-",
    med.imageUrl,
    med.price,
    med.discount,
    med.total,
    med.count,
    med.expiryDate || "-",
  ];

  let currentCellIndex = 0; // مؤشر لتتبع مكان إضافة الأعمدة

  // 2. إضافة الأعمدة النصية حتى عمود 'الشركة' (م، الدواء , الشركة)
  for (let j = 0; j < 3; j++) {
    let td = document.createElement("td");
    td.innerHTML = data[j];
    tr.appendChild(td);
    currentCellIndex++;
  }

  // 3. إضافة عمود الصورة (العمود الخامس حسب الـ HTML)
  let tdImage = document.createElement("td");
  if (med.imageURL) {
    let img = document.createElement("img");
    img.src = med.imageURL; // Base64 أو URL
    img.alt = med.name;
    img.classList.add("product-thumb");
    img.addEventListener("click", () => showImage(med.imageURL, med.name));
    tdImage.appendChild(img);
  } else {
    tdImage.innerHTML = "-";
  }
  tr.appendChild(tdImage);
  currentCellIndex++;

  // 4. إضافة باقي الأعمدة النصية (السعر، الخصم، المجموع، إلخ)
  for (let j = 4; j < data.length; j++) {
    let td = document.createElement("td");
    td.innerHTML = data[j];
    tr.appendChild(td);
    currentCellIndex++;
  }

  // 5. تنسيق تاريخ الانتهاء
  if (isExpired) {
    // تجنب الوصول لعنصر غير موجود
    if (tr.children[11]) {
      tr.children[11].style.color = "var(--danger-color)";
      tr.children[11].style.fontWeight = "bold";
    }
  }

  // زر التعديل (الفهرس التالي)
  let tdUpdate = document.createElement("td");
  let updateBtn = document.createElement("button");
  updateBtn.innerHTML = "تعديل";
  tdUpdate.append(updateBtn);
  tr.append(tdUpdate);
  updateBtn.addEventListener("click", () => updateMedication(i));

  // زر الحذف
  let tdDelete = document.createElement("td");
  let delBtn = document.createElement("button");
  delBtn.innerHTML = "حذف";
  delBtn.classList.add("delete");
  tdDelete.append(delBtn);
  tr.append(tdDelete);
  delBtn.addEventListener("click", () => deleteOneMedication(i));

  // زر البيع
  let tdSell = document.createElement("td");
  let sellBtn = document.createElement("button");
  sellBtn.classList.add("sell");
  sellBtn.innerHTML = "بيع";
  tdSell.appendChild(sellBtn);
  tr.appendChild(tdSell);
  sellBtn.addEventListener("click", () => sellMedication(i));

  tbody.appendChild(tr);
}

// دالة عرض الأدوية
function showMedications() {
  if (!tbody) return;

  tbody.innerHTML = "";
  for (let i = 0; i < medications.length; i++) {
    renderRow(medications[i], i);
  }

  if (deleteAll) {
    if (medications.length > 0) {
      deleteAll.innerHTML = `<button onclick="deleteAllMedications()">حذف الكل (${medications.length})</button>`;
    } else {
      deleteAll.innerHTML = "";
    }
  }

  updateStats();
  showTopMedicationsChart();
  // عرض المنتجات في صفحة العرض أيضاً
  renderProductsGrid();
}

/* 
   إضافات: دوال صفحة العرض (Cards)
/**
 * renderProductsGrid(filter = "All", searchTerm = "")
 */

function renderProductsGrid(filter = "All", searchTerm = "") {
  const container = document.getElementById("products-grid");
  if (!container) return;

  container.innerHTML = "";

  if (!medications || medications.length === 0) {
    container.innerHTML = `<p class="loading-message">لا توجد منتجات لعرضها</p>`;
    return;
  }

  const q = (searchTerm || "").toString().trim().toLowerCase();
  
  // 1. Grouping Logic: Aggregate products by Name
  const groupedMeds = {};

  medications.forEach((med) => {
    // Filter Logic
    if (filter && filter !== "All" && med.category !== filter) return;
    
    // Search Logic
    if (q) {
      const nameMatch = med.name && med.name.toLowerCase().includes(q);
      const barcodeMatch = med.barcode && med.barcode.toLowerCase().includes(q);
      if (!nameMatch && !barcodeMatch) return;
    }

    // Normalizing name for grouping
    const nameKey = med.name.trim().toLowerCase();

    if (!groupedMeds[nameKey]) {
      // First time finding this product name -> Initialize entry
      groupedMeds[nameKey] = {
        ...med, // Copy properties of the first occurrence
        totalQuantity: 0,
        ids: [] // Track all IDs/Barcodes if needed, or just use the first/main one
      };
    }

    // Accumulate Quantity
    groupedMeds[nameKey].totalQuantity += Number(med.count || 0);
    // Keep track of IDs (optional usage)
    groupedMeds[nameKey].ids.push(med.id);
  });

  const uniqueMeds = Object.values(groupedMeds);

  if (uniqueMeds.length === 0) {
    container.innerHTML = `<p class="loading-message">لا توجد نتائج لعرضها</p>`;
    return;
  }

  // 2. Rendering unique cards
  uniqueMeds.forEach((med) => {
    const card = document.createElement("div");
    card.className = "product-card";
    // We can use the ID of the first item for data attributes
    card.setAttribute("data-id", med.id || "");
    card.setAttribute("data-name", med.name || "");

    // Image Section
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "product-image";
    if (med.imageURL) {
      const img = document.createElement("img");
      img.src = med.imageURL;
      img.alt = med.name;
      img.className = "product-thumb";
      img.addEventListener("click", () => showImage(med.imageURL, med.name));
      imgWrapper.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "product-image-placeholder";
      placeholder.innerHTML = `<i class="fas fa-pills"></i>`;
      imgWrapper.appendChild(placeholder);
    }
    card.appendChild(imgWrapper);

    // Info Section
    const infoDiv = document.createElement("div");
    infoDiv.style.flex = "1";
    infoDiv.style.display = "flex";
    infoDiv.style.flexDirection = "column";
    infoDiv.style.justifyContent = "space-between";

    // Name
    const nameEl = document.createElement("div");
    nameEl.className = "product-name";
    nameEl.innerText = med.name || "بدون اسم";
    nameEl.title = med.name; // Tooltip for full name
    infoDiv.appendChild(nameEl);

    // Serial / ID
    // User requested "drug's serial number". We use Barcode if available, else ID.
    const serialNumber = med.barcode || med.id || "-";
    const serialEl = document.createElement("div");
    serialEl.style.fontSize = "11px";
    serialEl.style.color = "#777";
    serialEl.style.margin = "4px 0";
    serialEl.innerText = `S/N: ${serialNumber}`;
    infoDiv.appendChild(serialEl);
    
    // Quantity Badge (New)
    const qtyEl = document.createElement("div");
    qtyEl.style.fontSize = "12px";
    qtyEl.style.marginBottom = "5px";
    qtyEl.style.fontWeight = "600";
    qtyEl.style.color = med.totalQuantity > 0 ? "var(--success-color, green)" : "var(--danger-color, red)";
    qtyEl.innerText = `الكمية: ${med.totalQuantity}`;
    infoDiv.appendChild(qtyEl);

    // Price
    const priceEl = document.createElement("div");
    priceEl.className = "product-price";
    const displayPrice = med.total && med.total !== "" ? med.total : med.price || "0";
    priceEl.innerText = `${displayPrice} ج.م`;
    infoDiv.appendChild(priceEl);

    card.appendChild(infoDiv);
    container.appendChild(card);
  });
}

/**
 * setupCategoryFilters()
 * - يربط أزرار الفلاتر في .filter-btn
 */
function setupCategoryFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (!filterButtons || filterButtons.length === 0) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // إزالة active من الجميع ثم إضافة للكبس الحالي
      filterButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter") || "All";
      const productSearchInput = document.getElementById("productSearch");
      const searchTerm = productSearchInput ? productSearchInput.value : "";
      renderProductsGrid(filter, searchTerm);
    });
  });
}

/**
 * setupProductSearch()
 * - يربط حقل البحث في صفحة products ويجعل البحث حي مع مراعاة الفلتر الحالي
 */
function setupProductSearch() {
  const productSearchInput = document.getElementById("productSearch");
  if (!productSearchInput) return;

  productSearchInput.addEventListener("keyup", function () {
    // الحصول على الفلتر الحالي
    const activeFilterBtn = document.querySelector(".filter-btn.active");
    const filter = activeFilterBtn
      ? activeFilterBtn.getAttribute("data-filter")
      : "All";
    const searchTerm = this.value || "";
    renderProductsGrid(filter, searchTerm);
  });
}

/* ================================
   نهاية إضافات صفحة العرض (Cards)
   ================================ */

// دالة تحديث الإحصائيات (تستخدم الآن مصفوفة 'sales')
function updateStats() {
  let totalMeds = 0;
  let expiredCount = 0;
  let totalSales = 0;


  for (let i = 0; i < medications.length; i++) {
    totalMeds += +medications[i].count;
    if (checkExpiry(medications[i].expiryDate)) {
      expiredCount++;
    }
  }

  // حلقة تكرار سجلات المبيعات (لحساب الإيرادات)
  for (let i = 0; i < sales.length; i++) {
    const sale = sales[i];
    totalSales +=
      (parseFloat(sale.priceSold) || 0) * (parseFloat(sale.quantity) || 0);
  }

  const totalMedsElem = document.getElementById("total-medications");
  const expiredCountElem = document.getElementById("expired-count");
  const totalSalesElem = document.getElementById("total-sales");
  if (totalMedsElem) totalMedsElem.innerText = totalMeds;
  if (expiredCountElem) expiredCountElem.innerText = expiredCount;
  if (totalSalesElem) totalSalesElem.innerText = totalSales.toFixed(2);
  updateMissingItemsCount();
  const updateCategoryStats = (id, value) => {
    const elem = document.getElementById(id);
    if (elem) elem.innerText = value;
  };

}

// 5. دوال الحذف والتعديل
// دالة حذف دواء واحد
function deleteOneMedication(i) {
  Swal.fire({
    title: "هل تريد حذف هذا الدواء؟",
    text: "ملاحظة: حذف الدواء لا يؤثر على سجلات المبيعات السابقة.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم",
    cancelButtonText: "إلغاء",
  }).then((result) => {
    if (result.isConfirmed) {
      medications.splice(i, 1);
      saveData();
      showMedications();
      updateStats();
      showInventoryAlerts();
      // تحديث صفحة العرض بعد الحذف
      renderProductsGrid();
      Swal.fire("تم الحذف!", "", "success");
    }
  });
}

// دالة حذف جميع الأدوية
function deleteAllMedications() {
  Swal.fire({
    title: "هل تريد حذف كل الأدوية؟",
    text: "ستبقى سجلات المبيعات محفوظة.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم",
    cancelButtonText: "إلغاء",
  }).then((result) => {
    if (result.isConfirmed) {
      medications = [];
      localStorage.removeItem("medications");
      showMedications();
      updateStats();
      showInventoryAlerts();
      // تحديث صفحة العرض بعد حذف الكل
      renderProductsGrid();
      Swal.fire("تم حذف كل الأدوية!", "", "success");
    }
  });
}

// دالة التعديل على دواء
function updateMedication(i) {
  if (medName) medName.value = medications[i].name;
  if (company) company.value = medications[i].company || "";

  if (imageUrl) imageUrl.value = medications[i].imageURL || "";
  if (imageFile) imageFile.value = ""; // مسح حقل الملف المرئي

  if (price) price.value = medications[i].price;
  if (discount) discount.value = medications[i].discount;
  if (category) category.value = medications[i].category;
  if (count) count.value = medications[i].count;
  if (expiryDate) expiryDate.value = medications[i].expiryDate || "";

  getTotal();
  if (submit) submit.innerHTML = "تحديث";
  // if (count) count.style.display = "none";
  mood = "update";
  temp = i;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 6. دوال البيع (الأساسية)
// دالة بيع الدواء (محدثة لتسجيل البيع في مصفوفة منفصلة)
function sellMedication(i) {
  const med = medications[i];
  if (!med) return; // التحقق من انتهاء الصلاحية

  if (checkExpiry(med.expiryDate)) {
    Swal.fire({
      title: "تحذير!",
      text: "هذا الدواء منتهي الصلاحية ولا يمكن بيعه",
      icon: "error",
    });
    return;
  } // التحقق من توفر المخزون

  if (+med.count <= 0) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "لا توجد كمية متاحة",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    return;
  } // 1. إنقاص الكمية من المخزون

  med.count = String(+med.count - 1);
  const saleRecord = {
    medId: med.id, // ID الدواء
    name: med.name,
    priceSold: med.total, // سعر البيع النهائي في لحظة الشراء
    quantity: 1, // بيع وحدة واحدة
    date: new Date().toISOString(), // Use ISO format for reliable parsing
  };
  sales.push(saleRecord);
  saveSales(); // حفظ سجلات المبيعات
  
  // 3. تحديث العرض والمؤشرات
  saveData();
  showMedications();
  updateStats();
  renderSalesTable(); // Update Today/Week/Month summary immediately
  showTopMedicationsChart(); // تنبيه نجاح بيع

  // تحديث صفحة العرض بعد بيع (انخفضت الكمية)
  renderProductsGrid();

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "تم بيع الدواء بنجاح",
    showConfirmButton: false,
    timer: 1200,
  });
}

// 7. دوال البحث
// 7. دوال البحث
function getSearchData(id) {
  if (id == "searchName") {
    searchMood = "name";
  } else {
    searchMood = "company";
  }

  if (search) search.placeholder = `بحث حسب ${searchMood === 'name' ? 'الاسم' : 'الشركة'}`;
  if (search) search.focus();
}

if (searchName) {
  searchName.addEventListener("click", function () {
    getSearchData(this.id);
  });
}

const searchCompany = document.getElementById("searchCompany");
if (searchCompany) {
  searchCompany.addEventListener("click", function () {
    getSearchData(this.id);
  });
}

function mainSearchData(value) {
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!value) {
    showMedications();
    return;
  }

  for (let i = 0; i < medications.length; i++) {
    const med = medications[i];
    let match = false;

    if (searchMood == "name") {
      if (med.name.toLowerCase().includes(value.toLowerCase())) {
        match = true;
      }
    } else {
      // company
      if (med.company && med.company.toLowerCase().includes(value.toLowerCase())) {
        match = true;
      }
    }

    if (match) {
      renderRow(med, i);
    }
  }
}

// 8. دوال النواقص والمخزون
// دالة تحديث عدد النواقص على البطاقة
function updateMissingItemsCount() {
  const countElement = document.getElementById("missing-items-count");
  if (countElement) {
    countElement.innerText = missingItems.length;
  }
}

// دالة حذف عنصر من قائمة النواقص
window.deleteMissingItem = function (index) {
  missingItems.splice(index, 1);
  saveMissingItems();
  updateMissingItemsCount();
  showMissingItemsInput();
};

// دالة عرض نافذة تسجيل النواقص (المعدلة لاستخدام فئات CSS)
function showMissingItemsInput() {
  // بناء قائمة النواقص الحالية لعرضها في النافذة
  const listHTML =
    missingItems.length > 0
      ? `<div class="missing-items-list-container">
            ${missingItems
              .map(
                (item, index) =>
                  // استخدام فئات CSS جديدة بدلاً من التنسيق المضمن
                  `<div class="missing-list-item">
                    <span class="missing-item-info">
                        ${item.name}
                        (<span class="missing-item-quantity">الكمية: ${item.quantity}</span>)
                        - <span class="missing-item-date">${item.date}</span>
                    </span>
                    <button onclick="deleteMissingItem(${index})" class="delete-missing-btn">حذف</button>
                </div>`
              )
              .join("")}
        </div>`
      : '<p class="no-missing-items">لا توجد نواقص مسجلة حالياً.</p>';

  Swal.fire({
    title: "قائمة نواقص المخزون",
    html: `
            <input id="swal-missing-name" class="swal2-input" placeholder="اسم الدواء الناقص" style="text-align: right;">
            <input id="swal-missing-quantity" class="swal2-input" type="number" placeholder="الكمية المطلوبة" style="text-align: right;">
            <input id="swal-missing-description" class="swal2-input" type="text" placeholder="الوصف" style="text-align: right;">
            <hr style="margin: 15px 0;">
            <h4 class="current-missing-title">النواقص الحالية:</h4>
            ${listHTML}
        `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "إضافة للطلبية",
    cancelButtonText: "إغلاق",
    preConfirm: () => {
      const name = document.getElementById("swal-missing-name").value;
      const quantity = document.getElementById("swal-missing-quantity").value;
      const description = document.getElementById(
        "swal-missing-description"
      ).value;
      if (!name || !quantity || parseInt(quantity) <= 0) {
        Swal.showValidationMessage("الرجاء إدخال اسم الدواء وكمية صحيحة");
        return false;
      }
      return { name: name, quantity: quantity, description: description };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const newItem = {
        name: result.value.name,
        quantity: result.value.quantity,
        description: result.value.description,
        date: new Date().toLocaleDateString("ar-EG"),
      };
      missingItems.push(newItem);
      saveMissingItems();
      updateMissingItemsCount();
      Swal.fire({
        title: "تم التسجيل!",
        text: `تم إضافة ${newItem.name} (الكمية: ${newItem.quantity}) لقائمة النواقص.`,
        icon: "success",
      }).then(() => {
        showMissingItemsInput();
      });
    }
  });
}

// دالة عرض تنبيهات المخزون (كما هي)
function showInventoryAlerts() {
  const expiredList = document.getElementById("expired-list");
  const lowStockList = document.getElementById("low-stock-list");
  if (!expiredList || !lowStockList) return;
  expiredList.innerHTML = "";
  lowStockList.innerHTML = "";
  let hasExpired = false;
  let hasLowStock = false;
  for (let i = 0; i < medications.length; i++) {
    const med = medications[i];
    if (checkExpiry(med.expiryDate)) {
      hasExpired = true;
      const alertItem = document.createElement("div");
      alertItem.classList.add("alert-item", "expired");
      alertItem.innerHTML = `
                    <span>${med.name}</span>
                    <span>${med.expiryDate}</span>
                `;
      expiredList.appendChild(alertItem);
    }
    if (+med.count <= 10 && +med.count > 0) {
      hasLowStock = true;
      const alertItem = document.createElement("div");
      alertItem.classList.add("alert-item", "low-stock");
      alertItem.innerHTML = `
                        <span>${med.name}</span>
                        <span>${med.count} وحدة</span>
                    `;
      lowStockList.appendChild(alertItem);
    }
  }
  if (!hasExpired) {
    expiredList.innerHTML =
      '<div class="alert-item">لا توجد أدوية منتهية الصلاحية</div>';
  }
  if (!hasLowStock) {
    lowStockList.innerHTML =
      '<div class="alert-item">لا توجد أدوية منخفضة الكمية</div>';
  }
}

// 9. دوال المخططات
let topMedicationsChart;
function showTopMedicationsChart() {
  const ctx = document.getElementById("topProductsChart");
  if (!ctx) return;

  const context = ctx.getContext("2d");

  // خريطة الأدوية الحالية حسب id (نحول id إلى string للتوافق)
  const medsById = new Map();
  medications.forEach((m) => {
    medsById.set(String(m.id), m);
  });

  // نفلتر سجلات المبيعات لتشمل فقط المبيعات الخاصة بالأدوية الموجودة حالياً
  const filteredSales = sales.filter((s) => {
    if (s.medId !== undefined && s.medId !== null) {
      return medsById.has(String(s.medId));
    }
    // إذا لم يكن هناك medId في السجل، نقارنه بالاسم (fallback)
    return medications.some((m) => m.name === s.name);
  });

  // تجميع أعداد المبيعات ولكن باستخدام اسم الدواء الحالي (حتى لو تغير الاسم)
  const salesCounts = filteredSales.reduce((acc, sale) => {
    const medIdKey =
      sale.medId !== undefined && sale.medId !== null
        ? String(sale.medId)
        : null;
    const medName =
      medIdKey && medsById.has(medIdKey)
        ? medsById.get(medIdKey).name
        : sale.name || "غير معروف";
    acc[medName] = (acc[medName] || 0) + (Number(sale.quantity) || 0);
    return acc;
  }, {});

  const topMeds = Object.entries(salesCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 8);

  const labels = topMeds.map(([name]) => name);
  const data = topMeds.map(([, count]) => count);

  // لو مافيش بيانات بعد الفلترة -> امسح الرسم الحالي وارجع (لا تعرض بيانات قديمة)
  if (labels.length === 0) {
    if (topMedicationsChart) {
      try {
        topMedicationsChart.destroy();
      } catch (e) {
        /* ignore */
      }
      topMedicationsChart = null;
    }
    // ونحدث عنصر الـ canvas لو حابب تضيف رسالة بصرياً (مغلق هنا لأن الـ html مسؤول عنه)
    return;
  }

  if (topMedicationsChart) {
    try {
      topMedicationsChart.destroy();
    } catch (e) {
      /* ignore */
    }
  }

  topMedicationsChart = new Chart(context, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "عدد المبيعات",
          data: data,
          backgroundColor: "rgba(75, 19, 192, 0.4)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "أكثر الأدوية مبيعًا" },
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
      },
    },
  });
}

// إضافة دالة لمسح سجلات المبيعات بالكامل (زر "مسح السجلات")
// يتوقع وجود عنصر زر في HTML بالـ id التالي: clearSalesBtn
const clearSalesBtn = document.getElementById("clearSalesBtn");
if (clearSalesBtn) {
  clearSalesBtn.addEventListener("click", function () {
    Swal.fire({
      title: "هل تريد مسح سجلات المبيعات؟",
      text: "سيتم حذف جميع سجلات المبيعات وإعادة تعيين إجمالي المبيعات إلى صفر.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، امسح",
      cancelButtonText: "إلغاء",
    }).then((res) => {
      if (res.isConfirmed) {
        sales = [];
        saveSales();
        updateStats();
        showTopMedicationsChart();
        Swal.fire("تم المسح!", "تم حذف سجلات المبيعات.", "success");
      }
    });
  });
}

// 11. إدارة القائمة الجانبية (Mobile Responsive)
// كود تفعيل زر قائمة الموبايل
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");

function hideSidebar() {
  if (
    sidebar &&
    window.innerWidth <= 768 &&
    sidebar.classList.contains("active")
  ) {
    sidebar.classList.remove("active");
  }
}
if (sidebar) {
  // 1. تفعيل زر الإظهار (الهمبرغر)
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      sidebar.classList.toggle("active");
    });
  } // 2. تفعيل زر الإغلاق (X) الجديد

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", hideSidebar);
  }
}
//  تحديث أحداث القائمة الجانبية لإخفاء القائمة بعد الضغط
document.querySelectorAll(".menu li").forEach((item) => {
  item.addEventListener("click", function () {
    // إزالة النشاط من جميع العناصر
    document
      .querySelectorAll(".menu li")
      .forEach((li) => li.classList.remove("active")); // إضافة النشاط للعنصر الحالي
    this.classList.add("active"); // إخفاء جميع أقسام المحتوى

    document
      .querySelectorAll(".content-section")
      .forEach((section) => section.classList.remove("active")); // إظهار القسم المحدد

    const sectionId = this.getAttribute("data-section") + "-section";
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.classList.add("active");

      if (sectionId === "medications-section") {
        showMedications();
      }
      if (sectionId === "inventory-section") {
        showInventoryAlerts();
      }
      if (sectionId === "dashboard-section") {
        updateStats();
        showTopMedicationsChart();
      }
    }
    //  إخفاء الشريط الجانبي بعد الانتقال (للموبايل)
    hideSidebar();
  });
});

// 12. التهيئة الأولية
// تفعيل أحداث الحقول لحساب المجموع
if (price) price.addEventListener("keyup", getTotal);
if (discount) discount.addEventListener("keyup", getTotal);

// تفعيل حدث البحث أثناء الكتابة
if (search)
  search.addEventListener("keyup", function () {
    mainSearchData(this.value);
  });

document.addEventListener("DOMContentLoaded", function () {
  // يجب أن يتم استدعاء saveSales() لأول مرة إذا كانت مصفوفة المبيعات فارغة
  if (sales.length === 0) saveSales();

  getTotal();
  showMedications();
  showInventoryAlerts();
  updateStats();
  showTopMedicationsChart();
  updateMissingItemsCount();
  const missingCard = document.getElementById("missing-items-card");
  if (missingCard) {
    missingCard.style.cursor = "pointer";
    missingCard.addEventListener("click", showMissingItemsInput);
  } // تفعيل أول عنصر في القائمة الجانبية

  const firstMenuItem = document.querySelector(
    ".menu li[data-section='dashboard']"
  );
  if (firstMenuItem) {
    firstMenuItem.classList.add("active");
    const dashboardSection = document.getElementById("dashboard-section");
    if (dashboardSection) dashboardSection.classList.add("active");
  }

  // تهيئة صفحة العرض: الفلاتر + البحث + رسم المنتجات
  setupCategoryFilters();
  setupProductSearch();
  renderProductsGrid();
});

// 13. دوال عرض الصورة (وظيفة التكبير)
// دالة عرض الصورة المكبرة عند النقر
function showImage(url, name) {
  if (!url) return;

  Swal.fire({
    title: `صورة منتج: ${name}`,
    // استخدام Base64 مباشرة كـ src
    html: `<img src="${url}" style= height: auto; border-radius: 8px;">`,
    showConfirmButton: true,
    confirmButtonText: "إغلاق",
    width: 10, // تحديد عرض النافذة المنبثقة
    customClass: {
      container: "image-popup-container",
    },
  });
}

// 14. دوال التعامل مع الصور (رفع وتحويل)
// ===========================================
// دالة معالجة رفع الملفات وتحويلها إلى Base64
function handleImageUpload() {
  if (!imageFile || !imageUrl) return;

  imageFile.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    // التحقق من حجم الملف (تجنب الملفات الكبيرة جدًا)
    if (file.size > 500 * 1024) {
      Swal.fire({
        icon: "error",
        title: "حجم الصورة كبير جداً!",
        text: "الرجاء اختيار صورة بحجم أصغر من 500 كيلوبايت.",
      });
      imageFile.value = ""; // مسح الملف المحدد
      imageUrl.value = "";
      return;
    }

    const reader = new FileReader();
    // عند الانتهاء من قراءة الملف
    reader.onload = function (readerEvent) {
      // تخزين البيانات المشفرة Base64 في الحقل المخفي
      imageUrl.value = readerEvent.target.result;
    };

    // قراءة الملف كنص مشفر (Base64)
    reader.readAsDataURL(file);
  });
}

// ===========================================
// 15. تفعيل دوال الصور عند التحميل
// ===========================================
document.addEventListener("DOMContentLoaded", function () {
  handleImageUpload();
});

// دالة مسح جميع سجلات المبيعات
function clearSalesRecords() {
  Swal.fire({
    title: "هل أنت متأكد من حذف سجلات المبيعات؟",
    text: "لا يمكن التراجع عن هذا الإجراء.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم، احذفها!",
    cancelButtonText: "إلغاء",
    dangerMode: true,
  }).then((result) => {
    if (result.isConfirmed) {
      // 1. تفريغ مصفوفة المبيعات
      sales = [];
      // 2. تحديث Local Storage
      saveSales();
      // 3. تحديث واجهة المستخدم
      updateStats();

      Swal.fire("تم المسح!", "تم حذف جميع سجلات المبيعات بنجاح.", "success");
    }
  });
}

// ===========================================
// 16. دوال مسح مبيعات (يوم / أسبوع / شهر)
// ===========================================

// 1. مسح مبيعات اليوم
const clearTodaySalesBtn = document.getElementById("clearTodaySalesBtn");
if (clearTodaySalesBtn) {
  clearTodaySalesBtn.addEventListener("click", function () {
    Swal.fire({
      title: "مسح مبيعات اليوم؟",
      text: "سيتم حذف سجلات مبيعات اليوم فقط.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم",
      cancelButtonText: "إلغاء",
    }).then((res) => {
      if (res.isConfirmed) {
        const now = new Date();
        // نحتفظ فقط بالسجلات التي هي *ليست* من اليوم
        sales = sales.filter((sale) => {
          const d = new Date(sale.dateTime || sale.date);
          const isToday =
            d.getDate() === now.getDate() &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear();
          return !isToday; // يرجع true إذا لم يكن اليوم (فيحتفظ به)
        });
        
        saveSales();
        updateStats();
        renderSalesTable();
        Swal.fire("تم!", "تم مسح مبيعات اليوم.", "success");
      }
    });
  });
}

// 2. مسح مبيعات الأسبوع
const clearWeekSalesBtn = document.getElementById("clearWeekSalesBtn");
if (clearWeekSalesBtn) {
  clearWeekSalesBtn.addEventListener("click", function () {
    Swal.fire({
      title: "مسح مبيعات الأسبوع؟",
      text: "سيتم حذف سجلات آخر 7 أيام.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم",
      cancelButtonText: "إلغاء",
    }).then((res) => {
      if (res.isConfirmed) {
        const now = new Date();
        sales = sales.filter((sale) => {
          const d = new Date(sale.dateTime || sale.date);
          const diffDays = (now - d) / (1000 * 60 * 60 * 24);
          // نحذف إذا كان الفرق أقل من أو يساوي 7 أيام
          return diffDays > 7; 
        });

        saveSales();
        updateStats();
        renderSalesTable();
        Swal.fire("تم!", "تم مسح مبيعات الأسبوع.", "success");
      }
    });
  });
}

// 3. مسح مبيعات الشهر
const clearMonthSalesBtn = document.getElementById("clearMonthSalesBtn");
if (clearMonthSalesBtn) {
  clearMonthSalesBtn.addEventListener("click", function () {
    Swal.fire({
      title: "مسح مبيعات الشهر؟",
      text: "سيتم حذف سجلات الشهر الحالي.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم",
      cancelButtonText: "إلغاء",
    }).then((res) => {
      if (res.isConfirmed) {
        const now = new Date();
        sales = sales.filter((sale) => {
          const d = new Date(sale.dateTime || sale.date);
          const isCurrentMonth =
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear();
          return !isCurrentMonth; // نحتفظ بما ليس في الشهر الحالي
        });

        saveSales();
        updateStats();
        renderSalesTable();
        Swal.fire("تم!", "تم مسح مبيعات الشهر الحالي.", "success");
      }
    });
  });
}

// ========================
// تفاصيل الأدوية حسب القسم
// ========================
function showMedicineDetails() {
  const products = JSON.parse(localStorage.getItem("medications")) || [];
  if (products.length === 0) {
    Swal.fire({
      title: "لا توجد أدوية مسجلة",
      text: "قم بإضافة أدوية في قسم إدارة الأدوية أولاً.",
      icon: "info",
      confirmButtonText: "حسنًا",
    });
    return;
  }

  // تجميع الأدوية حسب القسم
  const grouped = {};
  products.forEach((product) => {
    const category = product.category || "غير محدد";
    const quantity = Number(product.count) || 0;
    grouped[category] = (grouped[category] || 0) + quantity;
  });

  // بناء الجدول
  let html = `
        <table style="width:100%; text-align:center; border-collapse: collapse; font-size: 14px;">
            <tr style="background:#f0f0f0; font-weight:bold;">
                <th style="border:1px solid #ccc; padding:6px;">القسم</th>
                <th style="border:1px solid #ccc; padding:6px;">الكمية</th>
            </tr>
    `;
  for (let category in grouped) {
    html += `
            <tr>
                <td style="border:1px solid #ccc; padding:6px;">${category}</td>
                <td style="border:1px solid #ccc; padding:6px;">${grouped[category]}</td>
            </tr>
        `;
  }
  html += `</table>`;

  // عرض النافذة
  Swal.fire({
    title: "تفاصيل الأدوية حسب القسم",
    html,
    width: 800,
    padding: "20px",
    confirmButtonText: "إغلاق",
  });
}

// #####################################################
// ========== زر استيراد الداتا الخارجية (Bulk Import) ==========
const importBtn = document.getElementById("importBtn");

let selectedDrugs = new Set(); // ✅ يتذكر الاختيارات عبر البحث

function openImportModal() {
  if (!drugDataset || drugDataset.length === 0) {
    Swal.fire("خطأ", "ملف الداتا لم يتم تحميله بعد", "error");
    return;
  }

  const LIMIT = 300;

  function renderList(items) {
    const list = document.getElementById("importList");
    list.innerHTML = "";

    items.forEach((d) => {
      const dKey = d.id || d.tradename; // مفتاح تمييز الدواء ✅
      const encoded = encodeURIComponent(JSON.stringify(d));

      const row = document.createElement("label");
      row.style = "display:block;padding:6px;border-bottom:1px solid #eee;";
      row.innerHTML = `
        <input type="checkbox" class="drug-select" value="${encoded}">
        ${d.tradename} - <small>${d.company || ""}</small>
      `;

      const checkbox = row.querySelector("input");
      if (selectedDrugs.has(dKey)) checkbox.checked = true; // ✅ تذكّر الاختيار

      checkbox.addEventListener("change", function () {
        if (this.checked) selectedDrugs.add(dKey);
        else selectedDrugs.delete(dKey);
      });

      list.appendChild(row);
    });
  }

  Swal.fire({
    title: "استيراد من الداتا الخارجية",
    html: `
      <input id="importSearch" placeholder="ابحث باسم الدواء..." 
      style="width:100%;padding:8px;margin-bottom:10px;text-align:right;">
      <div id="importList" style="max-height:320px;overflow:auto;"></div>
    `,
    width: 700,
    showCancelButton: true,
    confirmButtonText: "استيراد المحدد",
    cancelButtonText: "إغلاق",
    didOpen: () => {
      renderList(drugDataset.slice(0, LIMIT));

      document
        .getElementById("importSearch")
        .addEventListener("input", function () {
          const q = this.value.toLowerCase();
          const filtered = drugDataset
            .filter((d) => d.tradename.toLowerCase().includes(q))
            .slice(0, 300);
          renderList(filtered); // ✅ إعادة عرض مع الحفاظ على الاختيارات
        });
    },
  }).then((result) => {
    if (!result.isConfirmed) return;

    const selected = drugDataset.filter((d) =>
      selectedDrugs.has(d.id || d.tradename)
    );

    selected.forEach((d) => {
      const med = {
        id: Date.now() + Math.random(),
        name: d.tradename,
        barcode: "",
        company: d.company || "",
        imageURL: "",
        price: d.new_price || "",
        discount: "0",
        total: d.new_price || "",
        count: "1",
        expiryDate: "",
        sell: 0,
      };
      medications.push(med);
    });

    saveData();
    showMedications();
    renderProductsGrid();
    updateStats();

    Swal.fire("تم", `✅ تم إضافة ${selected.length} دواء للنظام`, "success");

    selectedDrugs.clear(); // تنظيف الذاكرة بعد العملية
  });
}

if (importBtn) importBtn.addEventListener("click", openImportModal);

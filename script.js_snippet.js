
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

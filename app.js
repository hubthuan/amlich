/**
 * ÂM LỊCH VIỆT NAM - APPLICATION CONTROLLER
 * Xử lý logic giao diện, chuyển đổi âm dương, hiển thị lịch tháng, lịch bloc,
 * giờ hoàng đạo, tiết khí và ngày lễ truyền thống.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. DỮ LIỆU CỐ ĐỊNH & TRA CỨU
  // =========================================================================

  const CON_GIAP = [
    { name: "Tý", animal: "Chuột", icon: "🐭" },
    { name: "Sửu", animal: "Trâu", icon: "🐮" },
    { name: "Dần", animal: "Hổ", icon: "🐯" },
    { name: "Mão", animal: "Mèo", icon: "🐱" },
    { name: "Thìn", animal: "Rồng", icon: "🐲" },
    { name: "Tỵ", animal: "Rắn", icon: "🐍" },
    { name: "Ngọ", animal: "Ngựa", icon: "🐴" },
    { name: "Mùi", animal: "Dê", icon: "🐐" },
    { name: "Thân", animal: "Khỉ", icon: "🐵" },
    { name: "Dậu", animal: "Gà", icon: "🐔" },
    { name: "Tuất", animal: "Chó", icon: "🐶" },
    { name: "Hợi", animal: "Lợn", icon: "🐷" }
  ];

  const HOUR_RANGES = [
    "23h - 01h", "01h - 03h", "03h - 05h", "05h - 07h",
    "07h - 09h", "09h - 11h", "11h - 13h", "13h - 15h",
    "15h - 17h", "17h - 19h", "19h - 21h", "21h - 23h"
  ];

  const QUOTES = [
    "Thuận thiên giả tồn, nghịch thiên giả vong.",
    "Lời nói chẳng mất tiền mua, lựa lời mà nói cho vừa lòng nhau.",
    "Ăn quả nhớ kẻ trồng cây, uống nước nhớ nguồn.",
    "Có công mài sắt, có ngày nên kim.",
    "Gieo nhân nào gặt quả nấy.",
    "Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao.",
    "Đất có tuần, nhân có vận.",
    "Học thầy không tày học bạn.",
    "Khéo ăn thì no, khéo co thì ấm.",
    "Nhất cận thị, nhị cận giang, tam cận lộ.",
    "Tấc đất tấc vàng.",
    "Đi một ngày đàng, học một sàng khôn.",
    "Tháng tám giỗ Cha, tháng ba giỗ Mẹ.",
    "Gia hòa vạn sự hưng."
  ];

  // Danh sách sự kiện ngày lễ (Dương lịch & Âm lịch)
  const SOLAR_HOLIDAYS = [
    { day: 1, month: 1, name: "Tết Dương Lịch", desc: "Năm mới quốc tế" },
    { day: 14, month: 2, name: "Lễ Tình Nhân (Valentine)", desc: "Ngày tôn vinh tình yêu" },
    { day: 27, month: 2, name: "Ngày Thầy Thuốc Việt Nam", desc: "Kỷ niệm ngành y tế Việt Nam" },
    { day: 8, month: 3, name: "Quốc Tế Phụ Nữ", desc: "Kỷ niệm phụ nữ toàn cầu" },
    { day: 26, month: 3, name: "Ngày Thành Lập Đoàn TNCS Hồ Chí Minh", desc: "Ngày thanh niên Việt Nam" },
    { day: 30, month: 4, name: "Giải Phóng Miền Nam", desc: "Thống nhất đất nước (30/4/1975)" },
    { day: 1, month: 5, name: "Quốc Tế Lao Động", desc: "Ngày hội của người lao động" },
    { day: 19, month: 5, name: "Ngày Sinh Chủ Tịch Hồ Chí Minh", desc: "Kỷ niệm ngày sinh Bác Hồ (1890)" },
    { day: 1, month: 6, name: "Quốc Tế Thiếu Nhi", desc: "Tết của trẻ em" },
    { day: 28, month: 6, name: "Ngày Gia Đình Việt Nam", desc: "Tôn vinh mái ấm gia đình" },
    { day: 27, month: 7, name: "Ngày Thương Binh Liệt Sĩ", desc: "Uống nước nhớ nguồn" },
    { day: 19, month: 8, name: "Cách Mạng Tháng Tám", desc: "Kỷ niệm CMT8 thành công (1945)" },
    { day: 2, month: 9, name: "Quốc Khánh Việt Nam", desc: "Bác Hồ đọc Tuyên ngôn Độc lập (1945)" },
    { day: 10, month: 10, name: "Giải Phóng Thủ Đô", desc: "Kỷ niệm giải phóng Hà Nội (1954)" },
    { day: 20, month: 10, name: "Ngày Phụ Nữ Việt Nam", desc: "Tôn vinh phụ nữ Việt Nam" },
    { day: 20, month: 11, name: "Ngày Nhà Giáo Việt Nam", desc: "Tri ân thầy cô giáo" },
    { day: 22, month: 12, name: "Thành Lập Quân Đội Nhân Dân VN", desc: "Ngày hội Quốc phòng toàn dân" },
    { day: 25, month: 12, name: "Lễ Giáng Sinh (Noel)", desc: "Lễ Giáng sinh mừng Chúa Giáng Sinh" }
  ];

  const LUNAR_HOLIDAYS = [
    { day: 1, month: 1, name: "Tết Nguyên Đán (Mùng 1)", desc: "Tết Cả đầu năm, sum vầy gia đình" },
    { day: 2, month: 1, name: "Tết Nguyên Đán (Mùng 2)", desc: "Mùng một tết cha, mùng hai tết mẹ" },
    { day: 3, month: 1, name: "Tết Nguyên Đán (Mùng 3)", desc: "Mùng ba tết thầy" },
    { day: 15, month: 1, name: "Tết Nguyên Tiêu (Rằm tháng Giêng)", desc: "Lễ Phật đầu năm cầu an khang" },
    { day: 3, month: 3, name: "Tết Hàn Thực", desc: "Bánh trôi, bánh chay nhớ tổ tiên" },
    { day: 10, month: 3, name: "Giỗ Tổ Hùng Vương", desc: "Dù ai đi ngược về xuôi, nhớ ngày Giỗ Tổ" },
    { day: 15, month: 4, name: "Đại Lễ Phật Đản", desc: "Kỷ niệm Đức Phật Thích Ca Đản sinh" },
    { day: 5, month: 5, name: "Tết Đoan Ngọ (Giết sâu bọ)", desc: "Tết diệt trừ sâu bọ mùa màng" },
    { day: 7, month: 7, name: "Lễ Thất Tịch", desc: "Ngưu Lang - Chức Nữ hội ngộ cầu Ô Thước" },
    { day: 15, month: 7, name: "Lễ Vu Lan & Trung Nguyên", desc: "Báo hiếu cha mẹ và xá tội vong nhân" },
    { day: 15, month: 8, name: "Tết Trung Thu (Rằm tháng 8)", desc: "Tết đoàn viên, rước đèn phá cỗ" },
    { day: 9, month: 9, name: "Tết Trùng Cửu", desc: "Lên núi ngắm hoa cúc thưởng trà" },
    { day: 15, month: 10, name: "Tết Hạ Nguyên (Cơm mới)", desc: "Lễ mừng lúa mới, tạ ơn trời đất" },
    { day: 23, month: 12, name: "Ông Táo Chầu Trời", desc: "Tiễn Táo Quân về chầu trời cưỡi cá chép" }
  ];

  // =========================================================================
  // 2. THUẬT TOÁN BỔ TRỢ (LUNAR TO SOLAR & ASTROLOGY)
  // =========================================================================

  /**
   * Chuyển đổi Âm lịch sang Dương lịch
   */
  function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, isLeap) {
    if (lunarYear < 1800 || lunarYear > 2199) {
      return { error: 'Năm ngoài phạm vi tính toán (1800 - 2199).' };
    }
    const ly = getYearInfo(lunarYear);
    let targetMonthIdx = -1;
    for (let i = 0; i < ly.length; i++) {
      if (ly[i].month === lunarMonth && ly[i].leap === (isLeap ? 1 : 0)) {
        targetMonthIdx = i;
        break;
      }
    }
    if (targetMonthIdx === -1) {
      return {
        error: isLeap
          ? `Năm ${lunarYear} không có tháng ${lunarMonth} nhuận.`
          : `Tháng ${lunarMonth} không hợp lệ trong năm ${lunarYear}.`
      };
    }

    const targetMonth = ly[targetMonthIdx];
    const nextMonthJd = (targetMonthIdx < ly.length - 1)
      ? ly[targetMonthIdx + 1].jd
      : getYearInfo(lunarYear + 1)[0].jd;
    const daysInMonth = nextMonthJd - targetMonth.jd;

    if (lunarDay < 1 || lunarDay > daysInMonth) {
      return {
        error: `Tháng ${lunarMonth}${isLeap ? ' nhuận' : ''} năm ${lunarYear} chỉ có ${daysInMonth} ngày (từ ngày 1 đến ngày ${daysInMonth}).`
      };
    }

    const jd = targetMonth.jd + lunarDay - 1;
    const solar = jdn2date(jd);
    return {
      solarDay: solar[0],
      solarMonth: solar[1],
      solarYear: solar[2],
      jd: jd,
      daysInMonth: daysInMonth,
      dayOfWeek: TUAN[(jd + 1) % 7]
    };
  }

  /**
   * Lấy hướng xuất hành: Hỷ Thần và Tài Thần theo Can ngày
   */
  function getDirections(canIndex) {
    const hyThan = [
      "Đông Bắc", // Giáp
      "Tây Bắc",  // Ất
      "Tây Nam",  // Bính
      "Chính Nam",// Đinh
      "Đông Nam", // Mậu
      "Đông Bắc", // Kỷ
      "Tây Bắc",  // Canh
      "Tây Nam",  // Tân
      "Chính Nam",// Nhâm
      "Đông Nam"  // Quý
    ];

    const taiThan = [
      "Đông Nam", // Giáp
      "Đông Nam", // Ất
      "Chính Đông",// Bính
      "Chính Đông",// Đinh
      "Chính Bắc", // Mậu
      "Chính Nam", // Kỷ
      "Chính Tây", // Canh
      "Chính Tây", // Tân
      "Chính Bắc", // Nhâm
      "Chính Nam"  // Quý
    ];

    return {
      hyThan: hyThan[canIndex],
      taiThan: taiThan[canIndex]
    };
  }

  /**
   * Lấy chi tiết 12 khung giờ (Hoàng đạo vs Hắc đạo)
   */
  function getHoursDetail(jd) {
    const chiOfDay = (jd + 1) % 12;
    const gioHD = GIO_HD[chiOfDay % 6];
    const can0 = (jd - 1) * 2 % 10;

    const list = [];
    for (let i = 0; i < 12; i++) {
      const isHoangDao = gioHD.charAt(i) === '1';
      const canName = CAN[(can0 + i) % 10];
      const chiName = CHI[i];
      const fullName = `${canName} ${chiName}`;
      list.push({
        index: i,
        chi: chiName,
        can: canName,
        fullName: fullName,
        range: HOUR_RANGES[i],
        isHoangDao: isHoangDao
      });
    }
    return list;
  }

  /**
   * Tìm sự kiện/ngày lễ theo ngày Dương & Âm
   */
  function findEventForDate(sDay, sMonth, lDay, lMonth) {
    const sEvt = SOLAR_HOLIDAYS.find(e => e.day === sDay && e.month === sMonth);
    if (sEvt) return sEvt.name;
    const lEvt = LUNAR_HOLIDAYS.find(e => e.day === lDay && e.month === lMonth);
    if (lEvt) return lEvt.name;
    return null;
  }

  // =========================================================================
  // 3. TRẠNG THÁI ỨNG DỤNG (STATE)
  // =========================================================================

  const state = {
    currentDate: new Date(),
    viewMonth: new Date().getMonth() + 1,
    viewYear: new Date().getFullYear(),
    blocDate: new Date(),
    activeTab: 'tab-month',
    theme: localStorage.getItem('amlich_theme') || 'light'
  };

  // =========================================================================
  // 4. KHỞI TẠO & SỰ KIỆN GIAO DIỆN
  // =========================================================================

  function initApp() {
    setupTheme();
    setupTabs();
    populateYearSelect();
    setupEventListeners();
    startClock();

    renderMonthView(state.viewYear, state.viewMonth);
    renderBlocView(state.blocDate);
    renderHolidaysView(state.viewYear);
    initConverterDefaults();
  }

  function setupTheme() {
    if (state.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.getElementById('themeIcon').textContent = '☀️';
      document.getElementById('themeLabel').textContent = 'Sáng';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.getElementById('themeIcon').textContent = '🌙';
      document.getElementById('themeLabel').textContent = 'Tối';
    }
  }

  function toggleTheme() {
    if (state.theme === 'dark') {
      state.theme = 'light';
    } else {
      state.theme = 'dark';
    }
    localStorage.setItem('amlich_theme', state.theme);
    setupTheme();
  }

  function setupTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        switchTab(targetId);
      });
    });
  }

  function switchTab(tabId) {
    state.activeTab = tabId;
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === tabId);
    });
  }

  function populateYearSelect() {
    const yearSelect = document.getElementById('yearSelect');
    yearSelect.innerHTML = '';
    for (let y = 1900; y <= 2100; y++) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = `Năm ${y}`;
      if (y === state.viewYear) opt.selected = true;
      yearSelect.appendChild(opt);
    }
    document.getElementById('monthSelect').value = state.viewMonth;
  }

  function setupEventListeners() {
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

    document.getElementById('prevMonthBtn').addEventListener('click', () => {
      changeMonth(-1);
    });
    document.getElementById('nextMonthBtn').addEventListener('click', () => {
      changeMonth(1);
    });
    document.getElementById('prevYearBtn').addEventListener('click', () => {
      changeYear(-1);
    });
    document.getElementById('nextYearBtn').addEventListener('click', () => {
      changeYear(1);
    });
    document.getElementById('todayMonthBtn').addEventListener('click', () => {
      const now = new Date();
      state.viewYear = now.getFullYear();
      state.viewMonth = now.getMonth() + 1;
      document.getElementById('monthSelect').value = state.viewMonth;
      document.getElementById('yearSelect').value = state.viewYear;
      renderMonthView(state.viewYear, state.viewMonth);
    });
    document.getElementById('monthSelect').addEventListener('change', (e) => {
      state.viewMonth = parseInt(e.target.value, 10);
      renderMonthView(state.viewYear, state.viewMonth);
    });
    document.getElementById('yearSelect').addEventListener('change', (e) => {
      state.viewYear = parseInt(e.target.value, 10);
      renderMonthView(state.viewYear, state.viewMonth);
    });

    document.getElementById('blocPrevDayBtn').addEventListener('click', () => {
      changeBlocDay(-1);
    });
    document.getElementById('blocNextDayBtn').addEventListener('click', () => {
      changeBlocDay(1);
    });
    document.getElementById('blocTodayBtn').addEventListener('click', () => {
      state.blocDate = new Date();
      renderBlocView(state.blocDate);
    });
    document.getElementById('blocDatePicker').addEventListener('change', (e) => {
      if (e.target.value) {
        state.blocDate = new Date(e.target.value);
        renderBlocView(state.blocDate);
      }
    });

    document.getElementById('btnConvertS2L').addEventListener('click', handleConvertS2L);
    document.getElementById('btnS2LToday').addEventListener('click', setS2LToday);
    document.getElementById('btnConvertL2S').addEventListener('click', handleConvertL2S);
    document.getElementById('btnL2STet').addEventListener('click', setL2STet);

    document.getElementById('holidayYearInput').addEventListener('change', (e) => {
      const y = parseInt(e.target.value, 10) || new Date().getFullYear();
      renderHolidaysView(y);
    });
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const cat = e.target.dataset.category;
        filterHolidaysCategory(cat);
      });
    });

    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.getElementById('dayDetailModal').addEventListener('click', (e) => {
      if (e.target.id === 'dayDetailModal') closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // =========================================================================
  // 5. ĐỒNG HỒ THỜI GIAN THỰC (LIVE CLOCK)
  // =========================================================================

  function startClock() {
    updateClockDisplay();
    setInterval(updateClockDisplay, 1000);
  }

  function updateClockDisplay() {
    const now = new Date();
    const d = now.getDate();
    const m = now.getMonth() + 1;
    const y = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    const ld = getLunarDate(d, m, y);
    const dayOfWeek = TUAN[now.getDay()];
    const canDay = CAN[(ld.jd + 9) % 10] + ' ' + CHI[(ld.jd + 1) % 12];
    const can0 = (ld.jd - 1) * 2 % 10;
    const chiGioIdx = (now.getHours() >= 23) ? 0 : Math.floor((now.getHours() + 1) / 2);
    const canGio = CAN[(can0 + chiGioIdx) % 10] + ' ' + CHI[chiGioIdx];

    const timeStr = `${dayOfWeek}, ${d}/${m}/${y} • ${hh}:${mm}:${ss} • Âm lịch: ${ld.day}/${ld.month} (${canDay}, Giờ ${canGio})`;
    const headerClockEl = document.getElementById('headerClock');
    if (headerClockEl) {
      headerClockEl.textContent = timeStr;
    }

    const blocLiveTimeEl = document.getElementById('blocLiveTime');
    if (blocLiveTimeEl && state.blocDate.toDateString() === now.toDateString()) {
      blocLiveTimeEl.textContent = `${hh}:${mm}:${ss}`;
    }
  }

  // =========================================================================
  // 6. RENDER LỊCH THÁNG (TAB 1)
  // =========================================================================

  function changeMonth(delta) {
    state.viewMonth += delta;
    if (state.viewMonth > 12) {
      state.viewMonth = 1;
      state.viewYear++;
    } else if (state.viewMonth < 1) {
      state.viewMonth = 12;
      state.viewYear--;
    }
    document.getElementById('monthSelect').value = state.viewMonth;
    document.getElementById('yearSelect').value = state.viewYear;
    renderMonthView(state.viewYear, state.viewMonth);
  }

  function changeYear(delta) {
    state.viewYear += delta;
    document.getElementById('yearSelect').value = state.viewYear;
    renderMonthView(state.viewYear, state.viewMonth);
  }

  function renderMonthView(yy, mm) {
    const titleEl = document.getElementById('monthTitleDisplay');
    const canChiSubEl = document.getElementById('monthCanChiDisplay');
    titleEl.textContent = `Tháng ${mm} / ${yy}`;

    const firstDayLunar = getLunarDate(1, mm, yy);
    const yearCanChi = getYearCanChi(firstDayLunar.year);
    const monthCanChi = CAN[(firstDayLunar.year * 12 + firstDayLunar.month + 3) % 10] + ' ' + CHI[(firstDayLunar.month + 1) % 12];
    canChiSubEl.textContent = `Năm ${yearCanChi} • Tháng ${monthCanChi}`;

    const grid = document.getElementById('calendarGrid');
    while (grid.children.length > 7) {
      grid.removeChild(grid.lastChild);
    }

    const daysInMonth = new Date(yy, mm, 0).getDate();
    const firstDayDow = new Date(yy, mm - 1, 1).getDay();
    const emptyCells = (firstDayDow === 0) ? 6 : firstDayDow - 1;

    for (let i = 0; i < emptyCells; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'cal-cell empty';
      grid.appendChild(emptyDiv);
    }

    const today = new Date();
    const isCurrentMonth = (today.getFullYear() === yy && today.getMonth() + 1 === mm);

    for (let d = 1; d <= daysInMonth; d++) {
      const solarDate = new Date(yy, mm - 1, d);
      const dow = solarDate.getDay();
      const lunar = getLunarDate(d, mm, yy);
      const isToday = isCurrentMonth && (today.getDate() === d);
      const eventName = findEventForDate(d, mm, lunar.day, lunar.month);

      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      if (dow === 0) cell.classList.add('sun');
      if (dow === 6) cell.classList.add('sat');
      if (isToday) cell.classList.add('today');
      if (eventName) cell.classList.add('has-event');

      const cellTop = document.createElement('div');
      cellTop.className = 'cell-top';

      const solarSpan = document.createElement('span');
      solarSpan.className = 'solar-day';
      solarSpan.textContent = d;
      cellTop.appendChild(solarSpan);

      if (isToday) {
        const todayTag = document.createElement('span');
        todayTag.className = 'today-tag';
        todayTag.textContent = 'Hôm nay';
        cellTop.appendChild(todayTag);
      } else if (eventName) {
        const evtDot = document.createElement('span');
        evtDot.className = 'hoangdao-badge';
        evtDot.textContent = '🏮';
        evtDot.title = eventName;
        cellTop.appendChild(evtDot);
      }
      cell.appendChild(cellTop);

      if (eventName) {
        const evtText = document.createElement('div');
        evtText.className = 'event-dot';
        evtText.textContent = eventName;
        cell.appendChild(evtText);
      }

      const cellBottom = document.createElement('div');
      cellBottom.className = 'cell-bottom';

      const lunarSpan = document.createElement('span');
      lunarSpan.className = 'lunar-day';

      if (lunar.day === 1 || d === 1) {
        lunarSpan.classList.add('first-day');
        lunarSpan.textContent = `${lunar.day}/${lunar.month}${lunar.leap ? 'n' : ''}`;
      } else if (lunar.day === 15) {
        lunarSpan.classList.add('full-moon');
        lunarSpan.textContent = `${lunar.day}/${lunar.month}`;
      } else {
        lunarSpan.textContent = lunar.day;
      }
      cellBottom.appendChild(lunarSpan);

      cell.appendChild(cellBottom);

      cell.addEventListener('click', () => {
        openDayDetailModal(d, mm, yy, lunar);
      });

      grid.appendChild(cell);
    }
  }

  // =========================================================================
  // 7. RENDER LỊCH BLOC NGÀY (TAB 2)
  // =========================================================================

  function changeBlocDay(delta) {
    const cur = new Date(state.blocDate);
    cur.setDate(cur.getDate() + delta);
    state.blocDate = cur;
    renderBlocView(state.blocDate);
  }

  function renderBlocView(date) {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();

    const yyyy = y;
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    document.getElementById('blocDatePicker').value = `${yyyy}-${mm}-${dd}`;

    const lunar = getLunarDate(d, m, y);
    const dayOfWeek = TUAN[date.getDay()];

    document.getElementById('blocSolarMonthYear').textContent = `Tháng ${m} Năm ${y}`;
    document.getElementById('blocDayOfWeek').textContent = dayOfWeek;
    document.getElementById('blocSolarDay').textContent = String(d).padStart(2, '0');

    document.getElementById('blocLunarDay').textContent = lunar.day;
    const nhuanStr = lunar.leap ? ' (Nhuận)' : '';
    document.getElementById('blocLunarMonth').textContent = `Tháng ${THANG[lunar.month - 1]}${nhuanStr}`;
    document.getElementById('blocLunarYear').textContent = `Năm ${getYearCanChi(lunar.year)}`;

    const quoteIndex = (d + m * 3) % QUOTES.length;
    document.getElementById('blocQuote').textContent = `"${QUOTES[quoteIndex]}"`;

    const eventName = findEventForDate(d, m, lunar.day, lunar.month);
    const evtBadge = document.getElementById('blocEventBadge');
    if (eventName) {
      evtBadge.style.display = 'inline-block';
      evtBadge.textContent = `🏮 ${eventName}`;
    } else {
      evtBadge.style.display = 'none';
    }

    const canDay = CAN[(lunar.jd + 9) % 10] + ' ' + CHI[(lunar.jd + 1) % 12];
    const canMonth = CAN[(lunar.year * 12 + lunar.month + 3) % 10] + ' ' + CHI[(lunar.month + 1) % 12];
    const canYear = getYearCanChi(lunar.year);
    const canHour0 = getCanHour0(lunar.jd) + ' Tý';
    const solarTerm = TIETKHI[getSunLongitude(lunar.jd + 1, 7.0)];

    document.getElementById('blocCanChiDay').textContent = canDay;
    document.getElementById('blocCanChiMonth').textContent = canMonth;
    document.getElementById('blocCanChiYear').textContent = canYear;
    document.getElementById('blocSolarTerm').textContent = solarTerm;
    document.getElementById('blocCanHour0').textContent = canHour0;
    document.getElementById('blocJdn').textContent = lunar.jd;

    const canDayIndex = (lunar.jd + 9) % 10;
    const directions = getDirections(canDayIndex);
    document.getElementById('blocHyThan').textContent = directions.hyThan;
    document.getElementById('blocTaiThan').textContent = directions.taiThan;

    const hours = getHoursDetail(lunar.jd);
    const hoangDaoContainer = document.getElementById('blocHoangDaoTags');
    const hacDaoContainer = document.getElementById('blocHacDaoTags');
    hoangDaoContainer.innerHTML = '';
    hacDaoContainer.innerHTML = '';

    hours.forEach(h => {
      const tag = document.createElement('span');
      tag.className = 'hour-badge';
      tag.textContent = `${h.fullName} (${h.range})`;

      if (h.isHoangDao) {
        tag.classList.add('auspicious');
        hoangDaoContainer.appendChild(tag);
      } else {
        hacDaoContainer.appendChild(tag);
      }
    });
  }

  // =========================================================================
  // 8. ĐỔI NGÀY ÂM - DƯƠNG (TAB 3)
  // =========================================================================

  function initConverterDefaults() {
    const today = new Date();
    setS2LToday();

    document.getElementById('l2s_day').value = 1;
    document.getElementById('l2s_month').value = 1;
    document.getElementById('l2s_year').value = today.getFullYear();
    document.getElementById('l2s_leap').checked = false;
  }

  function setS2LToday() {
    const today = new Date();
    document.getElementById('s2l_day').value = today.getDate();
    document.getElementById('s2l_month').value = today.getMonth() + 1;
    document.getElementById('s2l_year').value = today.getFullYear();
    handleConvertS2L();
  }

  function handleConvertS2L() {
    const d = parseInt(document.getElementById('s2l_day').value, 10);
    const m = parseInt(document.getElementById('s2l_month').value, 10);
    const y = parseInt(document.getElementById('s2l_year').value, 10);

    const resultBox = document.getElementById('s2lResultBox');
    const resultMain = document.getElementById('s2lResultMain');
    const resultMeta = document.getElementById('s2lResultMeta');

    if (isNaN(d) || isNaN(m) || isNaN(y) || d < 1 || d > 31 || m < 1 || m > 12 || y < 1800 || y > 2199) {
      alert('Vui lòng nhập ngày, tháng, năm hợp lệ (1800 - 2199).');
      return;
    }

    const lunar = getLunarDate(d, m, y);
    const dayOfWeek = TUAN[(lunar.jd + 1) % 7];
    const canDay = CAN[(lunar.jd + 9) % 10] + ' ' + CHI[(lunar.jd + 1) % 12];
    const canMonth = CAN[(lunar.year * 12 + lunar.month + 3) % 10] + ' ' + CHI[(lunar.month + 1) % 12];
    const canYear = getYearCanChi(lunar.year);
    const solarTerm = TIETKHI[getSunLongitude(lunar.jd + 1, 7.0)];
    const hoangDaoList = getGioHoangDao(lunar.jd);

    resultBox.style.display = 'block';
    resultMain.textContent = `Ngày ${lunar.day} tháng ${lunar.month}${lunar.leap ? ' (nhuận)' : ''} năm ${lunar.year}`;
    resultMeta.innerHTML = `
      <strong>Thứ:</strong> ${dayOfWeek} (${d}/${m}/${y})<br>
      <strong>Can Chi:</strong> Năm ${canYear} • Tháng ${canMonth} • Ngày ${canDay}<br>
      <strong>Tiết khí:</strong> ${solarTerm} • <strong>Giờ đầu ngày:</strong> ${getCanHour0(lunar.jd)} Tý<br>
      <strong>Giờ Hoàng Đạo:</strong> ${hoangDaoList.replace(/\n/g, ' ')}
    `;
  }

  function setL2STet() {
    const today = new Date();
    document.getElementById('l2s_day').value = 1;
    document.getElementById('l2s_month').value = 1;
    document.getElementById('l2s_year').value = today.getFullYear();
    document.getElementById('l2s_leap').checked = false;
    handleConvertL2S();
  }

  function handleConvertL2S() {
    const d = parseInt(document.getElementById('l2s_day').value, 10);
    const m = parseInt(document.getElementById('l2s_month').value, 10);
    const y = parseInt(document.getElementById('l2s_year').value, 10);
    const isLeap = document.getElementById('l2s_leap').checked;

    const resultBox = document.getElementById('l2sResultBox');
    const resultMain = document.getElementById('l2sResultMain');
    const resultMeta = document.getElementById('l2sResultMeta');

    if (isNaN(d) || isNaN(m) || isNaN(y) || d < 1 || d > 30 || m < 1 || m > 12 || y < 1800 || y > 2199) {
      alert('Vui lòng nhập ngày, tháng, năm âm lịch hợp lệ (1800 - 2199).');
      return;
    }

    const res = convertLunar2Solar(d, m, y, isLeap);
    if (res.error) {
      alert(res.error);
      return;
    }

    resultBox.style.display = 'block';
    resultMain.textContent = `Ngày ${String(res.solarDay).padStart(2, '0')}/${String(res.solarMonth).padStart(2, '0')}/${res.solarYear}`;
    resultMeta.innerHTML = `
      <strong>Thứ:</strong> ${res.dayOfWeek}<br>
      <strong>Số ngày của tháng ${m} âm lịch:</strong> ${res.daysInMonth} ngày<br>
      <strong>Julian Day Number:</strong> ${res.jd}
    `;
  }

  // =========================================================================
  // 9. NGÀY LỄ & SỰ KIỆN (TAB 4)
  // =========================================================================

  let currentHolidaysList = [];

  function renderHolidaysView(year) {
    const grid = document.getElementById('holidaysGrid');
    grid.innerHTML = '';
    currentHolidaysList = [];

    SOLAR_HOLIDAYS.forEach(item => {
      currentHolidaysList.push({
        type: 'solar',
        title: item.name,
        desc: item.desc,
        displayDay: item.day,
        displayMonth: item.month,
        dateKey: item.month * 100 + item.day,
        solarDateString: `${item.day}/${item.month}/${year}`
      });
    });

    LUNAR_HOLIDAYS.forEach(item => {
      const conv = convertLunar2Solar(item.day, item.month, year, false);
      let sDateStr = 'Không tìm thấy';
      let sortKey = 9999;
      if (!conv.error) {
        sDateStr = `${conv.solarDay}/${conv.solarMonth}/${conv.solarYear} (${conv.dayOfWeek})`;
        sortKey = conv.solarMonth * 100 + conv.solarDay;
      }
      currentHolidaysList.push({
        type: 'lunar',
        title: item.name,
        desc: item.desc,
        displayDay: item.day,
        displayMonth: item.month,
        dateKey: sortKey,
        solarDateString: sDateStr
      });
    });

    currentHolidaysList.sort((a, b) => a.dateKey - b.dateKey);

    renderHolidayCards(currentHolidaysList);
  }

  function renderHolidayCards(list) {
    const grid = document.getElementById('holidaysGrid');
    grid.innerHTML = '';

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = `holiday-card ${item.type}`;

      const badge = document.createElement('div');
      badge.className = 'holiday-date-badge';
      badge.innerHTML = `
        <div class="h-day">${item.displayDay}</div>
        <div class="h-month">${item.type === 'lunar' ? 'ÂL Th.' + item.displayMonth : 'Tháng ' + item.displayMonth}</div>
      `;
      card.appendChild(badge);

      const info = document.createElement('div');
      info.className = 'holiday-info';
      info.innerHTML = `
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
        <p style="font-weight: 600; color: var(--primary); margin-top: 0.25rem;">
          📅 Dương lịch: ${item.solarDateString}
        </p>
      `;
      card.appendChild(info);

      grid.appendChild(card);
    });
  }

  function filterHolidaysCategory(category) {
    if (category === 'all') {
      renderHolidayCards(currentHolidaysList);
    } else {
      const filtered = currentHolidaysList.filter(item => item.type === category);
      renderHolidayCards(filtered);
    }
  }

  // =========================================================================
  // 10. MODAL CHI TIẾT NGÀY (DAY DETAIL MODAL)
  // =========================================================================

  function openDayDetailModal(sDay, sMonth, sYear, lunar) {
    const modal = document.getElementById('dayDetailModal');
    const title = document.getElementById('modalDateTitle');
    const body = document.getElementById('modalBodyContent');

    const dow = TUAN[(lunar.jd + 1) % 7];
    title.textContent = `${dow}, Ngày ${sDay}/${sMonth}/${sYear}`;

    const canDay = CAN[(lunar.jd + 9) % 10] + ' ' + CHI[(lunar.jd + 1) % 12];
    const canMonth = CAN[(lunar.year * 12 + lunar.month + 3) % 10] + ' ' + CHI[(lunar.month + 1) % 12];
    const canYear = getYearCanChi(lunar.year);
    const solarTerm = TIETKHI[getSunLongitude(lunar.jd + 1, 7.0)];
    const directions = getDirections((lunar.jd + 9) % 10);
    const hours = getHoursDetail(lunar.jd);
    const eventName = findEventForDate(sDay, sMonth, lunar.day, lunar.month);

    let hoangDaoBadges = '';
    let hacDaoBadges = '';
    hours.forEach(h => {
      const badge = `<span class="hour-badge ${h.isHoangDao ? 'auspicious' : ''}">${h.fullName} (${h.range})</span>`;
      if (h.isHoangDao) {
        hoangDaoBadges += badge;
      } else {
        hacDaoBadges += badge;
      }
    });

    body.innerHTML = `
      ${eventName ? `<div style="background: var(--primary-light); border: 1px solid var(--primary-border); color: var(--primary); padding: 0.75rem; border-radius: 10px; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;"><span>🏮</span> ${eventName}</div>` : ''}

      <div class="info-grid" style="margin-bottom: 1.25rem;">
        <div class="info-item">
          <div class="info-label">🌙 Âm Lịch</div>
          <div class="info-value" style="color: var(--primary);">Ngày ${lunar.day} tháng ${lunar.month}${lunar.leap ? ' (nhuận)' : ''}</div>
        </div>
        <div class="info-item">
          <div class="info-label">🎋 Can Chi Ngày</div>
          <div class="info-value">${canDay}</div>
        </div>
        <div class="info-item">
          <div class="info-label">🌾 Tiết Khí</div>
          <div class="info-value">${solarTerm}</div>
        </div>
        <div class="info-item">
          <div class="info-label">🐎 Năm Can Chi</div>
          <div class="info-value">${canYear}</div>
        </div>
        <div class="info-item">
          <div class="info-label">🧭 Hướng Hỷ Thần</div>
          <div class="info-value">${directions.hyThan}</div>
        </div>
        <div class="info-item">
          <div class="info-label">💰 Hướng Tài Thần</div>
          <div class="info-value">${directions.taiThan}</div>
        </div>
      </div>

      <div class="hoangdao-list-card" style="margin-bottom: 1rem;">
        <h4>⭐ Các Giờ Hoàng Đạo (Tốt):</h4>
        <div class="hoangdao-tags">${hoangDaoBadges}</div>
      </div>

      <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.6rem;">⏳ Các Giờ Hắc Đạo:</h4>
        <div class="hoangdao-tags">${hacDaoBadges}</div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
        <button class="btn btn-primary" id="btnViewInBloc">Xem Trên Lịch Bloc Ngày</button>
      </div>
    `;

    document.getElementById('btnViewInBloc').addEventListener('click', () => {
      closeModal();
      state.blocDate = new Date(sYear, sMonth - 1, sDay);
      renderBlocView(state.blocDate);
      switchTab('tab-day');
    });

    modal.classList.add('open');
  }

  function closeModal() {
    document.getElementById('dayDetailModal').classList.remove('open');
  }

  window.addEventListener('DOMContentLoaded', initApp);

})();

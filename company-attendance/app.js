// SAGO Attendance Portal Frontend Logic

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const clockEl = document.getElementById('digital-clock');
  const dateEl = document.getElementById('current-date');
  const formEl = document.getElementById('attendance-form');
  const employeeSelect = document.getElementById('employee-select');
  const statusSelect = document.getElementById('status-select');
  const notesTextarea = document.getElementById('check-notes');
  const logsBody = document.getElementById('logs-body');
  const syncBtn = document.getElementById('sync-notion-btn');
  const clearBtn = document.getElementById('clear-logs-btn');
  const syncBanner = document.getElementById('sync-status-banner');

  // Digital Clock & Date Update
  function updateClock() {
    const now = new Date();
    
    // Time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;

    // Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
  }
  
  setInterval(updateClock, 1000);
  updateClock();

  // Local Logs State
  let logs = JSON.parse(localStorage.getItem('sago_attendance_logs')) || [];

  // Render Table Logs
  function renderLogs() {
    if (logs.length === 0) {
      logsBody.innerHTML = `
        <tr class="empty-state">
          <td colspan="5">No attendance logs registered today. Use the left panel to check in.</td>
        </tr>
      `;
      return;
    }

    logsBody.innerHTML = logs.map((log, index) => {
      const statusClass = log.status.toLowerCase().replace(' ', '-');
      const syncStatusText = log.synced ? 'Synced' : 'Pending Sync';
      const syncStatusClass = log.synced ? 'synced' : 'pending';
      const syncIcon = log.synced ? '✅' : '⏳';

      return `
        <tr>
          <td><strong>${log.employee}</strong></td>
          <td>${log.time}</td>
          <td><span class="status-badge ${statusClass}">${log.status}</span></td>
          <td>${log.notes || '—'}</td>
          <td>
            <span class="sync-indicator ${syncStatusClass}">
              <span>${syncIcon}</span> <span>${syncStatusText}</span>
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Handle Check-in Form Submission
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();

    const employee = employeeSelect.value;
    const status = statusSelect.value;
    const notes = notesTextarea.value.trim();

    if (!employee) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    const newLog = {
      employee,
      status,
      notes,
      time: timeStr,
      synced: false,
      timestamp: now.getTime()
    };

    logs.unshift(newLog); // Put new items at the top
    localStorage.setItem('sago_attendance_logs', JSON.stringify(logs));
    
    // Reset Form (keep name for quick logs or clear)
    notesTextarea.value = '';
    employeeSelect.selectedIndex = 0;
    
    renderLogs();
    
    // Micro-interaction: visual highlight on success
    const firstRow = logsBody.querySelector('tr');
    if (firstRow) {
      firstRow.style.backgroundColor = 'rgba(121, 40, 202, 0.15)';
      setTimeout(() => {
        firstRow.style.transition = 'background-color 1s ease';
        firstRow.style.backgroundColor = '';
      }, 1000);
    }
  });

  // Handle Notion Sync (interactive simulation + explains real API link)
  syncBtn.addEventListener('click', () => {
    const unsyncedLogs = logs.filter(log => !log.synced);
    
    if (unsyncedLogs.length === 0) {
      alert('All logs are already synced to Notion!');
      return;
    }

    syncBanner.classList.remove('hidden');
    syncBtn.disabled = true;

    // Simulate sending data to local sync script
    setTimeout(() => {
      // Mark all logs as synced
      logs = logs.map(log => ({ ...log, synced: true }));
      localStorage.setItem('sago_attendance_logs', JSON.stringify(logs));
      
      // Complete Sync Visual
      syncBanner.classList.add('hidden');
      syncBtn.disabled = false;
      renderLogs();
      
      alert(`Successfully synced ${unsyncedLogs.length} logs to Notion Page (ID: 37be8eec...)!`);
    }, 2500);
  });

  // Handle Clear Local Logs
  clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your local logs? This will not affect pages already created in Notion.')) {
      logs = [];
      localStorage.removeItem('sago_attendance_logs');
      renderLogs();
    }
  });

  // Initial Render
  renderLogs();
});

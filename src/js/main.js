function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(t => {
    t.classList.remove('active');
    t.style.display = 'none';
  });
  const activeSection = document.getElementById(tab);
  if (activeSection) {
    activeSection.classList.add('active');
    activeSection.style.display = 'block';
  }

  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('text-yellow-300', 'active'));
  const activeBtn = document.getElementById(`btn-${tab}`);
  if (activeBtn) activeBtn.classList.add('text-yellow-300', 'active');
}

function toggleSelect() {
  const estadoSelect = document.getElementById("estadoSelect");
  const cidadeSelect = document.getElementById("cidadeSelect");
  const biomaSelect = document.getElementById("biomaSelect");
  const mapType = document.querySelector('input[name="mapType"]:checked').value;
  if (mapType === "estado") {
    estadoSelect.classList.remove("hidden");
    cidadeSelect.classList.remove("hidden");
    biomaSelect.classList.add("hidden");
  } else {
    estadoSelect.classList.add("hidden");
    cidadeSelect.classList.add("hidden");
    biomaSelect.classList.remove("hidden");
  }
}

const map = L.map('mapid').setView([-15.78, -47.93], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);
function toggleMenu() {
  const nav = document.querySelector('.nav-container');
  nav.classList.toggle('hidden');
}

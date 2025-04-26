let sviVremenskiPodaci = [];
let plan = [];

fetch('weather.csv')
  .then(res => res.text())
  .then(csv => {
    const rezultat = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: h => h.trim()
    });

    sviVremenskiPodaci = rezultat.data.map((p, index) => ({
      id: p["ID"] || `W${1000 + index}`,
      location: p["Location"],
      season: p["Season"],
      temperature: parseFloat(p["Temperature"]),
      weatherType: p["Weather Type"]
    }));
    const prvih20_weather = sviVremenskiPodaci.slice(0, 10);
    prikaziVremenskePodatke(prvih20_weather);
  })
  .catch(err => {
    console.error('Greška pri učitavanju CSV-a:', err);
  });

function prikaziVremenskePodatke(podaci) {
  const tbody = document.querySelector('#weather-table tbody');
  tbody.innerHTML = '';
  for (const podatak of podaci) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${podatak.location}</td>
      <td>${podatak.season}</td>
      <td>${podatak.temperature}°C</td>
      <td>${podatak.weatherType}</td>
      <td><button class="dodaj-u-plan">Dodaj</button></td>
    `;
    const btn = row.querySelector(".dodaj-u-plan");
    btn.addEventListener("click", () => dodajUPlan(podatak));
    tbody.appendChild(row);
  }
}

const tempInput = document.getElementById('filter-temperature');
const tempDisplay = document.getElementById('temperature-value');
tempInput.addEventListener('input', () => {
  tempDisplay.textContent = tempInput.value + '°C';
});

document.getElementById('apply-filters').addEventListener('click', () => {
  const sezona = document.getElementById('filter-season').value.trim().toLowerCase();
  const lokacija = document.getElementById('filter-location').value.trim().toLowerCase();
  const temperatura = parseInt(document.getElementById('filter-temperature').value);
  const vrstaVremena = document.getElementById('filter-weather').value.trim().toLowerCase();

  const filtrirani = sviVremenskiPodaci.filter(p => {
    const sezonaMatch = !sezona || p.season.toLowerCase().includes(sezona);
    const lokacijaMatch = !lokacija || p.location.toLowerCase().includes(lokacija);
    const temperaturaMatch = p.temperature >= temperatura;
    const vrijemeMatch = !vrstaVremena || p.weatherType.toLowerCase().includes(vrstaVremena);
    return sezonaMatch && lokacijaMatch && temperaturaMatch && vrijemeMatch;
  });

  prikaziVremenskePodatke(filtrirani);
});

function dodajUPlan(dan) {
  if (!plan.includes(dan)) {
    plan.push(dan);
    osvjeziPlan();
  } else {
    alert("Dan je već u planu!");
  }
}

function osvjeziPlan() {
  const lista = document.getElementById("lista-plana");
  lista.innerHTML = "";
  plan.forEach((dan, index) => {
    const li = document.createElement("li");
    li.textContent = `${dan.id} - ${dan.temperature}°C - ${dan.location} - ${dan.weatherType}`;
    const ukloni = document.createElement("button");
    ukloni.textContent = "Ukloni";
    ukloni.onclick = () => {
      plan.splice(index, 1);
      osvjeziPlan();
    };
    li.appendChild(ukloni);
    lista.appendChild(li);
  });
}

document.getElementById("potvrdi-plan").addEventListener("click", () => {
  if (plan.length === 0) {
    alert("Plan je prazan.");
  } else {
    alert(`Uspješno ste isplanirali ${plan.length} dan(a) za aktivnosti!`);
    plan = [];
    osvjeziPlan();
  }
});

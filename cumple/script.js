const musica = document.getElementById("musica");
const musicBtn = document.getElementById("musicBtn");

// REPRODUCTOR
function toggleMusic() {
  if (!musica) return;

  if (musica.paused) {
    musica.play();
    musicBtn.textContent = "Ⅱ";
  } else {
    musica.pause();
    musicBtn.textContent = "▶";
  }
}

// CONFETI
const colores = [
  "#168bfa",
  "#72c5ff",
  "#ffffff",
  "#b6ddff",
  "#ffd166",
  "#55a8ed",
];

function crearConfeti(cantidad = 30) {
  const contenedor = document.getElementById("confetti-container");
  if (!contenedor) return;

  for (let i = 0; i < cantidad; i++) {
    const pieza = document.createElement("div");

    pieza.className = "confeti";
    pieza.style.left = Math.random() * 100 + "%";
    pieza.style.background =
      colores[Math.floor(Math.random() * colores.length)];

    const duracion = Math.random() * 4 + 4;
    pieza.style.animationDuration = duracion + "s";
    pieza.style.animationDelay = Math.random() * 2 + "s";
    pieza.style.opacity = Math.random() * 0.7 + 0.3;

    contenedor.appendChild(pieza);

    setTimeout(() => pieza.remove(), (duracion + 2) * 1000);
  }
}

// CONFETI CONTINUO
crearConfeti(65);

setInterval(() => {
  crearConfeti(5);
}, 900);

// EXPLOSIÓN DE CONFETI
function lanzarConfeti() {
  crearConfeti(120);
}

// TORTA
function apagarVelas() {
  const velas = document.querySelectorAll(".vela");

  if (velas.length === 0) return;

  velas.forEach((vela) => {
    vela.classList.add("apagada");
  });

  const mensaje = document.getElementById("mensajeTorta");

  if (mensaje) {
    mensaje.textContent =
      "¡Deseo pedido! Que se cumplan todos tus sueños, Franklin. 💙";
  }

  const sorpresa = document.getElementById("sorpresa");

  if (sorpresa) {
    sorpresa.classList.add("mostrar");
  }

  const micBtn = document.getElementById("micBtn");

  if (micBtn) {
    micBtn.textContent = "¡Velitas apagadas! 🎉";
    micBtn.disabled = true;
  }

  lanzarConfeti();
}

// DETECCIÓN DE SOPLIDO
let microfonoActivo = false;

async function activarMicrofono() {
  if (microfonoActivo) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const contexto = new (window.AudioContext || window.webkitAudioContext)();

    const fuente = contexto.createMediaStreamSource(stream);
    const analizador = contexto.createAnalyser();

    analizador.fftSize = 1024;
    fuente.connect(analizador);

    const datos = new Uint8Array(analizador.fftSize);

    microfonoActivo = true;

    document.getElementById("mensajeTorta").textContent =
      "¡Sopla ahora hacia tu micrófono! 🎤";

    function detectarSoplido() {
      if (!microfonoActivo) return;

      analizador.getByteTimeDomainData(datos);

      let suma = 0;

      for (let i = 0; i < datos.length; i++) {
        const valor = (datos[i] - 128) / 128;
        suma += valor * valor;
      }

      const volumen = Math.sqrt(suma / datos.length);

      if (volumen > 0.18) {
        microfonoActivo = false;
        apagarVelas();

        stream.getTracks().forEach((track) => track.stop());
        contexto.close();
      } else {
        requestAnimationFrame(detectarSoplido);
      }
    }

    detectarSoplido();
  } catch (error) {
    alert(
      "No se pudo acceder al micrófono. " +
        "Puedes utilizar el botón para apagar las velitas.",
    );

    microfonoActivo = false;
  }
}

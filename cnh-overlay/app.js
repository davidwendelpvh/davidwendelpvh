const defaultFields = [
  { id: "nome", label: "Nome", value: "JOAO DA SILVA" },
  { id: "registro", label: "Registro", value: "01234567890" },
  { id: "cpf", label: "CPF", value: "123.456.789-00" },
  { id: "validade", label: "Validade", value: "12/2030" },
  { id: "nascimento", label: "Nascimento", value: "01/01/1990" },
  { id: "categoria", label: "Categoria", value: "AB" },
];

const state = {
  fields: {},
  order: [],
  activeFieldId: null,
  canvasWidth: 1000,
  canvasHeight: 630,
  showGrid: true,
  snapSize: 5,
  appearance: {
    fontFamily:
      'Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    fontSize: 14,
    fontWeight: 400,
    color: "#111111",
    stroke: false,
    strokeColor: "#ffffff",
    textAlign: "left",
  },
};

function byId(id) { return document.getElementById(id); }

function init() {
  // Build default field list
  const fieldList = byId("fieldList");
  for (const f of defaultFields) {
    ensureField(f.id, f.label, f.value);
  }
  renderFieldList();

  // Inputs
  byId("baseImageInput").addEventListener("change", onBaseImageSelected);
  byId("exportPngBtn").addEventListener("click", exportPNG);
  byId("exportPdfBtn").addEventListener("click", exportPDF);
  byId("saveLayoutBtn").addEventListener("click", saveLayout);
  byId("loadLayoutBtn").addEventListener("click", loadLayout);
  byId("resetBtn").addEventListener("click", resetAll);

  byId("addFieldBtn").addEventListener("click", () => {
    const name = byId("newFieldName").value.trim();
    if (!name) return;
    const id = slugify(name);
    if (state.fields[id]) {
      alert("Já existe um campo com esse nome");
      return;
    }
    ensureField(id, name.toUpperCase(), name.toUpperCase());
    renderFieldList();
    createOrUpdateOverlayForField(id);
    byId("newFieldName").value = "";
  });

  // Appearance controls
  byId("fontFamily").addEventListener("change", (e) => { state.appearance.fontFamily = e.target.value; syncAppearanceToActive(); });
  byId("fontSize").addEventListener("change", (e) => { state.appearance.fontSize = clamp(parseInt(e.target.value || 14, 10), 6, 64); syncAppearanceToActive(); });
  byId("fontWeight").addEventListener("change", (e) => { state.appearance.fontWeight = parseInt(e.target.value, 10); syncAppearanceToActive(); });
  byId("fontColor").addEventListener("change", (e) => { state.appearance.color = e.target.value; syncAppearanceToActive(); });
  byId("strokeToggle").addEventListener("change", (e) => { state.appearance.stroke = e.target.checked; syncAppearanceToActive(); });
  byId("strokeColor").addEventListener("change", (e) => { state.appearance.strokeColor = e.target.value; syncAppearanceToActive(); });
  byId("textAlign").addEventListener("change", (e) => { state.appearance.textAlign = e.target.value; syncAppearanceToActive(); });

  // Canvas controls
  byId("applyCanvasSizeBtn").addEventListener("click", applyCanvasSize);
  byId("gridToggle").addEventListener("change", (e) => toggleGrid(e.target.checked));
  byId("snapSize").addEventListener("change", (e) => state.snapSize = clamp(parseInt(e.target.value || 5, 10), 1, 50));

  // Stage grid and listeners
  ensureGridOverlay();

  // Create overlay for default enabled fields
  for (const id of state.order) {
    const f = state.fields[id];
    if (f.visible) createOrUpdateOverlayForField(id);
  }

  // Keyboard delete
  byId("stage").addEventListener("keydown", (e) => {
    if (e.key === "Delete" && state.activeFieldId) {
      const id = state.activeFieldId;
      removeField(id);
      renderFieldList();
      removeOverlay(id);
      state.activeFieldId = null;
    }
  });
}

function ensureField(id, label, value) {
  const left = 40 + state.order.length * 10;
  const top = 40 + state.order.length * 10;
  state.fields[id] = state.fields[id] || {
    id, label, value,
    x: left, y: top, width: 220, height: 28,
    visible: true,
    style: { ...state.appearance },
  };
  if (!state.order.includes(id)) state.order.push(id);
}

function renderFieldList() {
  const container = byId("fieldList");
  container.innerHTML = "";
  for (const id of state.order) {
    const f = state.fields[id];
    const row = document.createElement("div");
    row.className = "field-item";
    row.innerHTML = `
      <input type="checkbox" class="toggle" ${f.visible ? "checked" : ""} data-id="${id}"/>
      <input type="text" class="label" value="${f.label}" data-id="${id}"/>
      <button class="btn go" data-id="${id}">Selecionar</button>
    `;
    // events
    row.querySelector(".toggle").addEventListener("change", (e) => {
      f.visible = e.target.checked;
      if (f.visible) createOrUpdateOverlayForField(id); else removeOverlay(id);
    });
    row.querySelector(".label").addEventListener("change", (e) => {
      f.label = e.target.value;
    });
    row.querySelector(".go").addEventListener("click", () => {
      setActive(id);
      createOrUpdateOverlayForField(id);
      focusOverlay(id);
    });
    container.appendChild(row);
  }
}

function createOrUpdateOverlayForField(id) {
  const field = state.fields[id];
  const container = byId("overlayContainer");
  let el = container.querySelector(`[data-id="${id}"]`);
  if (!field.visible) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("div");
    el.className = "overlay-text";
    el.dataset.id = id;
    el.tabIndex = 0;
    el.innerHTML = `<div class="content" contenteditable="true"></div><div class="resizer br"></div>`;
    container.appendChild(el);

    el.addEventListener("mousedown", startDrag);
    el.querySelector(".resizer").addEventListener("mousedown", startResize);
    el.addEventListener("dblclick", () => {
      const content = el.querySelector(".content");
      content.focus();
      selectAllContent(content);
    });
    el.addEventListener("focus", () => setActive(id));
    el.addEventListener("click", () => setActive(id));

    el.querySelector(".content").addEventListener("input", (e) => {
      field.value = e.target.innerText;
    });
  }
  applyFieldStyle(el, field);
}

function applyFieldStyle(el, field) {
  const { x, y, width, height, style, value } = field;
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.width = width + "px";
  el.style.height = height + "px";
  const content = el.querySelector(".content");
  content.innerText = value;
  content.style.fontFamily = style.fontFamily;
  content.style.fontSize = style.fontSize + "px";
  content.style.fontWeight = String(style.fontWeight);
  content.style.color = style.color;
  content.style.textAlign = style.textAlign;
  content.style.lineHeight = "1.1";
  content.style.whiteSpace = "pre-wrap";
  content.style.wordBreak = "break-word";
  content.style.textShadow = style.stroke ? `-1px -1px 0 ${style.strokeColor}, 1px -1px 0 ${style.strokeColor}, -1px 1px 0 ${style.strokeColor}, 1px 1px 0 ${style.strokeColor}` : "none";
}

function setActive(id) {
  state.activeFieldId = id;
  document.querySelectorAll(".overlay-text").forEach((n) => n.classList.remove("active"));
  const el = document.querySelector(`.overlay-text[data-id="${id}"]`);
  if (el) el.classList.add("active");
}

function focusOverlay(id) {
  const el = document.querySelector(`.overlay-text[data-id="${id}"]`);
  if (el) el.focus();
}

function startDrag(e) {
  if (e.target.classList.contains("resizer")) return;
  const el = e.currentTarget;
  const id = el.dataset.id;
  setActive(id);
  const field = state.fields[id];
  const startX = e.clientX;
  const startY = e.clientY;
  const startLeft = field.x;
  const startTop = field.y;

  function onMove(ev) {
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    field.x = snap(startLeft + dx, state.snapSize);
    field.y = snap(startTop + dy, state.snapSize);
    applyFieldStyle(el, field);
  }
  function onUp() {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  }
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
}

function startResize(e) {
  e.stopPropagation();
  const el = e.currentTarget.parentElement;
  const id = el.dataset.id;
  setActive(id);
  const field = state.fields[id];
  const startX = e.clientX;
  const startY = e.clientY;
  const startW = field.width;
  const startH = field.height;

  function onMove(ev) {
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    field.width = Math.max(40, snap(startW + dx, state.snapSize));
    field.height = Math.max(20, snap(startH + dy, state.snapSize));
    applyFieldStyle(el, field);
  }
  function onUp() {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  }
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
}

function removeOverlay(id) {
  const el = document.querySelector(`.overlay-text[data-id="${id}"]`);
  if (el) el.remove();
}

function removeField(id) {
  delete state.fields[id];
  state.order = state.order.filter((x) => x !== id);
}

function onBaseImageSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = byId("baseImage");
  img.onload = () => {
    // Ajusta canvas ao tamanho da imagem
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    state.canvasWidth = width;
    state.canvasHeight = height;
    applyCanvasSize();
  };
  img.src = url;
}

function applyCanvasSize() {
  const width = clamp(parseInt(byId("canvasWidth").value || state.canvasWidth, 10), 300, 4000);
  const height = clamp(parseInt(byId("canvasHeight").value || state.canvasHeight, 10), 200, 4000);
  state.canvasWidth = width;
  state.canvasHeight = height;
  const img = byId("baseImage");
  img.style.width = width + "px";
  img.style.height = "auto";
  const stage = byId("stage");
  stage.style.width = "100%";
  stage.style.height = "100%";
  ensureGridOverlay();
}

function ensureGridOverlay() {
  const existing = document.querySelector(".grid-overlay");
  if (!existing) {
    const div = document.createElement("div");
    div.className = "grid-overlay";
    byId("stage").appendChild(div);
  }
  const grid = document.querySelector(".grid-overlay");
  grid.classList.toggle("hidden", !state.showGrid);
}

function toggleGrid(show) {
  state.showGrid = show;
  ensureGridOverlay();
}

function saveLayout() {
  const data = {
    fields: state.fields,
    order: state.order,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
  };
  localStorage.setItem("cnh_overlay_layout", JSON.stringify(data));
  alert("Layout salvo no navegador.");
}

function loadLayout() {
  const raw = localStorage.getItem("cnh_overlay_layout");
  if (!raw) { alert("Nenhum layout salvo."); return; }
  try {
    const data = JSON.parse(raw);
    state.fields = data.fields || {};
    state.order = data.order || [];
    state.canvasWidth = data.canvasWidth || state.canvasWidth;
    state.canvasHeight = data.canvasHeight || state.canvasHeight;
    byId("canvasWidth").value = String(state.canvasWidth);
    byId("canvasHeight").value = String(state.canvasHeight);
    byId("overlayContainer").innerHTML = "";
    renderFieldList();
    for (const id of state.order) createOrUpdateOverlayForField(id);
    applyCanvasSize();
  } catch (err) {
    alert("Falha ao carregar layout.");
    console.error(err);
  }
}

function resetAll() {
  if (!confirm("Remover todos os campos e limpar layout?")) return;
  state.fields = {};
  state.order = [];
  byId("overlayContainer").innerHTML = "";
  renderFieldList();
}

async function exportPNG() {
  const node = snapshotNode();
  const canvas = await html2canvas(node, { backgroundColor: null, scale: 2 });
  const url = canvas.toDataURL("image/png");
  download(url, "cnh-overlay.png");
}

async function exportPDF() {
  const node = snapshotNode();
  const canvas = await html2canvas(node, { backgroundColor: null, scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: state.canvasWidth > state.canvasHeight ? "l" : "p", unit: "px", format: [state.canvasWidth, state.canvasHeight] });
  pdf.addImage(imgData, "PNG", 0, 0, state.canvasWidth, state.canvasHeight);
  pdf.save("cnh-overlay.pdf");
}

function snapshotNode() {
  // Clonar somente a área da imagem + overlays
  const stage = byId("stage");
  const clone = stage.cloneNode(true);
  // Remover grade
  clone.querySelectorAll(".grid-overlay").forEach((n) => n.remove());
  // Garantir tamanhos
  clone.style.width = state.canvasWidth + "px";
  clone.style.height = state.canvasHeight + "px";
  const img = clone.querySelector("#baseImage");
  img.style.width = state.canvasWidth + "px";
  img.style.height = "auto";
  return clone;
}

function download(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function selectAllContent(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function snap(n, s) { return Math.round(n / s) * s; }
function slugify(s) { return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""); }

window.addEventListener("DOMContentLoaded", init);
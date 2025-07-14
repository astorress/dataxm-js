# pydataxm-js

Cliente en **JavaScript** para consumir la [API pública de XM](https://servapibi.xm.com.co/), la cual proporciona acceso a datos del sistema eléctrico colombiano. Este paquete está inspirado en la librería en Python [`pydataxm`](https://github.com/EquipoAnaliticaXM/API_XM), ampliamente utilizada por analistas y científicos de datos para extraer métricas como demanda real, generación, precios, entre otros.

> Esta versión en JavaScript se creó para facilitar la integración con entornos de desarrollo web o aplicaciones en Node.js, ofreciendo una solución liviana, asincrónica y moderna basada en `axios`.

---

## 🚀 Características

- Consulta dinámica del inventario de métricas disponibles.
- Extracción de datos históricos según período (horario, diario, mensual o anual).
- Generación automática de rangos de fechas según el tipo de métrica.
- Interfaz orientada a objetos para una integración sencilla.
- Compatible con entornos Node.js y frameworks modernos.

---

## 📦 Instalación

```bash
npm install pydataxm-js
```

---

## 📚 Ejemplo de uso

```js
import { ReadDB } from 'pydataxm-js'

const db = new ReadDB()

async function run() {
  // Cargar el inventario de métricas disponibles
  await db.allVariables()

  // Consultar datos de la demanda real del Sistema Interconectado Nacional
  const datos = await db.requestData(
    'DemaReal', // MetricId
    'Sistema', // Entidad
    '2024-01-01', // Fecha inicio
    '2024-01-15' // Fecha fin
  )

  console.log(datos)
}

run()
```

---

## 📁 Estructura de respuesta

Cada llamada a `requestData()` retorna un arreglo de objetos con esta forma (varía por métrica):

```js
[
  {
    Entity: 'Sistema',
    Date: '2024-01-01',
    Value: 12045.32,
    Unit: 'MW',
    // otros atributos según el tipo de dato
  },
  ...
]
```

---

## 🧠 Motivación

La librería pydataxm es una herramienta muy utilizada por profesionales del sector energético en Colombia, permitiendo acceder a información operativa fundamental como:

- Demanda real
- Generación por fuente o planta
- Precios de bolsa
- Exportaciones/importaciones
- Entre otros

Sin embargo, su alcance estaba limitado al ecosistema Python. Esta versión JavaScript amplía su aplicabilidad para:

- Aplicaciones web que requieren visualizaciones en tiempo real
- Servidores Node.js que integran sistemas de monitoreo o dashboards
- Proyectos con stacks JavaScript full-stack (Next.js, Vite, etc.)

> ⚠️ Este proyecto fue desarrollado sin ánimo de lucro, con fines educativos. No busca generar ingresos ni está asociado oficialmente con XM ni con otras entidades del sector eléctrico colombiano.
> Su único propósito es facilitar el acceso a información pública y fomentar su uso responsable y abierto desde aplicaciones JavaScript.

## 🔧 Estructura de clases

### `constructor()`

Inicializa el cliente apuntando a la URL base de la API pública de XM.

---

### `async allVariables()`

Consulta el inventario completo de métricas disponibles. Cada métrica tiene información como:

- `MetricId`: id de la métrica.
- `Entity` (por ejemplo: Sistema, región, planta)
- `Type`: tipo de frecuencia (HourlyEntities, DailyEntities, etc.)
- `Valores`: atributos asociados

Devuelve un arreglo de objetos con la estructura completa.

---

### `getCollections(coleccion = '')`

Filtra el inventario por un `MetricId` específico. Si no se pasa ningún argumento, retorna todo el inventario.

```js
const demanda = db.getCollections('DemaReal')
```

---

### `async requestData(metricId, entity, startDate, endDate, filters = [])`

Permite consultar los datos de una métrica entre dos fechas. Internamente:

1. Detecta el tipo de métrica (`Hourly`, `Monthly`, etc.)
2. Divide las fechas en períodos válidos para la API
3. Hace múltiples llamadas y concatena los resultados

Parámetros:

- `metricId`: id de la métrica (ej: `"DemaReal"`)
- `entity`: id de la entidad (ej: `"Sistema"`)
- `startDate`: fecha inicial en formato `"YYYY-MM-DD"`
- `endDate`: fecha final en formato `"YYYY-MM-DD"`
- `filters`: lista opcional de filtros definidos por la API

---

### `formatDate(date)`

Convierte un objeto `Date` a string formato `YYYY-MM-DD`.

---

### `generatePeriods(start, end, type)`

Genera intervalos adecuados para la API según el tipo de dato (`Hourly`, `Monthly`, etc.). Interno del método `requestData`.

---

## 📅 Periodicidades soportadas

| Tipo de dato    | Periodicidad de consulta |
| --------------- | ------------------------ |
| HourlyEntities  | Horaria                  |
| DailyEntities   | Diaria                   |
| MonthlyEntities | Mensual                  |
| AnnualEntities  | Anual                    |

---

## 🔧 Requisitos

- Node.js `v18+` (o superior)
- Axios (`npm install axios` — se instala automáticamente como dependencia)

---

## 📌 Notas

- Esta librería no requiere autenticación. La API de XM es de acceso público.
- Respeta límites razonables de uso para evitar saturar el servicio.
- No cachea los resultados localmente; puedes implementar almacenamiento si lo deseas.

---

## 📝 Licencia

MIT © 2025

---

## 🌍 Recursos adicionales

- 💡 Versión en Python: [pydataxm (GitHub)](https://github.com/EquipoAnaliticaXM/API_XM)

---

## 🛠️ Contribuciones

¡Las contribuciones son bienvenidas!  
Por favor abre un `Issue` para sugerencias o errores, o crea un `Pull Request` para mejoras directas.

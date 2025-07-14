# pydataxm-js

Cliente en **JavaScript** para consumir la [API pública de XM](https://servapibi.xm.com.co/), la cual proporciona acceso a datos del sistema eléctrico colombiano. Este paquete está inspirado en la librería en Python [`pydataxm`](https://pypi.org/project/pydataxm/), ampliamente utilizada por analistas y científicos de datos para extraer métricas como demanda real, generación, precios, entre otros.

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

---

## 🏗️ Estructura de clases

### `ReadDB`

| Método                                                    | Descripción                                                |
| --------------------------------------------------------- | ---------------------------------------------------------- |
| `allVariables()`                                          | Consulta todas las métricas disponibles en el API          |
| `getCollections(nombre)`                                  | Filtra métricas por `MetricId`                             |
| `requestData(coleccion, metrica, start, end, filtros=[])` | Consulta los datos de una métrica en un rango de fechas    |
| `generatePeriods(start, end, tipo)`                       | Crea los intervalos para realizar las consultas por partes |
| `formatDate(date)`                                        | Formato ISO corto para fechas (`YYYY-MM-DD`)               |

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

## 📝 Licencia

MIT © 2025 — [Tu Nombre o Usuario GitHub]

---

## 🌍 Recursos adicionales

- 💡 Versión en Python: [pydataxm (GitHub)](https://github.com/EquipoAnaliticaXM/API_XM)

---

## 🛠️ Contribuciones

¡Las contribuciones son bienvenidas!  
Por favor abre un `Issue` para sugerencias o errores, o crea un `Pull Request` para mejoras directas.

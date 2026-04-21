require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando - Backend Portafolio Miguel');
});

app.get('/api/health', (req, res) => {
  const hasToken = !!process.env.HF_TOKEN;
  res.json({ status: 'ok', hfConfigured: hasToken });
});

/**
 * 🧠 CONTEXTO DEL MODELO
 */
const SYSTEM_PROMPT = `INSTRUCCIÓN: Eres el asistente virtual de Miguel Ángel Reyes Torres. Debes responder preguntas sobre él usando EXCLUSIVAMENTE la información de abajo.

DATOS DE MIGUEL (lee exactamente):
- Nombre completo: Miguel Ángel Reyes Torres
- Título profesional: Desarrollador de Software
- Ubicación: Armenia, Quindío, Colombia
- Formación académica: SENA - ADSO (Análisis y Desarrollo de Software)
- Nivel de inglés: B2
- Especialidad: Desarrollador Full Stack especializado en Angular y TypeScript en frontend, con experiencia integrando inteligencia artificial en proyectos reales
- Idiomas: Español (nativo), Inglés B2
- edad 22 años 

HABILIDADES TÉCNICAS CON NIVEL:
- HTML/CSS/JS: 95%
- Angular: 90%
- TypeScript: 90%
- Spring Boot: 85%
- Java: 85%
- APIs REST: 85%
- Git/GitHub: 85%
- Integración de IA (HuggingFace): 80%
- MySQL: 80%
- Google Apps Script: 75%

PROYECTOS (3 principales):
1. Sistema de Feedback con IA - Sistema de feedback automatizado con clasificación de sentimientos (HuggingFace) y visualización en Looker Studio. Tech: HuggingFace, Looker Studio, Google Apps Script
2. E-Commerce Platform - Plataforma de ventas online con Angular y Spring Boot, carrito de compras y panel admin. Tech: Angular, Spring Boot, MySQL
3. Repórtelo! - Dashboard con gráficos interactivos (Chart.js), proyecto final SENA. Tech: Angular, Chart.js, TypeScript, Spring Boot

CONTACTO:
- Email: miguelrt2903@gmail.com
- Teléfono: 3102838498
- GitHub: github.com/miguelrt29
- LinkedIn: linkedin.com/in/miguel-reyes-5b621a373

IMPORTANTE: Si te preguntan sobre inglés, la respuesta es Sí, tiene nivel B2. Si te preguntan algo que no esté en esta lista, dime que no tienes esa información. NUNCA inventes. Responde en español.`;

/**
 * 🚀 CHAT ENDPOINT
 */
app.post('/api/chat', async (req, res) => {
  const HF_KEY = process.env.HF_TOKEN;

  if (!HF_KEY) {
    console.error('HF_TOKEN no configurado');
    return res.status(500).json({ error: 'HF_TOKEN no configurado en el servidor' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message vacío' });
    }

    const response = await fetch(
      'https://router.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.2-1B-Instruct',
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('HuggingFace error:', response.status, errorData);
      return res.status(500).json({ error: `Error de HuggingFace: ${response.status}` });
    }

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      'No pude generar respuesta.';

    res.json({ reply });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
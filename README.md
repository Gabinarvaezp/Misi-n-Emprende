# Misión Emprende · Feria de Emprendimiento TP 2026

App del equipo de Emotions & Experiences para gestionar los emprendimientos preseleccionados de los sites **G8**, **Torre C** y **BTS 0**: envío de correos y avisos por WhatsApp, fichas PDF, respuestas de los colaboradores y reportes para Isa.

## Privacidad

Este repositorio **no contiene datos de colaboradores**. La base de emprendimientos y el seguimiento viven en un Google Sheet del equipo y se cargan a través de Apps Script. Nunca subas aquí archivos `.json`, `.xlsx` o `.csv` con datos personales.

## Cómo entrar

Abre la app y escribe la **clave del equipo** (se pide una sola vez por computador). La base de emprendimientos y todo el seguimiento se cargan solos desde el Google Sheet "Misión Emprende 2026".

- La hoja **Base** tiene un emprendimiento por fila y se puede editar a mano.
- La hoja **Seguimiento** se actualiza sola con estados, respuestas y personas de apoyo.
- La clave se cambia en la hoja oculta **_config** (celda B1).

## Mantenimiento del Apps Script

Si se actualiza [`Code.gs`](Code.gs): en el Sheet abre **Extensiones › Apps Script**, pega el código nuevo y ve a **Implementar › Administrar implementaciones › (lápiz) › Versión: Nueva versión › Implementar**. La URL no cambia.

## Uso

- **Enviar correo**: descarga la ficha PDF y abre Gmail u Outlook con el correo escrito. Adjunta el PDF y envía.
- **WhatsApp**: aviso corto de que se envió el correo.
- **Cargar respuesta**: pega la respuesta del colaborador y la app organiza campaña, horario y datos de la persona de apoyo.
- **Plantilla y fechas**: edita fechas, plazo y textos por site.
- **Reportar a Isa**: Excel y correo con los confirmados de cada site.

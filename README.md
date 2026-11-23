# Misión Emprende · Feria de Emprendimiento TP 2026

App del equipo de Emotions & Experiences para gestionar los emprendimientos preseleccionados de los sites **G8**, **Torre C** y **BTS 0**: envío de correos y avisos por WhatsApp, fichas PDF, respuestas de los colaboradores y reportes para Isa.

## Privacidad

Este repositorio **no contiene datos de colaboradores**. La base de emprendimientos y el seguimiento viven en un Google Sheet del equipo y se cargan a través de Apps Script. Nunca subas aquí archivos `.json`, `.xlsx` o `.csv` con datos personales.

## Configuración (una sola vez)

1. Crea un Google Sheet en el Drive del equipo, por ejemplo "Misión Emprende 2026".
2. En el Sheet abre **Extensiones › Apps Script**, borra el contenido y pega el código de [`Code.gs`](Code.gs).
3. **Implementar › Nueva implementación › Aplicación web**. Ejecutar como: *Yo*. Quién tiene acceso: *Cualquier persona*. Autoriza los permisos.
4. Abre la app, toca **Conectar Drive** y pega la URL que termina en `/exec`.
5. Sube el archivo `base_emprendimientos.json` una sola vez. Desde ahí, quien conecte la misma URL verá los mismos datos.

Comparte la URL de Apps Script solo con el equipo (Gabriela, Nicolly y Asley).

## Uso

- **Enviar correo**: descarga la ficha PDF y abre Gmail u Outlook con el correo escrito. Adjunta el PDF y envía.
- **WhatsApp**: aviso corto de que se envió el correo.
- **Cargar respuesta**: pega la respuesta del colaborador y la app organiza campaña, horario y datos de la persona de apoyo.
- **Plantilla y fechas**: edita fechas, plazo y textos por site.
- **Reportar a Isa**: Excel y correo con los confirmados de cada site.

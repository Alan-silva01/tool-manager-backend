FROM python:3.14-slim

WORKDIR /app

# Instala dependências do sistema e tzdata para fuso horário de Brasília
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    tzdata \
    && rm -rf /var/lib/apt/lists/*

# Copia requirements e instala
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código do backend
COPY backend/ /app/backend/

WORKDIR /app/backend

ENV TZ="America/Sao_Paulo"
ENV PORT=8001
ENV PYTHONUNBUFFERED=1


EXPOSE 8001

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8001}"]

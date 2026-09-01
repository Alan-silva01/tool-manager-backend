"""
utils/logger.py — Sistema de logging estruturado para o Backend da Ferramentaria AVB.
"""

import logging
import sys

# Configuração básica de formato
LOG_FORMAT = "%(asctime)s [%(levelname)s] [%(name)s]: %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

logging.basicConfig(
    level=logging.INFO,
    format=LOG_FORMAT,
    datefmt=DATE_FORMAT,
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

def get_logger(name: str = "avb") -> logging.Logger:
    """Retorna um logger configurado com o nome do módulo."""
    return logging.getLogger(name)

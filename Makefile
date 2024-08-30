# Définir la version de Python à utiliser
PYTHON := python3

# Définir le port sur lequel le serveur sera lancé
PORT := 8000

# Cible par défaut
.PHONY: serve

# Commande pour démarrer un serveur HTTP simple
serve:
	@echo "Starting server on http://127.0.0.1:$(PORT)"
	$(PYTHON) -m http.server $(PORT)

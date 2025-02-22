.PHONY: dev build lint preview install clean

# Entwicklungsserver starten
dev:
	npm run dev

# Produktions-Build erstellen
build:
	npm run build

# Code-Qualität prüfen
lint:
	npm run lint

# Produktions-Preview starten
preview:
	npm run preview

# Dependencies installieren
install:
	npm install

# Build-Artefakte aufräumen
clean:
	rm -rf dist
	rm -rf node_modules

# Reiseplaner – Einrichtung

**Stand 06.11.2026 – alles eingerichtet:**
- App: https://pati380.github.io/reiseplaner/
- Repository: https://github.com/PaTi380/reiseplaner
- Firebase-Projekt: `reiseplaner-beea5` (Firestore in europe-west3, Regeln veröffentlicht, Web-App „Reiseplaner Web“)
- Konfiguration + Familien-Code sind im Browser der Claude-Desktop-App eingetragen; für Handy/Patricks Gerät: Schritt 2 unten (Konfiguration unter Projekteinstellungen → Meine Apps).

Eine einzelne Datei (`index.html`, Version 1.1 mit Budget), läuft auf GitHub Pages, gemeinsame Daten über Firebase Firestore. Kein Login per E-Mail – stattdessen ein **Familien-Code**, den beide Geräte eintragen.

## 1. Firebase-Projekt anlegen (einmalig)

1. https://console.firebase.google.com → **Projekt hinzufügen** (z. B. `reiseplaner`). Google Analytics kann aus bleiben.
2. Im Projekt: **Build → Firestore Database → Datenbank erstellen** → Standort `europe-west3 (Frankfurt)` → **Produktionsmodus**.
3. Reiter **Regeln** – Inhalt komplett ersetzen und veröffentlichen:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Nur wer den Familien-Code kennt, kommt an die Daten (Code = Pfadbestandteil)
    match /reiseplaner/{code}/{document=**} {
      allow read, write: if code.size() >= 8;
    }
  }
}
```

4. **Projektübersicht → Zahnrad → Projekteinstellungen → Meine Apps → Web-App (</>)** hinzufügen, Namen vergeben, *ohne* Hosting. Den angezeigten `firebaseConfig`-Block kopieren (apiKey, authDomain, projectId, …).

## 2. App auf einem Gerät einrichten

Die Firebase-Konfiguration steckt seit Version 1.3 fest in der `index.html` (sie ist nicht geheim – der Schutz kommt aus den Firestore-Regeln). Auf einem neuen Gerät ist nur noch der **Familien-Code** nötig:

- Entweder beim ersten Start in das Feld „Familien-Code eingeben“ tippen → Verbinden,
- oder den **Einrichtungs-Link** öffnen (⚙️ → „Einrichtungs-Link kopieren“, Form: `…/reiseplaner/?code=DEIN-CODE`). Der Link setzt den Code automatisch – praktisch für Patricks Handy oder nach dem Löschen von Browserdaten. Den Link nur privat weitergeben.

Der Code ist das Passwort für eure Daten; ohne ihn bleiben Reisen nur lokal im Browser.

## 3. GitHub Pages

1. Neues Repository, z. B. `PaTi380/reiseplaner`, `index.html` hochladen.
2. **Settings → Pages → Branch: main / root** → Speichern.
3. Nach ca. einer Minute erreichbar unter `https://pati380.github.io/reiseplaner/`.
4. Auf dem Handy: Seite in Chrome öffnen → Menü ⋮ → „App installieren“ (PWA mit eigenem Logo; `manifest.json`, `sw.js`, Icons liegen im Repository).

**Firebase + GitHub Pages:** In der Firebase-Konsole unter **Authentication → Settings → Autorisierte Domains** muss nichts eingetragen werden, da keine Anmeldung benutzt wird. Firestore funktioniert direkt.

## Updates einspielen

Neue `index.html` ins Repository hochladen – fertig. Alle Daten liegen in Firestore (und als Kopie im Browser), die Konfiguration bleibt im Browser. Nichts geht verloren.

## Datenstruktur (falls du mal direkt in Firestore nachsehen willst)

```
reiseplaner / <Familien-Code> / reisen / <reiseId>   → eine Reise mit gepaeck[], checkliste[], zeitplan[], infos[]
reiseplaner / <Familien-Code> / meta   / vorlage     → die gemeinsame Standard-Checkliste
```

Export/Import als JSON gibt es in den Einstellungen.

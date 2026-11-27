# Recherche: Wie machen es die (kostenlosen) CAT-Übungstests?

Stand: 27.11.2026. Ausgewertet: Profiling-Institut (kostenloser CAT-Trainer, 102 Aufgaben),
TestHelden (Blog-Artikel + Kurztest, 25 Aufgaben / 20 Min), Easy-Quizzz (10-Fragen-Probe),
offizielle Seiten der Karrierecenter (bundeswehr.de).

## Was offiziell feststeht
- Computerassistierter Test (CAT) am PC im Karrierecenter (Offiziere: Assessmentcenter Köln).
- Misst laut Bundeswehr: Sprachbeherrschung, mathematische Kompetenz, Denkvermögen.
- Überwiegend Multiple Choice; Bereiche Rechtschreibung, Mathematik, Allgemeinwissen,
  logisches und technisches Verständnis.
- Adaptiv: richtig → schwerer, falsch → leichter. Keine feste Punktzahl zum Bestehen.
- Kein Taschenrechner, Stift und Papier werden gestellt.
- Aufgabentypen werden vor jedem Abschnitt erklärt.

## Was nirgends öffentlich steht
- Anzahl Aufgaben je Abschnitt, Zeit je Aufgabe, Reihenfolge der Abschnitte, Bestehensgrenzen.
- Ob man zurückblättern kann (alle Anbieter raten aber: "raten und weiter" → vorwärts-only).
→ Diese Werte sind in der App **Schätzwerte** und in `js/config.js` änderbar.

## Wie die Übungsanbieter es umsetzen
| Merkmal | Profiling-Institut | TestHelden | Umsetzung in dieser App |
|---|---|---|---|
| Antwortformat | 4 Optionen (A–D) | 4 Optionen, teils freie Eingabe, Logik ja/nein | genauso |
| Zeit | fest pro Aufgabe (30–50 s) mit Countdown | 20 Min für 25 Aufgaben (~48 s) | Countdown pro Aufgabe, je Bereich 30–60 s |
| Adaptiv | nein (selbst so angegeben) | nein | **ja** (IRT-Modell, wie der echte CAT) |
| Aufgabenmenge | fester Pool (102) | fester Pool | **Generatoren** → unbegrenzt, nie auswendig lernbar |
| Feedback | sofort mit Erklärung | "Lösung zeigen" | Training: sofort; Simulation: erst am Ende |
| Einstufung | keine (kein Prozentrang) | keine | Einstufungstest mit Niveau je Bereich |

## Aufgabentypen (aus allen Quellen zusammengeführt)
- **Sprache:** Rechtschreibung (welches Wort ist richtig), Lückensatz (das/dass, Kasus,
  Präposition), Kommasetzung, Wortanalogien (A : B = C : ?), Wortbedeutung.
- **Mathe:** Kopfrechnen/Punkt vor Strich, Dreisatz (auch antiproportional), Prozent
  (inkl. Rückrechnung), Brüche, Einheiten, Textaufgaben (Geschwindigkeit), Geometrie,
  Rechenzeichen einsetzen.
- **Logik:** Zahlenreihen (konstant, ×/:, wachsende Abstände, wechselnde Operationen,
  verschachtelt, Quadrat-/Fibonacci-Reihen), Matrizen 3×3, Figurenreihen, Schlussfolgerungen (ja/nein).
- **Räumlich:** Würfel-Faltvorlagen, Würfel zählen (Stapel), Figuren drehen vs. spiegeln.
- **Technik:** Zahnräder (Drehrichtung, Drehzahl), Stromkreis, Ohmsches Gesetz, Hebel,
  Flaschenzug, Physik-Grundwissen.
- **Allgemeinwissen:** Politik/Staatsaufbau, Geschichte, Geografie, Bundeswehr.
- **Konzentration:** Zeichen zählen, Zeichen markieren unter Zeitdruck, Symbol-Zuordnung,
  Zeichenfolgen vergleichen.
- **Englisch** (laufbahnabhängig, v. a. Offiziere): Grammatik, Vokabeln.
- Nicht nachgebildet: Persönlichkeitsfragebogen (nicht trainierbar, ehrlich antworten),
  Reaktions-/Psychomotoriktests (nur spezielle Verwendungen).

## Quellen
- https://bundeswehr.de/de/organisation/personal/bundesamt-fuer-das-personalmanagement-der-bundeswehr-/karrierecenter-der-bundeswehr-/-karrierecenter-der-bundeswehr-berlin/-assessment
- https://www.profiling-institut.de/?p=55917
- https://testhelden.com/blogs/bundeswehr/der-bundeswehr-computertest-cat-test
- https://testhelden.com/blogs/bundeswehr/cat-test-logik-matrizen-zahlenreihen
- https://testhelden.com/blogs/bundeswehr/cat-test-konzentration
- https://testhelden.com/blogs/bundeswehr/cat-test-mathematik
- https://www.easy-quizzz.com/de/einstellungstest/bundeswehr/bundeswehr-cat-test-ueben/

Alle Aufgaben der App sind selbst erstellt oder generiert, keine Originalaufgaben.

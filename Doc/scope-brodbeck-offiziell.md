# Offizieller BSc-Scope — Prof. Brodbeck

**Quelle:** E-Mail Prof. Dr. Dominique Brodbeck (FHNW)
**Erhalten:** Mai 2026 (vor 11.05.)
**Status:** ✅ **OFFIZIELLER SCOPE** — angepasst an Struktur Ausgangslage/Ziele, mit Titel-Vorschlag

---

## Titel (Vorschlag Brodbeck)

> **„Integration und Darstellung medizinischer Labordaten in einer Patienten-App: Ein Proof of Concept im Schweizer E-Health-Kontext"**

---

## Ausgangslage, Hintergrund, Problemstellung

Im Zuge der Digitalisierung des Schweizer Gesundheitswesens gewinnen patientenzentrierte Anwendungen zunehmend an Bedeutung. Das Programm DigiSanté (mit dem Teilprojekt SwissHDS) und das elektronische Gesundheitsdossier (E-GD) schaffen Rahmenbedingungen für einen standardisierten und sicheren Austausch medizinischer Daten in der Schweiz. Gleichzeitig besteht eine wesentliche Herausforderung darin, medizinische Informationen so aufzubereiten, dass sie für Patientinnen und Patienten verständlich und nutzbar sind.

Es existiert bereits ein **Prototyp einer Patienten-App**, der grundlegende Funktionalitäten bereitstellt, jedoch noch keine Integration medizinischer Testdaten umfasst. Die Datenlandschaft im Gesundheitswesen ist dabei heterogen: Neben strukturierten Daten (z.B. gemäss dem **HL7-FHIR-Standard**) liegen viele Informationen unstrukturiert vor, beispielsweise als **PDF-Laborberichte** oder als Anhänge in **HIN-Mail-Nachrichten**. Die Frage, wie Daten in diesen unterschiedlichen Formaten in eine Patienten-App integriert und nutzergerecht dargestellt werden können, ist bislang nicht hinreichend adressiert.

---

## Ziele, Vorgehen, Lieferobjekte

Ziel der Arbeit ist die Entwicklung eines **Proof of Concept**, der aufzeigt, wie medizinische Testdaten in den bestehenden Prototyp der Patienten-App integriert und für Nutzerinnen und Nutzer verständlich sowie visuell sinnvoll dargestellt werden können.

Der Schwerpunkt liegt auf der **Integration von Labordaten**. Dabei soll sowohl die Einbindung **strukturierter Daten** (FHIR-basierte Datensätze über bestehende Schnittstellen oder ein eigens aufgebauter, standardkonformer Datensatz) als auch die Integration **unstrukturierter Daten** (PDF-Dokumente, HIN-Mail-Anhänge) untersucht und prototypisch umgesetzt werden. **Optional** wird zudem die Überführung unstrukturierter in strukturierte Daten betrachtet, etwa durch Parsing oder **KI-basierte Ansätze**.

Sämtliche Ansätze werden durchgehend im Kontext des Schweizer Gesundheitswesens erarbeitet und sollen mit den Rahmenbedingungen von **DigiSanté** und dem **E-GD** vereinbar sein. Die Umsetzung erfolgt auf Basis von **Testdaten**, wobei stets berücksichtigt wird, dass die entwickelte Lösung perspektivisch auch für den Umgang mit realen Patientendaten geeignet sein muss.

### Lieferobjekte (gefordert)

1. Beschreibung der **Analyse** und des gewählten Vorgehens
2. Der **funktionsfähige Proof of Concept** (integriert in den bestehenden Prototyp der Patienten-App)
3. Beschreibung der **Datenintegrations- und Darstellungskonzepte**
4. Eine **kritische Reflexion** der Ergebnisse im Hinblick auf Praxistauglichkeit und Weiterentwicklungsfähigkeit der Lösung

---

## Konsequenzen für die Arbeit

- **Forschungsbeitrag** liegt klar im Lab-Pfad (strukturierte FHIR-Integration) plus optional unstrukturiert (PDF/HIN → KI-Mapping)
- **Schwerpunkt eindeutig Labordaten** — andere Bereiche (Medication, Allergy, Case usw.) sind im Datenmodell konzeptionell vorhanden, aber nicht Teil des PoC-Lieferobjekts
- **Integration in bestehenden Prototyp** ist Pflicht — d.h. Frontend-Anbindung muss am Ende stehen
- **Kritische Reflexion** als eigener Lieferpunkt — nicht nur „funktioniert", sondern „warum, was geht nicht, was kommt als Nächstes"
- **Praxistauglichkeit / Weiterentwicklungsfähigkeit** — Argumentationslinie für die Diskussion am Schluss

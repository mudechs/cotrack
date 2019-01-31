'use strict'

module.exports = {
  statuses: [
    { 'label': 'Neu', 'type': 'open' },
    { 'label': 'Anerkannt', 'type': 'open' },
    { 'label': 'Abgelehnt', 'type': 'closed' },
    { 'label': 'Warten', 'type': 'open' },
    { 'label': 'Feedback', 'type': 'open' },
    { 'label': 'Bearbeitung', 'type': 'open' },
    { 'label': 'Erledigt', 'type': 'closed' },
    { 'label': 'Sistiert', 'type': 'closed' }
  ],
  priorities: [
    { 'label': 'Normal', 'color': 'secondary' },
    { 'label': 'Hoch', 'color': 'warning' },
    { 'label': 'Dringend', 'color': 'danger' }
  ],
  impacts: [
    { 'label': 'Feature-Wunsch' },
    { 'label': 'Trivial' },
    { 'label': 'Unschönheit' },
    { 'label': 'kleiner Fehler' },
    { 'label': 'schwerer Fehler' },
    { 'label': 'Absturz' },
    { 'label': 'Showstopper' },
  ],
  reproducibles: [
    { 'label': 'immer' },
    { 'label': 'manchmal' },
    { 'label': 'zufällig' },
    { 'label': 'nicht getestet' },
    { 'label': 'nicht reproduzierbar' }
  ]
}
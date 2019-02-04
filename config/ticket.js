'use strict'

module.exports = {
  statuses: [
    {
      de: [
        { 'label': 'Neu', 'value': 'Neu', 'type': 'open' },
        { 'label': 'Anerkannt', 'value': 'Anerkannt', 'type': 'open' },
        { 'label': 'Abgelehnt', 'value': 'Abgelehnt', 'type': 'closed' },
        { 'label': 'Warten', 'value': 'Warten', 'type': 'open' },
        { 'label': 'Feedback', 'value': 'Feedback', 'type': 'open' },
        { 'label': 'Bearbeitung', 'value': 'Bearbeitung', 'type': 'open' },
        { 'label': 'Erledigt', 'value': 'Erledigt', 'type': 'closed' },
        { 'label': 'Sistiert', 'value': 'Sistiert', 'type': 'closed' }
      ],
      en: [
        { 'label': 'New', 'value': 'Neu', 'type': 'open' },
        { 'label': 'Accepted', 'value': 'Anerkannt', 'type': 'open' },
        { 'label': 'Rejected', 'value': 'Abgelehnt', 'type': 'closed' },
        { 'label': 'Waiting', 'value': 'Warten', 'type': 'open' },
        { 'label': 'Feedback', 'value': 'Feedback', 'type': 'open' },
        { 'label': 'Progress', 'value': 'Bearbeitung', 'type': 'open' },
        { 'label': 'Done', 'value': 'Erledigt', 'type': 'closed' },
        { 'label': 'Suspended', 'value': 'Sistiert', 'type': 'closed' }
      ]
    }
  ],
  priorities: [
    {
      de: [
        { 'label': 'Normal', 'value': 'Normal', 'color': 'secondary' },
        { 'label': 'Hoch', 'value': 'Hoch', 'color': 'warning' },
        { 'label': 'Dringend', 'value': 'Dringend', 'color': 'danger' }
      ],
      en: [
        { 'label': 'Normal', 'value': 'Normal', 'color': 'secondary' },
        { 'label': 'High', 'value': 'Hoch', 'color': 'warning' },
        { 'label': 'Urgent', 'value': 'Dringend', 'color': 'danger' }
      ]
    }
  ],
  impacts: [
    {
      de: [
        { 'label': 'Feature-Wunsch', 'value': 'Feature-Wunsch' },
        { 'label': 'Trivial', 'value': 'Trivial' },
        { 'label': 'Unschönheit', 'value': 'Unschönheit' },
        { 'label': 'kleiner Fehler', 'value': 'kleiner Fehler' },
        { 'label': 'schwerer Fehler', 'value': 'schwerer Fehler' },
        { 'label': 'Absturz', 'value': 'Absturz' },
        { 'label': 'Showstopper', 'value': 'Showstopper' }
      ],
      en: [
        { 'label': 'feature request', 'value': 'Feature-Wunsch' },
        { 'label': 'trivial', 'value': 'Trivial' },
        { 'label': 'disturbing', 'value': 'Unschönheit' },
        { 'label': 'modest error', 'value': 'kleiner Fehler' },
        { 'label': 'grave error', 'value': 'schwerer Fehler' },
        { 'label': 'crash', 'value': 'Absturz' },
        { 'label': 'showstopper', 'value': 'Showstopper' }
      ]
    }
  ],
  reproducibles: [
    {
      de: [
        { 'label': 'immer', 'value': 'immer' },
        { 'label': 'manchmal', 'value': 'manchmal' },
        { 'label': 'zufällig', 'value': 'zufällig' },
        { 'label': 'nicht getestet', 'value': 'nicht getestet' },
        { 'label': 'nicht reproduzierbar', 'value': 'nicht reproduzierbar' }
      ],
      en: [
        { 'label': 'always', 'value': 'immer' },
        { 'label': 'sometimes', 'value': 'manchmal' },
        { 'label': 'random', 'value': 'zufällig' },
        { 'label': 'not yet tested', 'value': 'nicht getestet' },
        { 'label': 'not reproducible', 'value': 'nicht reproduzierbar' }
      ]
    }
  ]
}
'use strict';

module.exports = {
  statuses: [{
    de: [{
        'label': 'Neu',
        'value': 'Neu',
        'type': 'open',
        'icon': 'fas fa-bolt'
      },
      {
        'label': 'Anerkannt',
        'value': 'Anerkannt',
        'type': 'open',
        'icon': 'fas fa-thumbs-up'
      },
      {
        'label': 'Abgelehnt',
        'value': 'Abgelehnt',
        'type': 'closed',
        'icon': 'fas fa-thumbs-down'
      },
      {
        'label': 'Warten',
        'value': 'Warten',
        'type': 'open',
        'icon': 'fas fa-hourglass-start'
      },
      {
        'label': 'Feedback',
        'value': 'Feedback',
        'type': 'open',
        'icon': 'fas fa-bullhorn'
      },
      {
        'label': 'Bearbeitung',
        'value': 'Bearbeitung',
        'type': 'open',
        'icon': 'fas fa-pencil-alt'
      },
      {
        'label': 'Erledigt',
        'value': 'Erledigt',
        'type': 'closed',
        'icon': 'fas fa-check'
      },
      {
        'label': 'Sistiert',
        'value': 'Sistiert',
        'type': 'closed',
        'icon': 'fas fa-ban'
      }
    ],
    en: [{
        'label': 'New',
        'value': 'Neu',
        'type': 'open',
        'icon': 'fas fa-bolt'
      },
      {
        'label': 'Accepted',
        'value': 'Anerkannt',
        'type': 'open',
        'icon': 'fas fa-thumbs-up'
      },
      {
        'label': 'Rejected',
        'value': 'Abgelehnt',
        'type': 'closed',
        'icon': 'fas fa-thumbs-down'
      },
      {
        'label': 'Waiting',
        'value': 'Warten',
        'type': 'open',
        'icon': 'fas fa-hourglass-start'
      },
      {
        'label': 'Feedback',
        'value': 'Feedback',
        'type': 'open',
        'icon': 'fas fa-bullhorn'
      },
      {
        'label': 'Progress',
        'value': 'Bearbeitung',
        'type': 'open',
        'icon': 'fas fa-pencil-alt'
      },
      {
        'label': 'Done',
        'value': 'Erledigt',
        'type': 'closed',
        'icon': 'fas fa-check'
      },
      {
        'label': 'Suspended',
        'value': 'Sistiert',
        'type': 'closed',
        'icon': 'fas fa-ban'
      }
    ]
  }],
  priorities: [{
    de: [{
        'label': 'Normal',
        'value': 'Normal',
        'color': 'light'
      },
      {
        'label': 'Hoch',
        'value': 'Hoch',
        'color': 'warning'
      },
      {
        'label': 'Dringend',
        'value': 'Dringend',
        'color': 'danger'
      }
    ],
    en: [{
        'label': 'Normal',
        'value': 'Normal',
        'color': 'light'
      },
      {
        'label': 'High',
        'value': 'Hoch',
        'color': 'warning'
      },
      {
        'label': 'Urgent',
        'value': 'Dringend',
        'color': 'danger'
      }
    ]
  }],
  impacts: [{
    de: [{
        'label': 'Feature-Wunsch',
        'value': 'Feature-Wunsch'
      },
      {
        'label': 'Trivial',
        'value': 'Trivial'
      },
      {
        'label': 'Unschönheit',
        'value': 'Unschönheit'
      },
      {
        'label': 'kleiner Fehler',
        'value': 'kleiner Fehler'
      },
      {
        'label': 'schwerer Fehler',
        'value': 'schwerer Fehler'
      },
      {
        'label': 'Absturz',
        'value': 'Absturz'
      },
      {
        'label': 'Showstopper',
        'value': 'Showstopper'
      }
    ],
    en: [{
        'label': 'feature',
        'value': 'Feature-Wunsch'
      },
      {
        'label': 'trivial',
        'value': 'Trivial'
      },
      {
        'label': 'inelegance',
        'value': 'Unschönheit'
      },
      {
        'label': 'minor',
        'value': 'kleiner Fehler'
      },
      {
        'label': 'major',
        'value': 'schwerer Fehler'
      },
      {
        'label': 'crash',
        'value': 'Absturz'
      },
      {
        'label': 'showstopper',
        'value': 'Showstopper'
      }
    ]
  }],
  reproducibles: [{
    de: [{
        'label': 'immer',
        'value': 'immer'
      },
      {
        'label': 'manchmal',
        'value': 'manchmal'
      },
      {
        'label': 'zufällig',
        'value': 'zufällig'
      },
      {
        'label': 'nicht getestet',
        'value': 'nicht getestet'
      },
      {
        'label': 'nicht reproduzierbar',
        'value': 'nicht reproduzierbar'
      }
    ],
    en: [{
        'label': 'always',
        'value': 'immer'
      },
      {
        'label': 'sometimes',
        'value': 'manchmal'
      },
      {
        'label': 'random',
        'value': 'zufällig'
      },
      {
        'label': 'have not tried',
        'value': 'nicht getestet'
      },
      {
        'label': 'unable to reproduce',
        'value': 'nicht reproduzierbar'
      }
    ]
  }]
};

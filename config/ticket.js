'use strict';

module.exports = {
  statuses: [{
    de: [{
      'label': 'Neu',
      'code': '1',
      'type': 'open',
      'icon': 'fas fa-bolt'
    },
    {
      'label': 'Anerkannt',
      'code': '2',
      'type': 'open',
      'icon': 'fas fa-thumbs-up'
    },
    {
      'label': 'Abgelehnt',
      'code': '3',
      'type': 'closed',
      'icon': 'fas fa-thumbs-down'
    },
    {
      'label': 'Warten',
      'code': '4',
      'type': 'open',
      'icon': 'fas fa-hourglass-start'
    },
    {
      'label': 'Feedback',
      'code': '5',
      'type': 'open',
      'icon': 'fas fa-bullhorn'
    },
    {
      'label': 'Bearbeitung',
      'code': '6',
      'type': 'open',
      'icon': 'fas fa-pencil-alt'
    },
    {
      'label': 'Erledigt',
      'code': '7',
      'type': 'closed',
      'icon': 'fas fa-check'
    },
    {
      'label': 'Sistiert',
      'code': '8',
      'type': 'closed',
      'icon': 'fas fa-ban'
    }
    ],
    en: [{
      'label': 'New',
      'code': '1',
      'type': 'open',
      'icon': 'fas fa-bolt'
    },
    {
      'label': 'Accepted',
      'code': '2',
      'type': 'open',
      'icon': 'fas fa-thumbs-up'
    },
    {
      'label': 'Rejected',
      'code': '3',
      'type': 'closed',
      'icon': 'fas fa-thumbs-down'
    },
    {
      'label': 'Waiting',
      'code': '4',
      'type': 'open',
      'icon': 'fas fa-hourglass-start'
    },
    {
      'label': 'Feedback',
      'code': '5',
      'type': 'open',
      'icon': 'fas fa-bullhorn'
    },
    {
      'label': 'Progress',
      'code': '6',
      'type': 'open',
      'icon': 'fas fa-pencil-alt'
    },
    {
      'label': 'Done',
      'code': '7',
      'type': 'closed',
      'icon': 'fas fa-check'
    },
    {
      'label': 'Suspended',
      'code': '8',
      'type': 'closed',
      'icon': 'fas fa-ban'
    }
    ]
  }],
  priorities: [{
    de: [{
      'label': 'Normal',
      'code': '1',
      'color': 'light'
    },
    {
      'label': 'Hoch',
      'code': '2',
      'color': 'warning'
    },
    {
      'label': 'Dringend',
      'code': '3',
      'color': 'danger'
    }
    ],
    en: [{
      'label': 'Normal',
      'code': '1',
      'color': 'light'
    },
    {
      'label': 'High',
      'code': '2',
      'color': 'warning'
    },
    {
      'label': 'Urgent',
      'code': '3',
      'color': 'danger'
    }
    ]
  }],
  impacts: [{
    de: [{
      'label': 'Feature-Wunsch',
      'code': '1'
    },
    {
      'label': 'Trivial',
      'code': '2'
    },
    {
      'label': 'Unschönheit',
      'code': '3'
    },
    {
      'label': 'kleiner Fehler',
      'code': '4'
    },
    {
      'label': 'schwerer Fehler',
      'code': '5'
    },
    {
      'label': 'Absturz',
      'code': '6'
    },
    {
      'label': 'Showstopper',
      'code': '7'
    }
    ],
    en: [{
      'label': 'feature',
      'code': '1'
    },
    {
      'label': 'trivial',
      'code': '2'
    },
    {
      'label': 'inelegance',
      'code': '3'
    },
    {
      'label': 'minor',
      'code': '4'
    },
    {
      'label': 'major',
      'code': '5'
    },
    {
      'label': 'crash',
      'code': '6'
    },
    {
      'label': 'showstopper',
      'code': '7'
    }
    ]
  }],
  reproducibles: [{
    de: [{
      'label': 'immer',
      'code': '1'
    },
    {
      'label': 'manchmal',
      'code': '2'
    },
    {
      'label': 'zufällig',
      'code': '3'
    },
    {
      'label': 'nicht getestet',
      'code': '4'
    },
    {
      'label': 'nicht reproduzierbar',
      'code': '5'
    }
    ],
    en: [{
      'label': 'always',
      'code': '1'
    },
    {
      'label': 'sometimes',
      'code': '2'
    },
    {
      'label': 'random',
      'code': '3'
    },
    {
      'label': 'have not tried',
      'code': '4'
    },
    {
      'label': 'unable to reproduce',
      'code': '5'
    }
    ]
  }]
};

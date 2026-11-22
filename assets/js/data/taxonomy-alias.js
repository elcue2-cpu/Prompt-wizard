/* Prompt Wizard v4.1 — 하위 호환 별칭 계층 (설계서 §2.3)
   해석 순서: task → job → cat. 업무 별칭이 직무 별칭보다 우선이다.
   예) ?job=ops&task=budget → mgmt/budget, ?job=ops → offc. */
window.PW = window.PW || {};
(function (PW) {
  'use strict';
  PW.data = PW.data || {};
  PW.data.taxonomyAlias = {
  schema: 2,
  task: {
    plan: {
      domain: 'biz',
      task: 'plan'
    },
    budget: {
      domain: 'mgmt',
      task: 'budget'
    },
    admin: {
      domain: 'offc',
      task: 'admin'
    },
    council: {
      domain: 'offc',
      task: 'council'
    },
    program: {
      domain: 'biz',
      task: 'program'
    },
    bsc: {
      domain: 'biz',
      task: 'performance'
    },
    operation: {
      domain: 'biz',
      task: 'sop'
    },
    complaint: {
      domain: 'offc',
      task: 'complaint'
    },
    'service-review': {
      domain: 'it',
      task: 'service-review'
    },
    integration: {
      domain: 'it',
      task: 'integration'
    },
    'patch-report': {
      domain: 'it',
      task: 'patch-report'
    },
    privacy: {
      domain: 'it',
      task: 'privacy'
    },
    maintenance: {
      domain: 'it',
      task: 'maintenance'
    },
    procurement: {
      domain: 'mgmt',
      task: 'procurement'
    },
    incident: {
      domain: 'it',
      task: 'incident'
    },
    'it-audit': {
      domain: 'it',
      task: 'it-audit'
    },
    'facility-check': {
      domain: 'fac',
      task: 'inspection'
    },
    contractor: {
      domain: 'fac',
      task: 'contractor'
    },
    safety: {
      domain: 'saf',
      task: 'safety'
    },
    'field-complaint': {
      domain: 'field',
      task: 'field-complaint'
    },
    'work-result': {
      domain: 'field',
      task: 'work-result'
    },
    'supply-request': {
      domain: 'field',
      task: 'equipment-supply'
    },
    'anomaly-report': {
      domain: 'saf',
      task: 'anomaly-report'
    }
  },
  job: {
    ops: {
      domain: 'offc',
      alternatives: ['biz', 'mgmt']
    },
    it: {
      domain: 'it',
      alternatives: ['mgmt']
    },
    site: {
      domain: 'fac',
      alternatives: ['eng', 'saf']
    },
    field: {
      domain: 'field',
      alternatives: ['fac']
    }
  },
  out: {

  }
};
})(window.PW);

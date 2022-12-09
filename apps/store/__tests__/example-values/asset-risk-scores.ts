/**
 * @type {{
 *  asset_id: number;
 *  asset_name: string;
 *  asset_type: string;
 *  inherent_score: number | null;
 *  inherited_score: number | null;
 *  compound_score: number | null;
 *  last_scan_date: Date | null;
 *  company_id: number;
 * }[]}
 */
export default [
  {
    asset_id: 1,
    asset_name: 'bratrstvi.x-rator.com',
    asset_type: 'WEB',
    company_id: 1,
    compound_score: null,
    inherent_score: null,
    inherited_score: null,
    last_scan_date: new Date('2021-01-02T02:00:00.000Z'),
  },
  {
    asset_id: 11,
    asset_name: 'CMPWEB01',
    asset_type: 'SERVER',
    company_id: 1,
    compound_score: null,
    inherent_score: 6.9,
    inherited_score: null,
    last_scan_date: new Date('2021-01-02 02:00:00.000Z'),
  },
  {
    asset_id: 12,
    asset_name: '10.254.1.253',
    asset_type: 'SERVER',
    company_id: 1,
    compound_score: null,
    inherent_score: 8.3,
    inherited_score: null,
    last_scan_date: new Date('2021-01-02T02:00:00.000Z'),
  },
  {
    asset_id: 113,
    asset_name: 'john.pcloud.lan',
    asset_type: 'SERVER',
    company_id: 2,
    compound_score: null,
    inherent_score: null,
    inherited_score: null,
    last_scan_date: null,
  },
  {
    asset_id: 100,
    asset_name: 'Be proactive on Health Industry Standard',
    asset_type: 'SERVER',
    company_id: 1,
    compound_score: 5.5,
    inherent_score: null,
    inherited_score: null,
    last_scan_date: null,
  },
  {
    asset_id: 101,
    asset_name: 'Design And Produce Prothesis',
    asset_type: 'SERVER',
    company_id: 1,
    compound_score: 6,
    inherent_score: null,
    inherited_score: null,
    last_scan_date: null,
  },
  {
    asset_id: 102,
    asset_name: 'One-day Shipping',
    asset_type: 'MISSION',
    company_id: 1,
    compound_score: 2.5,
    inherent_score: null,
    inherited_score: null,
    last_scan_date: null,
  },
  {
    asset_id: 103,
    asset_name: 'Operate the medical SaaS',
    asset_type: 'MISSION',
    company_id: 1,
    compound_score: 10,
    inherent_score: null,
    inherited_score: null,
    last_scan_date: null,
  },
]

const BASE_URL = 'http://localhost:5001';

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE ENDPOINT TESTS ---');
  let passCount = 0;
  let failCount = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passCount++;
    } catch (e) {
      console.error(`[FAIL] ${name}:`, e.message);
      failCount++;
    }
  }

  // 1. Health
  await test('GET /health', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const json = await res.json();
    if (json.status !== 'ONLINE') throw new Error('Status not online');
  });

  // 2. Hospitals
  await test('GET /api/hospitals', async () => {
    const res = await fetch(`${BASE_URL}/api/hospitals`);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data) || json.data.length === 0) throw new Error('Bad data');
  });

  // 3. Create Hospital
  let createdHospId = null;
  await test('POST /api/hospitals', async () => {
    const res = await fetch(`${BASE_URL}/api/hospitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Emergency Field Clinic',
        location: 'Sector 15 Testing Ground',
        total_beds: 50,
        available_beds: 20
      })
    });
    const json = await res.json();
    if (!json.success || !json.data) throw new Error('Create failed');
    createdHospId = json.data.id;
  });

  // 4. Update Hospital
  if (createdHospId) {
    await test(`PUT /api/hospitals/${createdHospId}`, async () => {
      const res = await fetch(`${BASE_URL}/api/hospitals/${createdHospId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available_beds: 18 })
      });
      const json = await res.json();
      if (!json.success || json.data.available_beds !== 18) throw new Error('Update failed');
    });
  }

  // 5. Shelters
  await test('GET /api/shelters', async () => {
    const res = await fetch(`${BASE_URL}/api/shelters`);
    const json = await res.json();
    if (!json.success || json.data.length === 0) throw new Error('No shelters');
  });

  // 6. Responders
  await test('GET /api/responders', async () => {
    const res = await fetch(`${BASE_URL}/api/responders`);
    const json = await res.json();
    if (!json.success || json.data.length === 0) throw new Error('No responders');
  });

  // 7. Incidents
  await test('GET /api/incidents', async () => {
    const res = await fetch(`${BASE_URL}/api/incidents`);
    const json = await res.json();
    if (!json.success || json.data.length === 0) throw new Error('No incidents');
  });

  // 8. Alerts
  await test('GET /api/alerts', async () => {
    const res = await fetch(`${BASE_URL}/api/alerts`);
    const json = await res.json();
    if (!json.success || json.data.length === 0) throw new Error('No alerts');
  });

  // 9. Network Devices & Links
  await test('GET /api/network/devices & /links', async () => {
    const [dRes, lRes] = await Promise.all([
      fetch(`${BASE_URL}/api/network/devices`),
      fetch(`${BASE_URL}/api/network/links`)
    ]);
    const dJson = await dRes.json();
    const lJson = await lRes.json();
    if (!dJson.success || dJson.data.length < 10) throw new Error('Device count mismatch');
    if (!lJson.success || lJson.data.length === 0) throw new Error('Link count mismatch');
  });

  // 10. Failover Cut & Restore Test
  await test('POST /api/network/failover (Cut Fiber -> Restore)', async () => {
    // Cut
    const cutRes = await fetch(`${BASE_URL}/api/network/failover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cut' })
    });
    const cutJson = await cutRes.json();
    if (!cutJson.success || cutJson.state.primaryLinkStatus !== 'Failed') throw new Error('Failover cut failed');
    if (cutJson.state.backupLinkStatus !== 'Active') throw new Error('Backup link did not engage');

    // Restore
    const restoreRes = await fetch(`${BASE_URL}/api/network/failover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'restore' })
    });
    const restoreJson = await restoreRes.json();
    if (!restoreJson.success || restoreJson.state.primaryLinkStatus !== 'Active') throw new Error('Restore failed');
  });

  // 11. Reports
  await test('GET /api/reports', async () => {
    const res = await fetch(`${BASE_URL}/api/reports`);
    const json = await res.json();
    if (!json.success || !json.data.incidentStats || !json.data.hospitalStats) throw new Error('Report structure invalid');
  });

  console.log(`\nTEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED.`);
  process.exit(failCount === 0 ? 0 : 1);
}

runTests();

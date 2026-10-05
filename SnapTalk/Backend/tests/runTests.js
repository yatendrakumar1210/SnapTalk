const http = require('http');

async function runTests() {
  console.log("🧪 Starting SnapTalk Core Integration Tests...\n");

  const baseUrl = 'http://localhost:5000/api';
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(` ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check or non-existent route test
    console.log("Test 1: Security & Unauthorized API Request");
    const res = await fetch(`${baseUrl}/users/search`);
    assert(res.status === 401, "Protected endpoint returns 401 without Bearer token");

    // 2. Register test user
    console.log("\nTest 2: User Registration & OTP Generation");
    const testPhone = `99${Math.floor(10000000 + Math.random() * 90000000)}`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Engineer',
        phone: testPhone,
        password: 'Password123!'
      })
    });
    const regData = await regRes.json();
    assert(regData.success === true, "User registered successfully");
    assert(Boolean(regData.token), "JWT token generated upon registration");

    // 3. Verify OTP
    console.log("\nTest 3: OTP Verification");
    const otpRes = await fetch(`${baseUrl}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: testPhone,
        otpCode: regData.otpDemo
      })
    });
    const otpData = await otpRes.json();
    assert(otpData.success === true, "OTP verified successfully");

    // 4. Authenticated Profile Request
    console.log("\nTest 4: Authenticated Profile Fetch");
    const profRes = await fetch(`${baseUrl}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${regData.token}` }
    });
    const profData = await profRes.json();
    assert(profData.success === true && profData.user.name === 'Test Engineer', "Profile fetched with valid JWT");

    // 5. Create Meeting Test
    console.log("\nTest 5: Create Meeting Room");
    const meetRes = await fetch(`${baseUrl}/meetings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${regData.token}`
      },
      body: JSON.stringify({
        title: 'Automation Test Classroom',
        mode: 'online_class'
      })
    });
    const meetData = await meetRes.json();
    assert(meetData.success === true && meetData.meeting.meetingId.startsWith('meet-'), "Meeting room created with unique ID");

  } catch (err) {
    console.error("Test runner encountered exception:", err.message);
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);
}

// If server is active, run tests
runTests();

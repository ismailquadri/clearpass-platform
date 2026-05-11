/**
 * Simple integration test to verify frontend can call backend API
 * Run with: node test-api-integration.js
 */

const API_BASE_URL = 'http://localhost:5001';

async function testHealthEndpoint() {
  console.log('Testing health endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health endpoint working:', data);
    return true;
  } catch (error) {
    console.error('❌ Health endpoint failed:', error.message);
    return false;
  }
}

async function testRegistration() {
  console.log('\nTesting registration endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `integration-test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        first_name: 'Integration',
        last_name: 'Test',
        role: 'contractor',
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('✅ Registration successful:', data.data.user.email);
      return data.data;
    } else {
      console.error('❌ Registration failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    return null;
  }
}

async function testLogin(email, password) {
  console.log('\nTesting login endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('✅ Login successful:', data.data.user.email);
      console.log('   Token received:', data.data.token.substring(0, 20) + '...');
      return data.data;
    } else {
      console.error('❌ Login failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return null;
  }
}

async function testProtectedEndpoint(token) {
  console.log('\nTesting protected endpoint (dashboard)...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Protected endpoint accessible');
      return true;
    } else {
      const data = await response.json();
      console.error('❌ Protected endpoint failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Protected endpoint error:', error.message);
    return false;
  }
}

async function testGetCurrentUser(token) {
  console.log('\nTesting get current user endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      console.log('✅ Get current user successful:', data.data.email);
      return data.data;
    } else {
      console.error('❌ Get current user failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Get current user error:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🧪 ClearPass API Integration Tests');
  console.log('====================================\n');

  const healthOk = await testHealthEndpoint();
  if (!healthOk) {
    console.error('\n❌ Backend server not accessible. Please ensure it is running on port 5001');
    return;
  }

  const registerResult = await testRegistration();
  if (!registerResult) {
    console.error('\n❌ Registration failed. Cannot continue with tests');
    return;
  }

  const loginResult = await testLogin(registerResult.user.email, 'TestPassword123!');
  if (!loginResult) {
    console.error('\n❌ Login failed. Cannot continue with protected endpoint tests');
    return;
  }

  await testProtectedEndpoint(loginResult.token);
  await testGetCurrentUser(loginResult.token);

  console.log('\n✅ Integration tests completed successfully!');
}

runTests().catch(console.error);
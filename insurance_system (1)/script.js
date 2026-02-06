// ===================================
// INSURANCE CLAIM SYSTEM - JAVASCRIPT (UPDATED WITH EDIT SUPPORT)
// ===================================

// LocalStorage data (demo mode). For API mode, replace CRUD calls with fetch to api.php.
let policyholders = JSON.parse(localStorage.getItem('policyholders')) || [];
let policies = JSON.parse(localStorage.getItem('policies')) || [];
let claims = JSON.parse(localStorage.getItem('claims')) || [];
let agents = JSON.parse(localStorage.getItem('agents')) || [];

// Auto-increment IDs for LocalStorage demo
let nextPolicyholderID = parseInt(localStorage.getItem('nextPolicyholderID')) || 1;
let nextPolicyID = parseInt(localStorage.getItem('nextPolicyID')) || 1;
let nextClaimID = parseInt(localStorage.getItem('nextClaimID')) || 1;
let nextAgentID = parseInt(localStorage.getItem('nextAgentID')) || 1;

// Edit state
let editingPolicyholderId = null;
let editingAgentId = null;
let editingPolicyId = null;
let editingClaimId = null;

// Tabs
function showTab(tabName) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));
  const btns = document.querySelectorAll('.tab-btn');
  btns.forEach(btn => btn.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
  event.target.classList.add('active');
  loadTabData(tabName);
}
function loadTabData(tabName) {
  if (tabName === 'policyholders') displayPolicyholders();
  if (tabName === 'policies') displayPolicies();
  if (tabName === 'claims') displayClaims();
  if (tabName === 'agents') displayAgents();
}

// ========== POLICYHOLDERS ==========
document.getElementById('policyholderForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const payload = {
    name: ph_name.value, dob: ph_dob.value, contact: ph_contact.value,
    email: ph_email.value, address: ph_address.value
  };
  if (editingPolicyholderId) {
    const i = policyholders.findIndex(p => p.id === editingPolicyholderId);
    if (i > -1) {
      policyholders[i] = { ...policyholders[i], ...payload };
      saveData(); displayPolicyholders(); showMessage('success','Policyholder updated!');
    }
    editingPolicyholderId = null; ph_edit_id.value=''; this.reset(); ph_cancel_btn.style.display='none';
  } else {
    const ph = { id: nextPolicyholderID++, ...payload, created_date: new Date().toISOString().split('T')[0] };
    policyholders.push(ph); saveData(); displayPolicyholders(); showMessage('success','Policyholder added!');
    this.reset();
  }
});
function displayPolicyholders() {
  const container = document.getElementById('policyholdersTable');
  if (policyholders.length === 0) { container.innerHTML = '<div class="empty-state"><p>No policyholders found</p></div>'; return; }
  let html = `<table><thead><tr>
    <th>ID</th><th>Name</th><th>DOB</th><th>Contact</th><th>Email</th><th>Address</th><th>Actions</th>
  </tr></thead><tbody>`;
  policyholders.forEach(ph => {
    html += `<tr>
      <td>${ph.id}</td><td>${ph.name}</td><td>${ph.dob}</td><td>${ph.contact}</td>
      <td>${ph.email || '-'}</td><td>${ph.address || '-'}</td>
      <td>
        <button class="action-btn btn-edit" onclick="startEditPolicyholder(${ph.id})">Edit</button>
        <button class="action-btn btn-delete" onclick="deletePolicyholder(${ph.id})">Delete</button>
      </td>
    </tr>`;
  });
  html += '</tbody></table>'; container.innerHTML = html;
}
function startEditPolicyholder(id) {
  const ph = policyholders.find(p => p.id === id); if (!ph) return;
  ph_name.value = ph.name; ph_dob.value = ph.dob; ph_contact.value = ph.contact;
  ph_email.value = ph.email || ''; ph_address.value = ph.address || '';
  ph_edit_id.value = ph.id; editingPolicyholderId = ph.id; ph_cancel_btn.style.display='inline-block';
}
function deletePolicyholder(id) {
  if (!confirm('Delete this policyholder?')) return;
  policyholders = policyholders.filter(p => p.id !== id);
  saveData(); displayPolicyholders(); showMessage('success','Policyholder deleted!');
}
document.getElementById('ph_cancel_btn').onclick = () => {
  editingPolicyholderId = null; ph_edit_id.value = ''; policyholderForm.reset(); ph_cancel_btn.style.display='none';
};

// ========== AGENTS ==========
document.getElementById('agentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const payload = {
    agent_name: ag_name.value, phone: ag_phone.value, email: ag_email.value,
    commission_rate: parseFloat(ag_commission.value), joining_date: ag_joining.value, status: 'Active'
  };
  if (editingAgentId) {
    const i = agents.findIndex(a => a.id === editingAgentId);
    if (i > -1) { agents[i] = { ...agents[i], ...payload }; saveData(); displayAgents(); showMessage('success','Agent updated!'); }
    editingAgentId = null; ag_edit_id.value=''; this.reset(); ag_cancel_btn.style.display='none';
  } else {
    const ag = { id: nextAgentID++, ...payload };
    agents.push(ag); saveData(); displayAgents(); showMessage('success','Agent added!'); this.reset();
  }
});
function displayAgents() {
  const container = document.getElementById('agentsTable');
  if (agents.length === 0) { container.innerHTML = '<div class="empty-state"><p>No agents found</p></div>'; return; }
  let html = `<table><thead><tr>
    <th>Agent ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Commission %</th><th>Joining Date</th><th>Status</th><th>Actions</th>
  </tr></thead><tbody>`;
  agents.forEach(agent => {
    html += `<tr>
      <td>${agent.id}</td><td>${agent.agent_name}</td><td>${agent.phone}</td><td>${agent.email || '-'}</td>
      <td>${agent.commission_rate}%</td><td>${agent.joining_date}</td>
      <td><span class="status status-${(agent.status||'Active').toLowerCase()}">${agent.status||'Active'}</span></td>
      <td>
        <button class="action-btn btn-edit" onclick="startEditAgent(${agent.id})">Edit</button>
        <button class="action-btn btn-delete" onclick="deleteAgent(${agent.id})">Delete</button>
      </td>
    </tr>`;
  });
  html += '</tbody></table>'; container.innerHTML = html;
}
function startEditAgent(id) {
  const ag = agents.find(a => a.id === id); if (!ag) return;
  ag_name.value = ag.agent_name; ag_phone.value = ag.phone; ag_email.value = ag.email || '';
  ag_commission.value = ag.commission_rate; ag_joining.value = ag.joining_date;
  ag_edit_id.value = ag.id; editingAgentId = ag.id; ag_cancel_btn.style.display='inline-block';
}
function deleteAgent(id) {
  if (!confirm('Delete this agent?')) return;
  agents = agents.filter(a => a.id !== id);
  saveData(); displayAgents(); showMessage('success','Agent deleted!');
}
document.getElementById('ag_cancel_btn').onclick = () => {
  editingAgentId = null; ag_edit_id.value=''; agentForm.reset(); ag_cancel_btn.style.display='none';
};

// ========== POLICIES ==========
document.getElementById('policyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const payload = {
    policyholder_id: parseInt(pol_policyholder_id.value),
    agent_id: pol_agent_id.value ? parseInt(pol_agent_id.value) : null,
    policy_type: pol_type.value,
    premium: parseFloat(pol_premium.value),
    coverage_amount: parseFloat(pol_coverage.value),
    start_date: pol_start.value,
    end_date: pol_end.value,
    status: 'Active'
  };
  // validate policyholder exists (LocalStorage mode)
  const phExists = policyholders.find(ph => ph.id === payload.policyholder_id);
  if (!phExists) { showMessage('error','Policyholder ID does not exist!'); return; }

  if (editingPolicyId) {
    const i = policies.findIndex(p => p.id === editingPolicyId);
    if (i > -1) { policies[i] = { ...policies[i], ...payload }; saveData(); displayPolicies(); showMessage('success','Policy updated!'); }
    editingPolicyId = null; pol_edit_id.value=''; this.reset(); pol_cancel_btn.style.display='none';
  } else {
    const pol = { id: nextPolicyID++, ...payload };
    policies.push(pol); saveData(); displayPolicies(); showMessage('success','Policy added!'); this.reset();
  }
});
function displayPolicies() {
  const container = document.getElementById('policiesTable');
  if (policies.length === 0) { container.innerHTML = '<div class="empty-state"><p>No policies found</p></div>'; return; }
  let html = `<table><thead><tr>
    <th>Policy ID</th><th>Policyholder</th><th>Type</th><th>Premium</th><th>Coverage</th><th>Start</th><th>End</th><th>Status</th><th>Actions</th>
  </tr></thead><tbody>`;
  policies.forEach(pol => {
    const ph = policyholders.find(p => p.id === pol.policyholder_id);
    html += `<tr>
      <td>${pol.id}</td><td>${ph ? ph.name : 'Unknown'}</td><td>${pol.policy_type}</td>
      <td>₹${pol.premium.toLocaleString('en-IN')}</td><td>₹${pol.coverage_amount.toLocaleString('en-IN')}</td>
      <td>${pol.start_date}</td><td>${pol.end_date}</td>
      <td><span class="status status-${(pol.status||'Active').toLowerCase()}">${pol.status||'Active'}</span></td>
      <td>
        <button class="action-btn btn-edit" onclick="startEditPolicy(${pol.id})">Edit</button>
        <button class="action-btn btn-delete" onclick="deletePolicy(${pol.id})">Delete</button>
      </td>
    </tr>`;
  });
  html += '</tbody></table>'; container.innerHTML = html;
}
function startEditPolicy(id) {
  const pol = policies.find(p => p.id === id); if (!pol) return;
  pol_policyholder_id.value = pol.policyholder_id; pol_agent_id.value = pol.agent_id || '';
  pol_type.value = pol.policy_type; pol_premium.value = pol.premium; pol_coverage.value = pol.coverage_amount;
  pol_start.value = pol.start_date; pol_end.value = pol.end_date;
  pol_edit_id.value = pol.id; editingPolicyId = pol.id; pol_cancel_btn.style.display='inline-block';
}
function deletePolicy(id) {
  if (!confirm('Delete this policy?')) return;
  policies = policies.filter(p => p.id !== id);
  saveData(); displayPolicies(); showMessage('success','Policy deleted!');
}
document.getElementById('pol_cancel_btn').onclick = () => {
  editingPolicyId = null; pol_edit_id.value=''; policyForm.reset(); pol_cancel_btn.style.display='none';
};

// ========== CLAIMS ==========
document.getElementById('claimForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const payload = {
    policy_id: parseInt(cl_policy_id.value),
    claim_date: cl_date.value,
    claim_amount: parseFloat(cl_amount.value),
    status: cl_status.value,
    approved_amount: 0,
    settlement_date: null,
    remarks: cl_remarks.value
  };
  // validate policy exists (LocalStorage mode)
  const polExists = policies.find(pol => pol.id === payload.policy_id);
  if (!polExists) { showMessage('error','Policy ID does not exist!'); return; }

  if (editingClaimId) {
    const i = claims.findIndex(c => c.id === editingClaimId);
    if (i > -1) { claims[i] = { ...claims[i], ...payload }; saveData(); displayClaims(); showMessage('success','Claim updated!'); }
    editingClaimId = null; cl_edit_id.value=''; this.reset(); cl_cancel_btn.style.display='none';
  } else {
    const cl = { id: nextClaimID++, ...payload };
    claims.push(cl); saveData(); displayClaims(); showMessage('success','Claim filed!'); this.reset();
  }
});
function displayClaims(filterStatus = 'all') {
  const container = document.getElementById('claimsTable');
  let list = claims;
  if (filterStatus !== 'all') list = claims.filter(c => c.status === filterStatus);
  if (list.length === 0) { container.innerHTML = '<div class="empty-state"><p>No claims found</p></div>'; return; }
  let html = `<table><thead><tr>
    <th>Claim ID</th><th>Policy ID</th><th>Policyholder</th><th>Claim Date</th><th>Amount</th><th>Status</th><th>Remarks</th><th>Actions</th>
  </tr></thead><tbody>`;
  list.forEach(cl => {
    const pol = policies.find(p => p.id === cl.policy_id);
    const ph = pol ? policyholders.find(p => p.id === pol.policyholder_id) : null;
    html += `<tr>
      <td>${cl.id}</td><td>${cl.policy_id}</td><td>${ph ? ph.name : 'Unknown'}</td>
      <td>${cl.claim_date}</td><td>₹${cl.claim_amount.toLocaleString('en-IN')}</td>
      <td><span class="status status-${cl.status.toLowerCase()}">${cl.status}</span></td>
      <td>${cl.remarks || '-'}</td>
      <td>
        <button class="action-btn btn-edit" onclick="startEditClaim(${cl.id})">Edit</button>
        <button class="action-btn btn-delete" onclick="deleteClaim(${cl.id})">Delete</button>
      </td>
    </tr>`;
  });
  html += '</tbody></table>'; container.innerHTML = html;
}
function startEditClaim(id) {
  const cl = claims.find(c => c.id === id); if (!cl) return;
  cl_policy_id.value = cl.policy_id; cl_date.value = cl.claim_date; cl_amount.value = cl.claim_amount;
  cl_status.value = cl.status; cl_remarks.value = cl.remarks || '';
  cl_edit_id.value = cl.id; editingClaimId = cl.id; cl_cancel_btn.style.display='inline-block';
}
function filterClaims() {
  const v = document.getElementById('claimStatusFilter').value;
  displayClaims(v);
}
function deleteClaim(id) {
  if (!confirm('Delete this claim?')) return;
  claims = claims.filter(c => c.id !== id);
  saveData(); displayClaims(); showMessage('success','Claim deleted!');
}
document.getElementById('cl_cancel_btn').onclick = () => {
  editingClaimId = null; cl_edit_id.value=''; claimForm.reset(); cl_cancel_btn.style.display='none';
};

// Utilities
function saveData() {
  localStorage.setItem('policyholders', JSON.stringify(policyholders));
  localStorage.setItem('policies', JSON.stringify(policies));
  localStorage.setItem('claims', JSON.stringify(claims));
  localStorage.setItem('agents', JSON.stringify(agents));
  localStorage.setItem('nextPolicyholderID', nextPolicyholderID);
  localStorage.setItem('nextPolicyID', nextPolicyID);
  localStorage.setItem('nextClaimID', nextClaimID);
  localStorage.setItem('nextAgentID', nextAgentID);
}
function showMessage(type, message) {
  const msgDiv = document.createElement('div'); msgDiv.className = `message ${type}`; msgDiv.textContent = message;
  const container = document.querySelector('.tab-content.active'); container.insertBefore(msgDiv, container.firstChild);
  setTimeout(() => msgDiv.remove(), 3000);
}
window.addEventListener('DOMContentLoaded', function(){ displayPolicyholders(); });

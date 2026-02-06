<?php
// ===================================
// API ENDPOINTS FOR INSURANCE SYSTEM (UPDATED WITH EDIT SUPPORT)
// ===================================
require_once 'db_connect.php';

// CORS and method
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// ========== POLICYHOLDERS ==========
if ($action == 'get_policyholders') {
  try {
    $stmt = $conn->query("SELECT * FROM Policyholders ORDER BY policyholder_id DESC");
    sendResponse(true, "Policyholders retrieved successfully", $stmt->fetchAll());
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

if ($action == 'add_policyholder' && $method == 'POST') {
  $d = json_decode(file_get_contents('php://input'), true);
  try {
    $stmt = $conn->prepare("INSERT INTO Policyholders (name, dob, contact, email, address)
                            VALUES (:name, :dob, :contact, :email, :address)");
    $stmt->execute([
      ':name'=>sanitize($d['name']), ':dob'=>sanitize($d['dob']),
      ':contact'=>sanitize($d['contact']), ':email'=>sanitize($d['email']),
      ':address'=>sanitize($d['address'])
    ]);
    sendResponse(true, "Policyholder added successfully", ['id'=>$conn->lastInsertId()]);
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

if ($action == 'update_policyholder' && $method == 'POST') {
  $d = json_decode(file_get_contents('php://input'), true);
  try {
    $stmt = $conn->prepare("UPDATE Policyholders SET
                              name=:name, dob=:dob, contact=:contact, email=:email, address=:address
                            WHERE policyholder_id=:id");
    $stmt->execute([
      ':name'=>sanitize($d['name']), ':dob'=>sanitize($d['dob']),
      ':contact'=>sanitize($d['contact']), ':email'=>sanitize($d['email']),
      ':address'=>sanitize($d['address']), ':id'=>(int)$d['policyholder_id']
    ]);
    sendResponse(true, "Policyholder updated successfully");
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

if ($action == 'delete_policyholder' && $method == 'DELETE') {
  $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
  try {
    $stmt = $conn->prepare("DELETE FROM Policyholders WHERE policyholder_id = :id");
    $stmt->execute([':id'=>$id]);
    sendResponse(true, "Policyholder deleted successfully");
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

// ========== AGENTS ==========
if ($action == 'get_agents') {
  try {
    $stmt = $conn->query("SELECT * FROM Agents ORDER BY agent_id DESC");
    sendResponse(true, "Agents retrieved successfully", $stmt->fetchAll());
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

if ($action == 'add_agent' && $method == 'POST') {
  $d = json_decode(file_get_contents('php://input'), true);
  try {
    $stmt = $conn->prepare("INSERT INTO Agents (agent_name, phone, email, commission_rate, joining_date, status)
                            VALUES (:name, :phone, :email, :rate, :joining, 'Active')");
    $stmt->execute([
      ':name'=>sanitize($d['agent_name']), ':phone'=>sanitize($d['phone']),
      ':email'=>sanitize($d['email']), ':rate'=>(float)$d['commission_rate'],
      ':joining'=>sanitize($d['joining_date'])
    ]);
    sendResponse(true, "Agent added successfully", ['id'=>$conn->lastInsertId()]);
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

if ($action == 'update_agent' && $method == 'POST') {
  $d = json_decode(file_get_contents('php://input'), true);
  try {
    $stmt = $conn->prepare("UPDATE Agents SET
                              agent_name=:name, phone=:phone, email=:email, commission_rate=:rate,
                              joining_date=:joining, status=:status
                            WHERE agent_id=:id");
    $stmt->execute([
      ':name'=>sanitize($d['agent_name']), ':phone'=>sanitize($d['phone']),
      ':email'=>sanitize($d['email']), ':rate'=>(float)$d['commission_rate'],
      ':joining'=>sanitize($d['joining_date']), ':status'=>sanitize($d['status']),
      ':id'=>(int)$d['agent_id']
    ]);
    sendResponse(true, "Agent updated successfully");
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

// ========== POLICIES ==========
if ($action == 'get_policies') {
  try {
    $stmt = $conn->query("SELECT p.*, ph.name AS policyholder_name, a.agent_name
                          FROM Policies p
                          LEFT JOIN Policyholders ph ON p.policyholder_id = ph.policyholder_id
                          LEFT JOIN Agents a ON p.agent_id = a.agent_id
                          ORDER BY p.policy_id DESC");
    sendResponse(true, "Policies retrieved successfully", $stmt->fetchAll());
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

if ($action == 'add_policy' && $method == 'POST') {
  $d = json_decode(file_get_contents('php://input'), true);
  try {
    $stmt = $conn->prepare("INSERT INTO Policies
      (policyholder_id, agent_id, policy_type, premium, coverage_amount, start_date, end_date, status)
      VALUES (:ph, :agent, :type, :premium, :coverage, :start, :end, 'Active')");
    $stmt->execute([
      ':ph'=>(int)$d['policyholder_id'],
      ':agent'=> isset($d['agent_id']) ? (int)$d['agent_id'] : null,
      ':type'=>sanitize($d['policy_type']),
      ':premium'=>(float)$d['premium'],
      ':coverage'=>(float)$d['coverage_amount'],
      ':start'=>sanitize($d['start_date']),
      ':end'=>sanitize($d['end_date'])
    ]);
    sendResponse(true, "Policy added successfully", ['id'=>$conn->lastInsertId()]);
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

if ($action == 'update_policy' && $method == 'POST') {
  $d = json_decode(file_get_contents('php://input'), true);
  try {
    $stmt = $conn->prepare("UPDATE Policies SET
        policyholder_id=:ph, agent_id=:agent, policy_type=:type,
        premium=:premium, coverage_amount=:coverage,
        start_date=:start, end_date=:end, status=:status
      WHERE policy_id=:id");
    $stmt->execute([
      ':ph'=>(int)$d['policyholder_id'],
      ':agent'=> isset($d['agent_id']) ? (int)$d['agent_id'] : null,
      ':type'=>sanitize($d['policy_type']),
      ':premium'=>(float)$d['premium'],
      ':coverage'=>(float)$d['coverage_amount'],
      ':start'=>sanitize($d['start_date']),
      ':end'=>sanitize($d['end_date']),
      ':status'=>sanitize($d['status']),
      ':id'=>(int)$d['policy_id']
    ]);
    sendResponse(true, "Policy updated successfully");
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

// ========== CLAIMS ==========
if ($action == 'get_claims') {
  try {
    $stmt = $conn->query("SELECT c.*, p.policy_type, ph.name AS policyholder_name
                          FROM Claims c
                          LEFT JOIN Policies p ON c.policy_id = p.policy_id
                          LEFT JOIN Policyholders ph ON p.policyholder_id = ph.policyholder_id
                          ORDER BY c.claim_id DESC");
    sendResponse(true, "Claims retrieved successfully", $stmt->fetchAll());
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

if ($action == 'add_claim' && $method == 'POST') {
  $d = json_decode(file_get_contents('php://input'), true);
  try {
    $stmt = $conn->prepare("INSERT INTO Claims (policy_id, claim_date, claim_amount, status, remarks)
                            VALUES (:policy_id, :date, :amount, :status, :remarks)");
    $stmt->execute([
      ':policy_id'=>(int)$d['policy_id'],
      ':date'=>sanitize($d['claim_date']),
      ':amount'=>(float)$d['claim_amount'],
      ':status'=>sanitize($d['status']),
      ':remarks'=>sanitize($d['remarks'])
    ]);
    sendResponse(true, "Claim filed successfully", ['id'=>$conn->lastInsertId()]);
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

if ($action == 'update_claim' && $method == 'POST') {
  $d = json_decode(file_get_contents('php://input'), true);
  try {
    $stmt = $conn->prepare("UPDATE Claims SET
        policy_id=:policy_id, claim_date=:date, claim_amount=:amount,
        status=:status, approved_amount=:approved, settlement_date=:settlement, remarks=:remarks
      WHERE claim_id=:id");
    $stmt->execute([
      ':policy_id'=>(int)$d['policy_id'],
      ':date'=>sanitize($d['claim_date']),
      ':amount'=>(float)$d['claim_amount'],
      ':status'=>sanitize($d['status']),
      ':approved'=> isset($d['approved_amount']) ? (float)$d['approved_amount'] : 0.0,
      ':settlement'=> !empty($d['settlement_date']) ? sanitize($d['settlement_date']) : null,
      ':remarks'=>sanitize($d['remarks']),
      ':id'=>(int)$d['claim_id']
    ]);
    sendResponse(true, "Claim updated successfully");
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

// ========== STATS ==========
if ($action == 'get_statistics') {
  try {
    $stats = [];
    $stats['total_policyholders'] = (int)$conn->query("SELECT COUNT(*) c FROM Policyholders")->fetch()['c'];
    $stats['active_policies'] = (int)$conn->query("SELECT COUNT(*) c FROM Policies WHERE status='Active'")->fetch()['c'];
    $p = $conn->query("SELECT COUNT(*) c, COALESCE(SUM(claim_amount),0) t FROM Claims WHERE status='Pending'")->fetch();
    $stats['pending_claims'] = (int)$p['c']; $stats['pending_amount'] = (float)$p['t'];
    $stats['active_agents'] = (int)$conn->query("SELECT COUNT(*) c FROM Agents WHERE status='Active'")->fetch()['c'];
    sendResponse(true, "Statistics retrieved successfully", $stats);
  } catch(PDOException $e) { sendResponse(false, $e->getMessage()); }
}

if (empty($action)) { sendResponse(false, "No action specified"); }

If you want the file, please let me know and I can provide it in a downloadable format for your ease.-- Drop tables if they exist
DROP TABLE IF EXISTS Claims;
DROP TABLE IF EXISTS Policies;
DROP TABLE IF EXISTS Agents;
DROP TABLE IF EXISTS Policyholders;

-- Policyholders Table
CREATE TABLE Policyholders (
    policyholder_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    contact VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    address VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_dob CHECK (dob < CURDATE()),
    CONSTRAINT chk_contact CHECK (LENGTH(contact) = 10)
);

-- Agents Table
CREATE TABLE Agents (
    agent_id INT PRIMARY KEY AUTO_INCREMENT,
    agent_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    commission_rate DECIMAL(5,2) DEFAULT 5.00,
    joining_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    CONSTRAINT chk_phone CHECK (LENGTH(phone) = 10),
    CONSTRAINT chk_commission CHECK (commission_rate >= 0 AND commission_rate <= 20),
    CONSTRAINT chk_status CHECK (status IN ('Active', 'Inactive', 'Suspended'))
);

-- Policies Table
CREATE TABLE Policies (
    policy_id INT PRIMARY KEY AUTO_INCREMENT,
    policyholder_id INT NOT NULL,
    agent_id INT,
    policy_type VARCHAR(50) NOT NULL,
    premium DECIMAL(10,2) NOT NULL,
    coverage_amount DECIMAL(12,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    FOREIGN KEY (policyholder_id) REFERENCES Policyholders(policyholder_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES Agents(agent_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_premium CHECK (premium > 0),
    CONSTRAINT chk_coverage CHECK (coverage_amount > 0),
    CONSTRAINT chk_dates CHECK (end_date > start_date),
    CONSTRAINT chk_policy_status CHECK (status IN ('Active', 'Expired', 'Cancelled', 'Lapsed')),
    CONSTRAINT chk_policy_type CHECK (policy_type IN ('Life', 'Health', 'Motor', 'Home', 'Travel'))
);

-- Claims Table
CREATE TABLE Claims (
    claim_id INT PRIMARY KEY AUTO_INCREMENT,
    policy_id INT NOT NULL,
    claim_date DATE NOT NULL,
    claim_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    approved_amount DECIMAL(10,2) DEFAULT 0.00,
    settlement_date DATE,
    remarks TEXT,
    FOREIGN KEY (policy_id) REFERENCES Policies(policy_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_claim_amount CHECK (claim_amount > 0),
    CONSTRAINT chk_approved_amount CHECK (approved_amount >= 0),
    CONSTRAINT chk_claim_status CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Settled')),
    CONSTRAINT chk_settlement CHECK (settlement_date IS NULL OR settlement_date >= claim_date)
);

-- Sample Data insertion
INSERT INTO Policyholders (name, dob, contact, email, address) VALUES
('Rajesh Kumar', '1985-03-15', '9876543210', 'rajesh.kumar@email.com', 'MG Road, Bangalore'),
('Priya Sharma', '1990-07-22', '9876543211', 'priya.sharma@email.com', 'Connaught Place, Delhi'),
('Amit Patel', '1978-11-08', '9876543212', 'amit.patel@email.com', 'Satellite Area, Ahmedabad'),
('Sneha Reddy', '1995-01-30', '9876543213', 'sneha.reddy@email.com', 'Banjara Hills, Hyderabad'),
('Vikram Singh', '1982-09-12', '9876543214', 'vikram.singh@email.com', 'Park Street, Kolkata'),
('Ananya Iyer', '1988-05-18', '9876543215', 'ananya.iyer@email.com', 'T Nagar, Chennai'),
('Rahul Joshi', '1992-12-25', '9876543216', 'rahul.joshi@email.com', 'Koregaon Park, Pune'),
('Kavita Desai', '1980-06-14', '9876543217', 'kavita.desai@email.com', 'Vastrapur, Ahmedabad');

-- The inserts for Agents, Policies, and Claims are similar as in the initial setup.

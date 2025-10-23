
-- Insert Admin Users (2 admins)
-- Password: admin123 (BCrypt hash)
INSERT INTO users (name, email, password, phone_number, role, gender, date_of_birth, address) VALUES
                                                                                                  ('Admin Kumar', 'admin1@healthmate.com', '$2b$12$q.kdVYBUdvb9dPKUfeJzkuxVuwasHRPEf9luIDkdqMB2juruSbZlq', '+91-9876543210', 'ROLE_ADMIN', 'MALE', '1985-05-15', '123 Admin Street, Mumbai, Maharashtra, India'),
                                                                                                  ('Priya Admin', 'admin2@healthmate.com', '$2b$12$q.kdVYBUdvb9dPKUfeJzkuxVuwasHRPEf9luIDkdqMB2juruSbZlq', '+91-9876543211', 'ROLE_ADMIN', 'FEMALE', '1988-08-20', '456 Admin Lane, Delhi, India');

-- Insert Doctor Users (10 doctors)
-- Password: doctor123 (BCrypt hash)
INSERT INTO users (name, email, password, phone_number, role, gender, date_of_birth, address) VALUES
                                                                                                  ('Dr. Rajesh Kumar', 'rajesh.kumar@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543212', 'ROLE_DOCTOR', 'MALE', '1980-03-10', '789 Medical Plaza, Mumbai, Maharashtra, India'),
                                                                                                  ('Dr. Priya Sharma', 'priya.sharma@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543213', 'ROLE_DOCTOR', 'FEMALE', '1982-07-22', '234 Health Avenue, Delhi, India'),
                                                                                                  ('Dr. Amit Patel', 'amit.patel@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543214', 'ROLE_DOCTOR', 'MALE', '1975-11-30', '567 Clinic Road, Ahmedabad, Gujarat, India'),
                                                                                                  ('Dr. Sneha Reddy', 'sneha.reddy@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543215', 'ROLE_DOCTOR', 'FEMALE', '1985-01-18', '890 Hospital Street, Hyderabad, Telangana, India'),
                                                                                                  ('Dr. Vikram Singh', 'vikram.singh@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543216', 'ROLE_DOCTOR', 'MALE', '1978-09-05', '123 Care Center, Jaipur, Rajasthan, India'),
                                                                                                  ('Dr. Anjali Gupta', 'anjali.gupta@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543217', 'ROLE_DOCTOR', 'FEMALE', '1983-04-12', '456 Wellness Boulevard, Kolkata, West Bengal, India'),
                                                                                                  ('Dr. Rahul Verma', 'rahul.verma@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543218', 'ROLE_DOCTOR', 'MALE', '1981-06-25', '789 Medical Complex, Chennai, Tamil Nadu, India'),
                                                                                                  ('Dr. Kavita Desai', 'kavita.desai@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543219', 'ROLE_DOCTOR', 'FEMALE', '1986-12-08', '234 Doctor Lane, Pune, Maharashtra, India'),
                                                                                                  ('Dr. Arjun Mehta', 'arjun.mehta@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543220', 'ROLE_DOCTOR', 'MALE', '1979-02-14', '567 Health Park, Bangalore, Karnataka, India'),
                                                                                                  ('Dr. Neha Kapoor', 'neha.kapoor@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543221', 'ROLE_DOCTOR', 'FEMALE', '1984-10-19', '890 Cure Street, Lucknow, Uttar Pradesh, India');

-- Insert Patient Users (30 patients)
-- Password: patient123 (BCrypt hash)
INSERT INTO users (name, email, password, phone_number, role, gender, date_of_birth, address) VALUES
                                                                                                  ('Amit Patel', 'amit.patel@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543222', 'ROLE_PATIENT', 'MALE', '1990-01-15', '101 Park Street, Mumbai, Maharashtra, India'),
                                                                                                  ('Sneha Gupta', 'sneha.gupta@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543223', 'ROLE_PATIENT', 'FEMALE', '1992-03-20', '102 Garden Road, Delhi, India'),
                                                                                                  ('Ravi Kumar', 'ravi.kumar@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543224', 'ROLE_PATIENT', 'MALE', '1988-05-10', '103 Lake View, Bangalore, Karnataka, India'),
                                                                                                  ('Pooja Sharma', 'pooja.sharma@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543225', 'ROLE_PATIENT', 'FEMALE', '1995-07-25', '104 Hill Station, Chennai, Tamil Nadu, India'),
                                                                                                  ('Suresh Reddy', 'suresh.reddy@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543226', 'ROLE_PATIENT', 'MALE', '1987-09-12', '105 Beach Road, Hyderabad, Telangana, India'),
                                                                                                  ('Anjali Singh', 'anjali.singh@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543227', 'ROLE_PATIENT', 'FEMALE', '1993-11-08', '106 Green Avenue, Kolkata, West Bengal, India'),
                                                                                                  ('Manoj Verma', 'manoj.verma@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543228', 'ROLE_PATIENT', 'MALE', '1991-02-18', '107 Valley Drive, Pune, Maharashtra, India'),
                                                                                                  ('Divya Iyer', 'divya.iyer@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543229', 'ROLE_PATIENT', 'FEMALE', '1994-04-22', '108 River Side, Jaipur, Rajasthan, India'),
                                                                                                  ('Karthik Nair', 'karthik.nair@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543230', 'ROLE_PATIENT', 'MALE', '1989-06-30', '109 Mountain View, Ahmedabad, Gujarat, India'),
                                                                                                  ('Deepika Rao', 'deepika.rao@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543231', 'ROLE_PATIENT', 'FEMALE', '1996-08-14', '110 Ocean Drive, Kochi, Kerala, India'),
                                                                                                  ('Rahul Joshi', 'rahul.joshi@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543232', 'ROLE_PATIENT', 'MALE', '1990-10-05', '111 Forest Lane, Indore, Madhya Pradesh, India'),
                                                                                                  ('Priyanka Das', 'priyanka.das@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543233', 'ROLE_PATIENT', 'FEMALE', '1992-12-19', '112 Star Street, Chandigarh, India'),
                                                                                                  ('Anil Kumar', 'anil.kumar@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543234', 'ROLE_PATIENT', 'MALE', '1985-03-27', '113 Sun Avenue, Bhopal, Madhya Pradesh, India'),
                                                                                                  ('Lakshmi Menon', 'lakshmi.menon@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543235', 'ROLE_PATIENT', 'FEMALE', '1997-05-11', '114 Moon Road, Trivandrum, Kerala, India'),
                                                                                                  ('Sandeep Pillai', 'sandeep.pillai@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543236', 'ROLE_PATIENT', 'MALE', '1991-07-23', '115 Cloud Street, Nagpur, Maharashtra, India'),
                                                                                                  ('Meera Krishnan', 'meera.krishnan@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543237', 'ROLE_PATIENT', 'FEMALE', '1993-09-16', '116 Wind Lane, Coimbatore, Tamil Nadu, India'),
                                                                                                  ('Vijay Malhotra', 'vijay.malhotra@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543238', 'ROLE_PATIENT', 'MALE', '1988-11-29', '117 Rain Avenue, Surat, Gujarat, India'),
                                                                                                  ('Nisha Bhatt', 'nisha.bhatt@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543239', 'ROLE_PATIENT', 'FEMALE', '1994-01-06', '118 Storm Street, Ludhiana, Punjab, India'),
                                                                                                  ('Rohan Agarwal', 'rohan.agarwal@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543240', 'ROLE_PATIENT', 'MALE', '1990-03-13', '119 Thunder Road, Patna, Bihar, India'),
                                                                                                  ('Swati Banerjee', 'swati.banerjee@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543241', 'ROLE_PATIENT', 'FEMALE', '1995-05-21', '120 Lightning Lane, Guwahati, Assam, India'),
                                                                                                  ('Naveen Choudhary', 'naveen.choudhary@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543242', 'ROLE_PATIENT', 'MALE', '1987-07-08', '121 Snow Avenue, Dehradun, Uttarakhand, India'),
                                                                                                  ('Rekha Pandey', 'rekha.pandey@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543243', 'ROLE_PATIENT', 'FEMALE', '1992-09-17', '122 Frost Street, Ranchi, Jharkhand, India'),
                                                                                                  ('Akash Tiwari', 'akash.tiwari@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543244', 'ROLE_PATIENT', 'MALE', '1989-11-24', '123 Ice Road, Bhubaneswar, Odisha, India'),
                                                                                                  ('Kavita Saxena', 'kavita.saxena@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543245', 'ROLE_PATIENT', 'FEMALE', '1994-02-03', '124 Fire Lane, Raipur, Chhattisgarh, India'),
                                                                                                  ('Sanjay Mishra', 'sanjay.mishra@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543246', 'ROLE_PATIENT', 'MALE', '1991-04-09', '125 Earth Avenue, Varanasi, Uttar Pradesh, India'),
                                                                                                  ('Ritika Chauhan', 'ritika.chauhan@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543247', 'ROLE_PATIENT', 'FEMALE', '1993-06-15', '126 Sky Street, Shimla, Himachal Pradesh, India'),
                                                                                                  ('Tarun Yadav', 'tarun.yadav@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543248', 'ROLE_PATIENT', 'MALE', '1988-08-28', '127 Space Road, Kanpur, Uttar Pradesh, India'),
                                                                                                  ('Shalini Dubey', 'shalini.dubey@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543249', 'ROLE_PATIENT', 'FEMALE', '1995-10-04', '128 Galaxy Lane, Agra, Uttar Pradesh, India'),
                                                                                                  ('Nikhil Sinha', 'nikhil.sinha@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543250', 'ROLE_PATIENT', 'MALE', '1990-12-11', '129 Cosmos Avenue, Gwalior, Madhya Pradesh, India'),
                                                                                                  ('Shruti Gupta', 'shruti.gupta@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543251', 'ROLE_PATIENT', 'FEMALE', '1992-02-26', '130 Universe Street, Mysore, Karnataka, India');

-- Insert Doctor records (links to users 3-12)
INSERT INTO doctors (user_id, experience, available_hours, specialization) VALUES
                                                                               (3, 15, '9:00 AM - 5:00 PM, Mon-Fri', 'Cardiology'),
                                                                               (4, 12, '10:00 AM - 6:00 PM, Mon-Sat', 'Pediatrics'),
                                                                               (5, 20, '8:00 AM - 4:00 PM, Mon-Fri', 'Orthopedics'),
                                                                               (6, 10, '11:00 AM - 7:00 PM, Tue-Sat', 'Dermatology'),
                                                                               (7, 18, '9:00 AM - 5:00 PM, Mon-Fri', 'Neurology'),
                                                                               (8, 14, '10:00 AM - 6:00 PM, Mon-Sat', 'Gynecology'),
                                                                               (9, 16, '8:00 AM - 4:00 PM, Mon-Fri', 'General Medicine'),
                                                                               (10, 11, '9:00 AM - 5:00 PM, Mon-Sat', 'ENT'),
                                                                               (11, 22, '10:00 AM - 6:00 PM, Mon-Fri', 'Gastroenterology'),
                                                                               (12, 13, '11:00 AM - 7:00 PM, Tue-Sat', 'Psychiatry');

-- Insert Patient records (links to users 13-42)
INSERT INTO patients (user_id) VALUES
                                   (13), (14), (15), (16), (17), (18), (19), (20), (21), (22),
                                   (23), (24), (25), (26), (27), (28), (29), (30), (31), (32),
                                   (33), (34), (35), (36), (37), (38), (39), (40), (41), (42);

-- Insert Appointments (50 appointments distributed across statuses)
-- Status distribution: SCHEDULED (15), CONFIRMED (12), COMPLETED (15), CANCELED (8)
-- Note: doctor_id references doctors table (IDs 3-12) and patient_id references patients table (IDs 13-42)

-- SCHEDULED appointments (15)
INSERT INTO appointments (appointment_date_time, status, notes, appointment_code, doctor_id, patient_id) VALUES
                                                                                                             ('2025-11-01 10:00:00', 'SCHEDULED', 'Regular checkup', 'APT-2025-001', 3, 13),
                                                                                                             ('2025-11-02 11:30:00', 'SCHEDULED', 'Follow-up consultation', 'APT-2025-002', 4, 14),
                                                                                                             ('2025-11-03 09:00:00', 'SCHEDULED', 'Initial consultation', 'APT-2025-003', 5, 15),
                                                                                                             ('2025-11-04 14:00:00', 'SCHEDULED', 'Annual health checkup', 'APT-2025-004', 6, 16),
                                                                                                             ('2025-11-05 15:30:00', 'SCHEDULED', 'X-ray review', 'APT-2025-005', 7, 17),
                                                                                                             ('2025-11-06 10:30:00', 'SCHEDULED', 'Skin consultation', 'APT-2025-006', 8, 18),
                                                                                                             ('2025-11-07 11:00:00', 'SCHEDULED', 'Neurological assessment', 'APT-2025-007', 9, 19),
                                                                                                             ('2025-11-08 13:00:00', 'SCHEDULED', 'Prenatal checkup', 'APT-2025-008', 10, 20),
                                                                                                             ('2025-11-09 09:30:00', 'SCHEDULED', 'General consultation', 'APT-2025-009', 11, 21),
                                                                                                             ('2025-11-10 16:00:00', 'SCHEDULED', 'Ear infection treatment', 'APT-2025-010', 12, 22),
                                                                                                             ('2025-11-11 10:00:00', 'SCHEDULED', 'Stomach pain consultation', 'APT-2025-011', 3, 23),
                                                                                                             ('2025-11-12 12:00:00', 'SCHEDULED', 'Mental health consultation', 'APT-2025-012', 4, 24),
                                                                                                             ('2025-11-13 14:30:00', 'SCHEDULED', 'Blood pressure monitoring', 'APT-2025-013', 5, 25),
                                                                                                             ('2025-11-14 11:30:00', 'SCHEDULED', 'Vaccination', 'APT-2025-014', 6, 26),
                                                                                                             ('2025-11-15 15:00:00', 'SCHEDULED', 'Joint pain consultation', 'APT-2025-015', 7, 27),

-- CONFIRMED appointments (12)
                                                                                                             ('2025-11-16 10:00:00', 'CONFIRMED', 'Confirmed cardiac screening', 'APT-2025-016', 8, 28),
                                                                                                             ('2025-11-17 11:00:00', 'CONFIRMED', 'Child wellness visit', 'APT-2025-017', 9, 29),
                                                                                                             ('2025-11-18 09:00:00', 'CONFIRMED', 'Fracture review', 'APT-2025-018', 10, 30),
                                                                                                             ('2025-11-19 14:00:00', 'CONFIRMED', 'Acne treatment', 'APT-2025-019', 11, 31),
                                                                                                             ('2025-11-20 15:30:00', 'CONFIRMED', 'Headache assessment', 'APT-2025-020', 12, 32),
                                                                                                             ('2025-11-21 10:30:00', 'CONFIRMED', 'Gynecological exam', 'APT-2025-021', 3, 33),
                                                                                                             ('2025-11-22 11:00:00', 'CONFIRMED', 'Fever consultation', 'APT-2025-022', 4, 34),
                                                                                                             ('2025-11-23 13:00:00', 'CONFIRMED', 'Hearing test', 'APT-2025-023', 5, 35),
                                                                                                             ('2025-11-24 09:30:00', 'CONFIRMED', 'Digestive issues', 'APT-2025-024', 6, 36),
                                                                                                             ('2025-11-25 16:00:00', 'CONFIRMED', 'Anxiety consultation', 'APT-2025-025', 7, 37),
                                                                                                             ('2025-11-26 10:00:00', 'CONFIRMED', 'Heart palpitations checkup', 'APT-2025-026', 8, 38),
                                                                                                             ('2025-11-27 12:00:00', 'CONFIRMED', 'Child development assessment', 'APT-2025-027', 9, 39),

-- COMPLETED appointments (15)
                                                                                                             ('2024-10-01 10:00:00', 'COMPLETED', 'Completed cardiac checkup', 'APT-2024-028', 10, 40),
                                                                                                             ('2024-10-05 11:30:00', 'COMPLETED', 'Completed vaccination', 'APT-2024-029', 11, 41),
                                                                                                             ('2024-10-10 09:00:00', 'COMPLETED', 'Completed physiotherapy session', 'APT-2024-030', 12, 42),
                                                                                                             ('2024-10-15 14:00:00', 'COMPLETED', 'Completed skin treatment', 'APT-2024-031', 3, 13),
                                                                                                             ('2024-10-20 15:30:00', 'COMPLETED', 'Completed brain scan review', 'APT-2024-032', 4, 14),
                                                                                                             ('2024-10-25 10:30:00', 'COMPLETED', 'Completed pregnancy ultrasound', 'APT-2024-033', 5, 15),
                                                                                                             ('2024-09-01 11:00:00', 'COMPLETED', 'Completed general health checkup', 'APT-2024-034', 6, 16),
                                                                                                             ('2024-09-05 13:00:00', 'COMPLETED', 'Completed ear examination', 'APT-2024-035', 7, 17),
                                                                                                             ('2024-09-10 09:30:00', 'COMPLETED', 'Completed endoscopy', 'APT-2024-036', 8, 18),
                                                                                                             ('2024-09-15 16:00:00', 'COMPLETED', 'Completed therapy session', 'APT-2024-037', 9, 19),
                                                                                                             ('2024-08-01 10:00:00', 'COMPLETED', 'Completed ECG test', 'APT-2024-038', 10, 20),
                                                                                                             ('2024-08-05 12:00:00', 'COMPLETED', 'Completed immunization', 'APT-2024-039', 11, 21),
                                                                                                             ('2024-08-10 14:30:00', 'COMPLETED', 'Completed X-ray examination', 'APT-2024-040', 12, 22),
                                                                                                             ('2024-07-15 11:30:00', 'COMPLETED', 'Completed allergy test', 'APT-2024-041', 3, 23),
                                                                                                             ('2024-07-20 15:00:00', 'COMPLETED', 'Completed MRI scan', 'APT-2024-042', 4, 24),

-- CANCELED appointments (8)
                                                                                                             ('2024-10-08 10:00:00', 'CANCELED', 'Patient canceled - rescheduling needed', 'APT-2024-043', 5, 25),
                                                                                                             ('2024-10-12 11:00:00', 'CANCELED', 'Doctor unavailable', 'APT-2024-044', 6, 26),
                                                                                                             ('2024-10-18 09:00:00', 'CANCELED', 'Patient no-show', 'APT-2024-045', 7, 27),
                                                                                                             ('2024-10-22 14:00:00', 'CANCELED', 'Emergency cancellation', 'APT-2024-046', 8, 28),
                                                                                                             ('2024-09-20 15:30:00', 'CANCELED', 'Patient canceled due to personal reasons', 'APT-2024-047', 9, 29),
                                                                                                             ('2024-09-25 10:30:00', 'CANCELED', 'Clinic closed for maintenance', 'APT-2024-048', 10, 30),
                                                                                                             ('2024-08-15 11:00:00', 'CANCELED', 'Patient requested cancellation', 'APT-2024-049', 11, 31),
                                                                                                             ('2024-08-20 13:00:00', 'CANCELED', 'Doctor on leave', 'APT-2024-050', 12, 32);

-- Display summary of inserted data
SELECT 'Database populated successfully!' as message;
SELECT COUNT(*) as total_users FROM users;
SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role;
SELECT COUNT(*) as total_doctors FROM doctors;
SELECT COUNT(*) as total_patients FROM patients;
SELECT COUNT(*) as total_appointments FROM appointments;
SELECT status, COUNT(*) as count FROM appointments GROUP BY status ORDER BY status;

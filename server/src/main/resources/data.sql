-- =========================================
-- HealthMate Advanced - Sample Data
-- =========================================
-- This file contains comprehensive sample data for development and testing
-- Passwords are BCrypt hashed for security

-- =========================================
-- ADMIN USERS (2 admins)
-- =========================================
-- Password: admin123 (BCrypt hash: $2b$12$q.kdVYBUdvb9dPKUfeJzkuxVuwasHRPEf9luIDkdqMB2juruSbZlq)
INSERT INTO users (name, email, password, phone_number, role, gender, date_of_birth, address) VALUES
('System Administrator', 'admin@healthmate.com', '$2b$12$q.kdVYBUdvb9dPKUfeJzkuxVuwasHRPEf9luIDkdqMB2juruSbZlq', '+91-9876543210', 'ROLE_ADMIN', 'MALE', '1985-05-15', 'HealthMate Headquarters, Sector 62, Noida, Uttar Pradesh 201301, India'),
('Admin Supervisor', 'supervisor@healthmate.com', '$2b$12$q.kdVYBUdvb9dPKUfeJzkuxVuwasHRPEf9luIDkdqMB2juruSbZlq', '+91-9876543211', 'ROLE_ADMIN', 'FEMALE', '1988-08-20', 'HealthMate Admin Office, Connaught Place, New Delhi, Delhi 110001, India');

-- =========================================
-- DOCTOR USERS (15 doctors with diverse specializations)
-- =========================================
-- Password: doctor123 (BCrypt hash: $2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.)
INSERT INTO users (name, email, password, phone_number, role, gender, date_of_birth, address) VALUES
('Dr. Rajesh Kumar', 'rajesh.kumar@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543212', 'ROLE_DOCTOR', 'MALE', '1980-03-10', 'Apollo Hospital, Sarita Vihar, New Delhi 110076, India'),
('Dr. Priya Sharma', 'priya.sharma@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543213', 'ROLE_DOCTOR', 'FEMALE', '1982-07-22', 'Fortis Hospital, Vasant Kunj, New Delhi 110070, India'),
('Dr. Amit Patel', 'amit.patel@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543214', 'ROLE_DOCTOR', 'MALE', '1975-11-30', 'Sterling Hospital, Gurukul, Ahmedabad, Gujarat 380052, India'),
('Dr. Sneha Reddy', 'sneha.reddy@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543215', 'ROLE_DOCTOR', 'FEMALE', '1985-01-18', 'Yashoda Hospital, Somajiguda, Hyderabad, Telangana 500082, India'),
('Dr. Vikram Singh', 'vikram.singh@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543216', 'ROLE_DOCTOR', 'MALE', '1978-09-05', 'Manipal Hospital, Malviya Nagar, Jaipur, Rajasthan 302017, India'),
('Dr. Anjali Gupta', 'anjali.gupta@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543217', 'ROLE_DOCTOR', 'FEMALE', '1983-04-12', 'AMRI Hospital, Dhakuria, Kolkata, West Bengal 700029, India'),
('Dr. Rahul Verma', 'rahul.verma@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543218', 'ROLE_DOCTOR', 'MALE', '1981-06-25', 'Apollo Hospital, Greams Road, Chennai, Tamil Nadu 600006, India'),
('Dr. Kavita Desai', 'kavita.desai@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543219', 'ROLE_DOCTOR', 'FEMALE', '1986-12-08', 'Ruby Hall Clinic, Hinjewadi, Pune, Maharashtra 411057, India'),
('Dr. Arjun Mehta', 'arjun.mehta@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543220', 'ROLE_DOCTOR', 'MALE', '1979-02-14', 'Manipal Hospital, HAL Airport Road, Bangalore, Karnataka 560017, India'),
('Dr. Neha Kapoor', 'neha.kapoor@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543221', 'ROLE_DOCTOR', 'FEMALE', '1984-10-19', 'Max Super Speciality Hospital, Shalimar Bagh, New Delhi 110088, India'),
('Dr. Sanjay Malhotra', 'sanjay.malhotra@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543222', 'ROLE_DOCTOR', 'MALE', '1977-05-16', 'Medanta The Medicity, Sector 38, Gurgaon, Haryana 122001, India'),
('Dr. Deepika Nair', 'deepika.nair@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543223', 'ROLE_DOCTOR', 'FEMALE', '1987-09-23', 'Amrita Institute of Medical Sciences, Kochi, Kerala 682041, India'),
('Dr. Rohit Bansal', 'rohit.bansal@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543224', 'ROLE_DOCTOR', 'MALE', '1983-11-11', 'Indraprastha Apollo Hospital, Sarita Vihar, Delhi 110076, India'),
('Dr. Swati Joshi', 'swati.joshi@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543225', 'ROLE_DOCTOR', 'FEMALE', '1989-03-27', 'Lilavati Hospital, Bandra West, Mumbai, Maharashtra 400050, India'),
('Dr. Karan Chopra', 'karan.chopra@healthmate.com', '$2b$12$vs4Gwtm0qMU06MrhG/sFduGgvoBoecKce/C2KoVtV8pK8LlmhZnL.', '+91-9876543226', 'ROLE_DOCTOR', 'MALE', '1976-12-19', 'BLK Super Speciality Hospital, Pusa Road, New Delhi 110005, India');

-- =========================================
-- PATIENT USERS (40 patients)
-- =========================================
-- Password: patient123 (BCrypt hash: $2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu)
INSERT INTO users (name, email, password, phone_number, role, gender, date_of_birth, address) VALUES
('Amit Kumar Patel', 'amit.patel@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543230', 'ROLE_PATIENT', 'MALE', '1990-01-15', 'B-204, Sunflower Apartments, Andheri West, Mumbai, Maharashtra 400053, India'),
('Sneha Gupta', 'sneha.gupta@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543231', 'ROLE_PATIENT', 'FEMALE', '1992-03-20', 'Flat 302, Green Park Extension, New Delhi 110016, India'),
('Ravi Kumar Sharma', 'ravi.kumar@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543232', 'ROLE_PATIENT', 'MALE', '1988-05-10', '15/3, Koramangala 4th Block, Bangalore, Karnataka 560034, India'),
('Pooja Sharma', 'pooja.sharma@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543233', 'ROLE_PATIENT', 'FEMALE', '1995-07-25', 'Villa 45, Anna Nagar, Chennai, Tamil Nadu 600040, India'),
('Suresh Reddy', 'suresh.reddy@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543234', 'ROLE_PATIENT', 'MALE', '1987-09-12', 'House No. 78, Jubilee Hills, Hyderabad, Telangana 500033, India'),
('Anjali Singh', 'anjali.singh@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543235', 'ROLE_PATIENT', 'FEMALE', '1993-11-08', 'Apartment 5A, Salt Lake, Kolkata, West Bengal 700064, India'),
('Manoj Verma', 'manoj.verma@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543236', 'ROLE_PATIENT', 'MALE', '1991-02-18', 'Plot 234, Viman Nagar, Pune, Maharashtra 411014, India'),
('Divya Iyer', 'divya.iyer@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543237', 'ROLE_PATIENT', 'FEMALE', '1994-04-22', '89, C-Scheme, Jaipur, Rajasthan 302001, India'),
('Karthik Nair', 'karthik.nair@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543238', 'ROLE_PATIENT', 'MALE', '1989-06-30', 'Bungalow 12, Satellite, Ahmedabad, Gujarat 380015, India'),
('Deepika Rao', 'deepika.rao@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543239', 'ROLE_PATIENT', 'FEMALE', '1996-08-14', 'Apartment 7B, Panampilly Nagar, Kochi, Kerala 682036, India'),
('Rahul Joshi', 'rahul.joshi@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543240', 'ROLE_PATIENT', 'MALE', '1990-10-05', '56/2, Vijay Nagar, Indore, Madhya Pradesh 452010, India'),
('Priyanka Das', 'priyanka.das@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543241', 'ROLE_PATIENT', 'FEMALE', '1992-12-19', 'House 34, Sector 17, Chandigarh 160017, India'),
('Anil Kumar', 'anil.kumar@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543242', 'ROLE_PATIENT', 'MALE', '1985-03-27', 'D-67, Arera Colony, Bhopal, Madhya Pradesh 462016, India'),
('Lakshmi Menon', 'lakshmi.menon@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543243', 'ROLE_PATIENT', 'FEMALE', '1997-05-11', 'TC 25/1456, Pattom, Trivandrum, Kerala 695004, India'),
('Sandeep Pillai', 'sandeep.pillai@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543244', 'ROLE_PATIENT', 'MALE', '1991-07-23', 'Flat 12C, Ramdaspeth, Nagpur, Maharashtra 440010, India'),
('Meera Krishnan', 'meera.krishnan@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543245', 'ROLE_PATIENT', 'FEMALE', '1993-09-16', '45, RS Puram, Coimbatore, Tamil Nadu 641002, India'),
('Vijay Malhotra', 'vijay.malhotra@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543246', 'ROLE_PATIENT', 'MALE', '1988-11-29', 'Villa 89, Vesu, Surat, Gujarat 395007, India'),
('Nisha Bhatt', 'nisha.bhatt@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543247', 'ROLE_PATIENT', 'FEMALE', '1994-01-06', 'House 234, Model Town, Ludhiana, Punjab 141002, India'),
('Rohan Agarwal', 'rohan.agarwal@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543248', 'ROLE_PATIENT', 'MALE', '1990-03-13', 'Apartment 6D, Boring Road, Patna, Bihar 800001, India'),
('Swati Banerjee', 'swati.banerjee@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543249', 'ROLE_PATIENT', 'FEMALE', '1995-05-21', 'Flat 8A, GS Road, Guwahati, Assam 781005, India'),
('Naveen Choudhary', 'naveen.choudhary@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543250', 'ROLE_PATIENT', 'MALE', '1987-07-08', 'Villa 123, Rajpur Road, Dehradun, Uttarakhand 248001, India'),
('Rekha Pandey', 'rekha.pandey@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543251', 'ROLE_PATIENT', 'FEMALE', '1992-09-17', 'House 56, HEC, Ranchi, Jharkhand 834004, India'),
('Akash Tiwari', 'akash.tiwari@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543252', 'ROLE_PATIENT', 'MALE', '1989-11-24', 'Plot 78, Nayapalli, Bhubaneswar, Odisha 751012, India'),
('Kavita Saxena', 'kavita.saxena@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543253', 'ROLE_PATIENT', 'FEMALE', '1994-02-03', 'Apartment 4B, Devendra Nagar, Raipur, Chhattisgarh 492001, India'),
('Sanjay Mishra', 'sanjay.mishra@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543254', 'ROLE_PATIENT', 'MALE', '1991-04-09', 'D-23/45, Sigra, Varanasi, Uttar Pradesh 221010, India'),
('Ritika Chauhan', 'ritika.chauhan@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543255', 'ROLE_PATIENT', 'FEMALE', '1993-06-15', 'House 12, The Mall Road, Shimla, Himachal Pradesh 171001, India'),
('Tarun Yadav', 'tarun.yadav@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543256', 'ROLE_PATIENT', 'MALE', '1988-08-28', 'Flat 15C, Kakadeo, Kanpur, Uttar Pradesh 208025, India'),
('Shalini Dubey', 'shalini.dubey@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543257', 'ROLE_PATIENT', 'FEMALE', '1995-10-04', 'Villa 234, Sanjay Place, Agra, Uttar Pradesh 282002, India'),
('Nikhil Sinha', 'nikhil.sinha@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543258', 'ROLE_PATIENT', 'MALE', '1990-12-11', 'House 67, Jayendraganj, Gwalior, Madhya Pradesh 474009, India'),
('Shruti Gupta', 'shruti.gupta@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543259', 'ROLE_PATIENT', 'FEMALE', '1992-02-26', 'Apartment 9A, Vijayanagar, Mysore, Karnataka 570017, India'),
('Vishal Bhardwaj', 'vishal.bhardwaj@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543260', 'ROLE_PATIENT', 'MALE', '1986-04-17', 'Plot 456, Sector 15, Faridabad, Haryana 121007, India'),
('Tanvi Deshmukh', 'tanvi.deshmukh@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543261', 'ROLE_PATIENT', 'FEMALE', '1998-07-09', 'Flat 3C, Shivaji Nagar, Nagpur, Maharashtra 440010, India'),
('Harsh Agarwal', 'harsh.agarwal@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543262', 'ROLE_PATIENT', 'MALE', '1989-05-20', 'House 890, Civil Lines, Allahabad, Uttar Pradesh 211001, India'),
('Preeti Kapoor', 'preeti.kapoor@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543263', 'ROLE_PATIENT', 'FEMALE', '1991-08-13', 'Villa 123, Defence Colony, Amritsar, Punjab 143001, India'),
('Gaurav Singhal', 'gaurav.singhal@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543264', 'ROLE_PATIENT', 'MALE', '1993-10-25', 'Apartment 11D, Vasundhara, Ghaziabad, Uttar Pradesh 201012, India'),
('Sakshi Mehta', 'sakshi.mehta@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543265', 'ROLE_PATIENT', 'FEMALE', '1996-12-30', 'House 234, Sector 21, Panchkula, Haryana 134109, India'),
('Abhishek Rao', 'abhishek.rao@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543266', 'ROLE_PATIENT', 'MALE', '1987-02-14', 'Plot 567, Banjara Hills, Hyderabad, Telangana 500034, India'),
('Isha Patel', 'isha.patel@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543267', 'ROLE_PATIENT', 'FEMALE', '1994-06-18', 'Flat 6B, Vastrapur, Ahmedabad, Gujarat 380015, India'),
('Mohit Sharma', 'mohit.sharma@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543268', 'ROLE_PATIENT', 'MALE', '1990-09-22', 'House 345, Malviya Nagar, Jaipur, Rajasthan 302017, India'),
('Nikita Singh', 'nikita.singh@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543269', 'ROLE_PATIENT', 'FEMALE', '1997-11-05', 'Apartment 8C, Gomti Nagar, Lucknow, Uttar Pradesh 226010, India'),
('Aryan Khanna', 'aryan.khanna@gmail.com', '$2b$12$deBSKaDqzEec7AA4.oizHeFVW7C1CNRCU8OZsd/6jrLRKxGmjgyCu', '+91-9876543270', 'ROLE_PATIENT', 'MALE', '1988-03-31', 'Villa 789, Greater Kailash, New Delhi 110048, India');

-- =========================================
-- DOCTOR PROFILES (15 doctors with specializations)
-- =========================================
INSERT INTO doctors (user_id, experience, available_hours, specialization) VALUES
(3, 18, 'Mon-Fri: 9:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM', 'Cardiology'),
(4, 15, 'Mon-Sat: 10:00 AM - 6:00 PM', 'Pediatrics'),
(5, 22, 'Mon-Fri: 8:00 AM - 4:00 PM', 'Orthopedics'),
(6, 12, 'Tue-Sat: 11:00 AM - 7:00 PM', 'Dermatology'),
(7, 20, 'Mon-Fri: 9:00 AM - 5:00 PM', 'Neurology'),
(8, 16, 'Mon-Sat: 10:00 AM - 6:00 PM', 'Gynecology'),
(9, 14, 'Mon-Fri: 8:00 AM - 4:00 PM, Sat: 9:00 AM - 2:00 PM', 'General Medicine'),
(10, 13, 'Mon-Sat: 9:00 AM - 5:00 PM', 'ENT (Otolaryngology)'),
(11, 25, 'Mon-Fri: 10:00 AM - 6:00 PM', 'Gastroenterology'),
(12, 14, 'Tue-Sat: 11:00 AM - 7:00 PM', 'Psychiatry'),
(13, 19, 'Mon-Fri: 8:30 AM - 4:30 PM', 'Endocrinology'),
(14, 17, 'Mon-Sat: 9:30 AM - 5:30 PM', 'Oncology'),
(15, 21, 'Mon-Fri: 9:00 AM - 5:00 PM', 'Pulmonology'),
(16, 16, 'Tue-Sat: 10:00 AM - 6:00 PM', 'Rheumatology'),
(17, 23, 'Mon-Fri: 8:00 AM - 4:00 PM, Sat: 9:00 AM - 1:00 PM', 'Urology');

-- =========================================
-- PATIENT PROFILES (40 patients)
-- =========================================
INSERT INTO patients (user_id) VALUES
(18), (19), (20), (21), (22), (23), (24), (25), (26), (27),
(28), (29), (30), (31), (32), (33), (34), (35), (36), (37),
(38), (39), (40), (41), (42), (43), (44), (45), (46), (47),
(48), (49), (50), (51), (52), (53), (54), (55), (56), (57);

-- =========================================
-- APPOINTMENTS (60 appointments with varied statuses)
-- =========================================
-- Distribution: SCHEDULED (20), CONFIRMED (15), COMPLETED (20), CANCELED (5)

-- SCHEDULED Appointments (20) - Future dates
INSERT INTO appointments (appointment_date_time, status, notes, appointment_code, doctor_id, patient_id) VALUES
('2025-12-15 10:00:00', 'SCHEDULED', 'Regular cardiac checkup - ECG and BP monitoring', 'APT-2025-001', 3, 18),
('2025-12-15 14:30:00', 'SCHEDULED', 'Child vaccination - MMR vaccine due', 'APT-2025-002', 4, 19),
('2025-12-16 09:00:00', 'SCHEDULED', 'Knee pain consultation - possible physiotherapy referral', 'APT-2025-003', 5, 20),
('2025-12-16 11:00:00', 'SCHEDULED', 'Skin rash examination - allergy testing needed', 'APT-2025-004', 6, 21),
('2025-12-17 15:30:00', 'SCHEDULED', 'Migraine follow-up - medication review', 'APT-2025-005', 7, 22),
('2025-12-17 10:30:00', 'SCHEDULED', 'Prenatal checkup - 20 weeks scan', 'APT-2025-006', 8, 23),
('2025-12-18 11:00:00', 'SCHEDULED', 'Annual health checkup - complete blood work', 'APT-2025-007', 9, 24),
('2025-12-18 13:00:00', 'SCHEDULED', 'Chronic sinusitis treatment - CT scan review', 'APT-2025-008', 10, 25),
('2025-12-19 09:30:00', 'SCHEDULED', 'Acid reflux consultation - endoscopy scheduled', 'APT-2025-009', 11, 26),
('2025-12-19 16:00:00', 'SCHEDULED', 'Depression therapy session - medication adjustment', 'APT-2025-010', 12, 27),
('2025-12-20 10:00:00', 'SCHEDULED', 'Diabetes management - HbA1c results review', 'APT-2025-011', 13, 28),
('2025-12-20 12:00:00', 'SCHEDULED', 'Breast cancer screening - mammography follow-up', 'APT-2025-012', 14, 29),
('2025-12-21 14:30:00', 'SCHEDULED', 'Asthma control assessment - spirometry test', 'APT-2025-013', 15, 30),
('2025-12-21 11:30:00', 'SCHEDULED', 'Rheumatoid arthritis follow-up - joint examination', 'APT-2025-014', 16, 31),
('2025-12-22 15:00:00', 'SCHEDULED', 'Prostate checkup - PSA test results discussion', 'APT-2025-015', 17, 32),
('2025-12-23 10:00:00', 'SCHEDULED', 'Post-surgery follow-up - wound healing assessment', 'APT-2025-016', 3, 33),
('2025-12-23 14:00:00', 'SCHEDULED', 'Child developmental assessment - 2 year milestone', 'APT-2025-017', 4, 34),
('2025-12-24 09:00:00', 'SCHEDULED', 'Sports injury consultation - ankle sprain treatment', 'APT-2025-018', 5, 35),
('2025-12-24 11:00:00', 'SCHEDULED', 'Acne treatment follow-up - isotretinoin monitoring', 'APT-2025-019', 6, 36),
('2025-12-26 10:30:00', 'SCHEDULED', 'Stroke risk assessment - carotid ultrasound review', 'APT-2025-020', 7, 37);

-- CONFIRMED Appointments (15) - Near future with confirmation
INSERT INTO appointments (appointment_date_time, status, notes, appointment_code, doctor_id, patient_id) VALUES
('2025-12-27 10:00:00', 'CONFIRMED', 'Confirmed: Heart failure management - Echo scheduled', 'APT-2025-021', 3, 38),
('2025-12-27 11:00:00', 'CONFIRMED', 'Confirmed: Infant wellness visit - growth tracking', 'APT-2025-022', 4, 39),
('2025-12-28 09:00:00', 'CONFIRMED', 'Confirmed: Hip replacement consultation - X-ray review', 'APT-2025-023', 5, 40),
('2025-12-28 14:00:00', 'CONFIRMED', 'Confirmed: Psoriasis treatment - biologics discussion', 'APT-2025-024', 6, 41),
('2025-12-29 15:30:00', 'CONFIRMED', 'Confirmed: Seizure disorder follow-up - EEG results', 'APT-2025-025', 7, 42),
('2025-12-29 10:30:00', 'CONFIRMED', 'Confirmed: High-risk pregnancy monitoring - ultrasound', 'APT-2025-026', 8, 43),
('2025-12-30 11:00:00', 'CONFIRMED', 'Confirmed: Hypertension management - medication review', 'APT-2025-027', 9, 44),
('2025-12-30 13:00:00', 'CONFIRMED', 'Confirmed: Hearing loss evaluation - audiometry test', 'APT-2025-028', 10, 45),
('2025-12-31 09:30:00', 'CONFIRMED', 'Confirmed: Liver function assessment - ultrasound guided', 'APT-2025-029', 11, 46),
('2025-12-31 16:00:00', 'CONFIRMED', 'Confirmed: Anxiety disorder therapy - CBT session', 'APT-2025-030', 12, 47),
('2026-01-02 10:00:00', 'CONFIRMED', 'Confirmed: Thyroid disorder management - TSH review', 'APT-2025-031', 13, 48),
('2026-01-02 12:00:00', 'CONFIRMED', 'Confirmed: Chemotherapy planning session - CT scan review', 'APT-2025-032', 14, 49),
('2026-01-03 14:30:00', 'CONFIRMED', 'Confirmed: COPD management - oxygen therapy assessment', 'APT-2025-033', 15, 50),
('2026-01-03 11:30:00', 'CONFIRMED', 'Confirmed: Lupus flare management - immunology review', 'APT-2025-034', 16, 51),
('2026-01-04 15:00:00', 'CONFIRMED', 'Confirmed: Kidney stone treatment - lithotripsy planning', 'APT-2025-035', 17, 52);

-- COMPLETED Appointments (20) - Past dates
INSERT INTO appointments (appointment_date_time, status, notes, appointment_code, doctor_id, patient_id) VALUES
('2024-10-15 10:00:00', 'COMPLETED', 'Completed: Routine cardiac screening - ECG normal', 'APT-2024-036', 3, 53),
('2024-10-20 11:30:00', 'COMPLETED', 'Completed: Vaccination administered - no adverse reactions', 'APT-2024-037', 4, 54),
('2024-10-25 09:00:00', 'COMPLETED', 'Completed: Physiotherapy referral given - exercises prescribed', 'APT-2024-038', 5, 55),
('2024-11-01 14:00:00', 'COMPLETED', 'Completed: Skin allergy treatment - topical steroids prescribed', 'APT-2024-039', 6, 56),
('2024-11-05 15:30:00', 'COMPLETED', 'Completed: MRI scan reviewed - no abnormalities found', 'APT-2024-040', 7, 57),
('2024-11-10 10:30:00', 'COMPLETED', 'Completed: Ultrasound performed - healthy fetus confirmed', 'APT-2024-041', 8, 18),
('2024-11-15 11:00:00', 'COMPLETED', 'Completed: Blood work reviewed - all parameters normal', 'APT-2024-042', 9, 19),
('2024-11-18 13:00:00', 'COMPLETED', 'Completed: Ear wax removal procedure - hearing improved', 'APT-2024-043', 10, 20),
('2024-11-20 09:30:00', 'COMPLETED', 'Completed: Endoscopy performed - mild gastritis diagnosed', 'APT-2024-044', 11, 21),
('2024-11-22 16:00:00', 'COMPLETED', 'Completed: Cognitive behavioral therapy session completed', 'APT-2024-045', 12, 22),
('2024-11-25 10:00:00', 'COMPLETED', 'Completed: Insulin dosage adjusted - glucose levels improved', 'APT-2024-046', 13, 23),
('2024-11-28 12:00:00', 'COMPLETED', 'Completed: Biopsy results discussed - benign findings', 'APT-2024-047', 14, 24),
('2024-11-30 14:30:00', 'COMPLETED', 'Completed: Nebulizer treatment administered - breathing improved', 'APT-2024-048', 15, 25),
('2024-12-02 11:30:00', 'COMPLETED', 'Completed: Joint injection performed - pain relief expected', 'APT-2024-049', 16, 26),
('2024-12-04 15:00:00', 'COMPLETED', 'Completed: Cystoscopy performed - bladder healthy', 'APT-2024-050', 17, 27),
('2024-12-06 10:00:00', 'COMPLETED', 'Completed: Stress test performed - cardiac function normal', 'APT-2024-051', 3, 28),
('2024-12-08 11:00:00', 'COMPLETED', 'Completed: Growth chart updated - development on track', 'APT-2024-052', 4, 29),
('2024-12-09 09:00:00', 'COMPLETED', 'Completed: X-ray reviewed - fracture healing well', 'APT-2024-053', 5, 30),
('2024-12-10 14:00:00', 'COMPLETED', 'Completed: Patch test performed - allergens identified', 'APT-2024-054', 6, 31),
('2024-12-11 15:30:00', 'COMPLETED', 'Completed: Lumbar puncture performed - results pending', 'APT-2024-055', 7, 32);

-- CANCELED Appointments (5) - Various reasons
INSERT INTO appointments (appointment_date_time, status, notes, appointment_code, doctor_id, patient_id) VALUES
('2024-11-12 10:00:00', 'CANCELED', 'Patient canceled: Rescheduling requested due to work commitment', 'APT-2024-056', 8, 33),
('2024-11-16 11:00:00', 'CANCELED', 'Doctor unavailable: Emergency surgery scheduled', 'APT-2024-057', 9, 34),
('2024-11-20 09:00:00', 'CANCELED', 'Patient no-show: Unable to contact patient', 'APT-2024-058', 10, 35),
('2024-11-24 14:00:00', 'CANCELED', 'Patient canceled: Family emergency - will reschedule', 'APT-2024-059', 11, 36),
('2024-11-28 15:30:00', 'CANCELED', 'Facility closed: Power outage - patients notified', 'APT-2024-060', 12, 37);

-- =========================================
-- DATA SUMMARY
-- =========================================
-- Display summary of inserted data
SELECT 'Database populated successfully with comprehensive sample data!' as message;
SELECT '============================================' as separator;
SELECT 'USER STATISTICS' as category;
SELECT COUNT(*) as total_users FROM users;
SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role;
SELECT '============================================' as separator;
SELECT 'DOCTOR STATISTICS' as category;
SELECT COUNT(*) as total_doctors FROM doctors;
SELECT specialization, COUNT(*) as count FROM doctors GROUP BY specialization ORDER BY specialization;
SELECT '============================================' as separator;
SELECT 'PATIENT STATISTICS' as category;
SELECT COUNT(*) as total_patients FROM patients;
SELECT '============================================' as separator;
SELECT 'APPOINTMENT STATISTICS' as category;
SELECT COUNT(*) as total_appointments FROM appointments;
SELECT status, COUNT(*) as count FROM appointments GROUP BY status ORDER BY status;
SELECT '============================================' as separator;
SELECT 'Sample data includes:' as info;
SELECT '- 2 Admin users' as detail UNION ALL
SELECT '- 15 Doctors across 15 specializations' UNION ALL
SELECT '- 40 Patient users' UNION ALL
SELECT '- 60 Appointments with realistic statuses and notes' UNION ALL
SELECT '- All passwords are BCrypt hashed' UNION ALL
SELECT '- Addresses include complete Indian locations';

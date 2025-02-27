INSERT INTO Vendor (Address1,City,Province,PostalCode,Phone,Type,Name,Email) VALUES 
    ('123 Maple St','London','On', 'N1N-1N1','(555)555-5555','Trusted','ABC Supply Co.','abc@supply.com'),
    ('543 Sycamore Ave','Toronto','On', 'N1P-1N1','(999)555-5555','Trusted','Big Bills Depot','bb@depot.com'),
    ('922 Oak St','London','On', 'N1N-1N1','(555)555-5599','Untrusted','Shady Sams','ss@underthetable.com'),
    ('922 Oak St','London','On', 'N1N-1N1','(555)555-5599','Untrusted','Nick Goudsbloem','ng@underthetable.com');

-- CREATE TABLE Product (
--     id VARCHAR(255) PRIMARY KEY AUTO_INCREMENT,
--     vendorid INT,
--     name VARCHAR(255),
--     costprice DECIMAL,
--     msrp DECIMAL,
--     rop INT,
--     eoq INT,
--     qoh INT,
--     qoo INT,
--     qrcode CLOB,
--     qrcodetxt CLOB
-- );

INSERT INTO product (id, vendorid, name, costprice, msrp, rop, eoq, qoh, qoo, qrcode, qrcodetxt) VALUES
    ('12x34', 3, 'Iphone', 100.00, 150.00, 10, 50, 50, 20, null, null),
    ('12x35', 2, 'Samsung', 80.00, 120.00, 15, 45, 32, 30, null, null),
    ('12x36', 3, 'BlackBerry', 120.00, 180.00, 12, 16, 80, 25, null, null),
    ('12x37', 4, 'LG', 120.00, 180.00, 12, 51, 80, 25, null, null),
    ('12x38', 4, 'HTC', 120.00, 180.00, 12, 23, 80, 25, null, null),
    ('12x39', 4, 'Lenovo', 120.00, 180.00, 12, 30, 80, 25, null, null),
    ('12x40', 2, 'Toshiba', 120.00, 180.00, 12, 30, 80, 25, null, null),
    ('12x41', 1, 'Google', 120.00, 180.00, 12, 30, 80, 25, null, null),
    ('12x42', 3, 'Acer', 120.00, 180.00, 12, 30, 80, 25, null, null),
    ('12x43', 1, 'Asus', 120.00, 180.00, 12, 30, 80, 25, null, null),
    ('12x44', 2, 'Huawei', 120.00, 180.00, 12, 40, 80, 25, null, null);
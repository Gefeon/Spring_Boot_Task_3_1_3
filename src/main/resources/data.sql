/* ADMIN password: admin, USER2 password: user */

INSERT INTO roles(id, role) VALUES(1, 'ROLE_ADMIN'), (2, 'ROLE_USER');
INSERT INTO users VALUES(1, 99, 'Admin', '$2a$12$5mybqhYw8EpI3/xCGplaA.2jLAB7EIiG2HjN5XPR36NJ.WMamZtFC', '+79998765432', 'Admin', 'ADMIN'), (2, 18, 'User', '$2a$12$Mb2JruzI9zwCSj8Z9hZVi.gOJV4ZMNWKf0EuAfCzZPEXzMlyNstj.', '+79998761234', 'User', 'USER2');
INSERT INTO users_roles(users_id, roles_id) VALUES(1, 1), (1, 2), (2, 2);
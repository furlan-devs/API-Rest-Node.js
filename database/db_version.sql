drop table users;
drop table productimages;
drop table orders;
drop table products;
drop table categories;

CREATE TABLE IF NOT EXISTS products (
    productId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(45),
    price FLOAT,
    productImage VARCHAR(255),
    categoryId INT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    orderId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    productId INT,
    quantity INT,
    FOREIGN KEY (productId) REFERENCES products (productId)
);

CREATE TABLE IF NOT EXISTS users (
    userId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100),
    password VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS productImages (
    imageId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    productId INT,
    path VARCHAR(255),
    FOREIGN KEY (productId) REFERENCES products (productId)
);

CREATE TABLE IF NOT EXISTS categories (
    categoryId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
);


INSERT INTO categories (categoryId, name) VALUES (1, 'Eletrodoméstico');

ALTER TABLE products ADD CONSTRAINT fk_product_category
FOREIGN KEY (categoryId) REFERENCES categories(categoryId);